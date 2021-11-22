import React, { useState, useEffect } from 'react';
import {
	Area,
	Bar,
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
	AreaChart,
	Brush,
	LineChart
} from 'recharts';
import { Card, Radio, Select } from 'antd';
import { statisticalApi } from './../../apiBase/statistical/statistical-total';

const RevenueChart = () => {
	const [typeView, setTypeView] = useState(3);
	const [statisticalRevenueYear, setStatisticalRevenueYear] = useState<IStatRevenueYear[]>([]);
	const [statisticalRevenueMonth, setStatisticalRevenueMonth] = useState<IStatRevenueMonth[]>([]);
	const [statisticalRevenueDay, setStatisticalRevenueDay] = useState<IStatRevenueDay[]>([]);
	const [isLoading, setIsLoading] = useState({
		status: '',
		loading: false
	});
	const [todoApi, setTodoApi] = useState({
		branch: 0,
		StartYear: 2017,
		EndYear: 2022,
		Year: new Date().getFullYear(),
		Month: new Date().getMonth() + 1
	});

	const onChange = (e) => {
		setTypeView(e.target.value);
	};

	const { Option } = Select;

	const handleChangeYear = (value) => {
		setTodoApi({ ...todoApi, Year: value });
	};
	const handleChangeMonth = (value) => {
		setTodoApi({ ...todoApi, Month: value });
	};

	const formatYAxis = (tickItem) => {
		return new Intl.NumberFormat('de-DE').format(tickItem);
	};

	const formatTooltip = (value, name, props) => {
		return new Intl.NumberFormat('de-DE').format(value);
	};

	const getStatisticalRevenueYear = async () => {
		setIsLoading({ status: 'GET_STAT_REVENUE', loading: true });
		try {
			let res = await statisticalApi.getStatisticalRevenueYear(todoApi);
			if (res.status == 200) {
				setStatisticalRevenueYear(res.data.data);
			}
			if (res.status == 204) {
				setStatisticalRevenueYear([]);
			}
		} catch (error) {
			// showNoti("danger", "get data statistical revenue year error");
		} finally {
			setIsLoading({ status: 'GET_STAT_REVENUE', loading: false });
		}
	};

	const getStatisticalRevenueMonth = async () => {
		setIsLoading({ status: 'GET_STAT_REVENUE', loading: true });
		try {
			let res = await statisticalApi.getStatisticalRevenueMonth(todoApi);
			if (res.status == 200) {
				setStatisticalRevenueMonth(res.data.data);
			}
			if (res.status == 204) {
				setStatisticalRevenueMonth([]);
			}
		} catch (error) {
			// showNoti("danger", "get data revenue day faile");
		} finally {
			setIsLoading({ status: 'GET_STAT_REVENUE', loading: false });
		}
	};

	const getStatisticalRevenueDay = async () => {
		setIsLoading({ status: 'GET_STAT_REVENUE', loading: true });
		try {
			let res = await statisticalApi.getStatisticalRevenueDay(todoApi);
			if (res.status == 200) {
				setStatisticalRevenueDay(res.data.data);
			}
			if (res.status == 204) {
				setStatisticalRevenueDay([]);
			}
		} catch (error) {
			// showNoti("danger", "get data revenue day faile");
		} finally {
			setIsLoading({ status: 'GET_STAT_REVENUE', loading: false });
		}
	};

	const renderView = () => {
		if (typeView == 1) {
			return (
				<LineChart data={statisticalRevenueMonth} syncId="anyId" margin={{ top: 10, right: 0, left: 25, bottom: 0 }}>
					<XAxis dataKey="Month" tickMargin={3} />
					<YAxis type="number" tickFormatter={formatYAxis} />
					<CartesianGrid strokeDasharray="3 3" />
					<Tooltip formatter={formatTooltip} labelFormatter={(value) => `Tháng ${value}`} />
					<Line type="monotone" dataKey="Revenue" stroke="#003366" fill="#003366" activeDot={{ r: 8 }} name="Doanh thu(đồng)" />
					<Bar dataKey="Revenue" fill="#0080FF" name="Doanh thu(đồng)" />
				</LineChart>
			);
		} else if (typeView == 2) {
			return (
				<ComposedChart data={statisticalRevenueYear} margin={{ top: 10, right: 0, left: 25, bottom: 0 }}>
					<XAxis dataKey="Year" />
					<YAxis tickFormatter={formatYAxis} />
					<Tooltip formatter={formatTooltip} labelFormatter={(value) => `Năm ${value}`} />
					<CartesianGrid stroke="#f5f5f5" />
					{/* <Line type="monotone" dataKey="Revenue" activeDot={{ r: 8 }} stroke="#003366" name="Doanh thu(đồng)" /> */}
					<Bar dataKey="Revenue" fill="#0080FF" barSize={20} name="Doanh thu(đồng)" />
				</ComposedChart>
			);
		} else if (typeView == 3) {
			return (
				<LineChart data={statisticalRevenueDay} syncId="anyId" margin={{ top: 10, right: 5, left: 25, bottom: 0 }}>
					<XAxis dataKey="Day" />
					<YAxis tickFormatter={formatYAxis} />
					<CartesianGrid strokeDasharray="3 3" />
					<Tooltip formatter={formatTooltip} labelFormatter={(value) => `Ngày ${value}`} />
					<Line type="monotone" dataKey="Revenue" stroke="#003366" fill="#003366" activeDot={{ r: 8 }} name="Doanh thu(đồng)" />
					<Bar dataKey="Revenue" fill="#0080FF" name="Doanh thu(đồng)" />
				</LineChart>
			);
		}
	};

	const renderExtra = () => {
		if (typeView == 1) {
			return (
				<>
					<Select
						value={todoApi.Year}
						style={{ width: 120 }}
						onChange={handleChangeYear}
						loading={isLoading.loading && isLoading.status === 'GET_STAT_REVENUE'}
					>
						{statisticalRevenueYear.map((item, index) => {
							return (
								<Option value={item.Year} key={index}>
									Năm {item.Year}
								</Option>
							);
						})}
					</Select>
				</>
			);
		} else if (typeView == 3) {
			return (
				<>
					<Select
						loading={isLoading.loading && isLoading.status === 'GET_STAT_REVENUE'}
						value={todoApi.Year}
						style={{ width: 120 }}
						onChange={handleChangeYear}
					>
						{statisticalRevenueYear.map((item, index) => {
							return (
								<Option value={item.Year} key={index}>
									Năm {item.Year}
								</Option>
							);
						})}
					</Select>
					<Select
						loading={isLoading.loading && isLoading.status === 'GET_STAT_REVENUE'}
						value={todoApi.Month}
						style={{ width: 120 }}
						onChange={handleChangeMonth}
					>
						{statisticalRevenueMonth.map((item, index) => {
							return (
								<Option value={item.Month} key={index}>
									Tháng {item.Month}
								</Option>
							);
						})}
					</Select>
				</>
			);
		}
	};

	useEffect(() => {
		getStatisticalRevenueYear();
		getStatisticalRevenueMonth();
		getStatisticalRevenueDay();
	}, [todoApi]);
	return (
		<>
			<Card
				title={<h4>BIỂU ĐỒ DOANH THU</h4>}
				style={{ borderRadius: 20 }}
				extra={
					<>
						{renderExtra()}
						<Radio.Group onChange={onChange} optionType="button" buttonStyle="solid" value={typeView}>
							<Radio.Button value={3}>Ngày</Radio.Button>
							<Radio.Button value={1}>Tháng</Radio.Button>
							<Radio.Button value={2}>Năm</Radio.Button>
						</Radio.Group>
					</>
				}
			>
				<ResponsiveContainer width="100%" height={280}>
					{renderView()}
				</ResponsiveContainer>
			</Card>
		</>
	);
};

export default RevenueChart;
