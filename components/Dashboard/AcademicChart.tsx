import React, { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Select, Card, Radio } from 'antd';
import { statisticalApi } from '~/apiBase/statistical/statistical-total';

const AcademicChart = () => {
	const [statisticalStudentYear, setStatisticalStudentYear] = useState<IStatStudentYear[]>([]);
	const [statisticalStudentMonth, setStatisticalStudentMonth] = useState<IStatStudentMonth[]>([]);
	const [statisticalStudentDay, setStatisticalStudentDay] = useState<IStatStudentDay[]>([]);
	const [typeView, setTypeView] = useState(1);
	const [isLoading, setIsLoading] = useState({
		status: '',
		loading: false
	});
	const [todoApiStudent, setTodoApiStudent] = useState({
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
		setTodoApiStudent({ ...todoApiStudent, Year: value });
	};
	const handleChangeMonth = (value) => {
		setTodoApiStudent({ ...todoApiStudent, Month: value });
	};

	const formatYAxis = (tickItem) => {
		return new Intl.NumberFormat('de-DE').format(tickItem);
	};

	const formatTooltip = (value, name, props) => {
		return new Intl.NumberFormat('de-DE').format(value);
	};

	const renderView = () => {
		if (typeView == 1) {
			return (
				<ResponsiveContainer width="100%" height={280}>
					<BarChart data={statisticalStudentDay} margin={{ top: 10, right: 0, left: -15, bottom: 0 }}>
						<XAxis dataKey="Day" />
						<YAxis type="number" tickFormatter={formatYAxis} />
						<CartesianGrid strokeDasharray="3 3" />
						<Tooltip formatter={formatTooltip} labelFormatter={(value) => `Ngày ${value}`} />
						<Legend />
						<Bar dataKey="Amount" fill="#0080FF" name="Học viên đã đăng kí" />
					</BarChart>
				</ResponsiveContainer>
			);
		} else if (typeView == 2) {
			return (
				<ResponsiveContainer width="100%" height={280}>
					<BarChart data={statisticalStudentMonth} margin={{ top: 10, right: 0, left: -15, bottom: 0 }}>
						<XAxis dataKey="Month" />
						<YAxis type="number" tickFormatter={formatYAxis} />
						<CartesianGrid strokeDasharray="3 3" />
						<Tooltip formatter={formatTooltip} labelFormatter={(value) => `Tháng ${value}`} />
						<Legend />
						<Bar dataKey="Amount" fill="#0080FF" name="Học viên đã đăng kí" />
					</BarChart>
				</ResponsiveContainer>
			);
		} else if (typeView == 3) {
			return (
				<ResponsiveContainer width="100%" height={280}>
					<BarChart data={statisticalStudentYear} margin={{ top: 10, right: 0, left: -15, bottom: 0 }}>
						<XAxis dataKey="Year" />
						<YAxis type="number" tickFormatter={formatYAxis} />
						<CartesianGrid strokeDasharray="3 3" />
						<Tooltip formatter={formatTooltip} labelFormatter={(value) => `Năm ${value}`} />
						<Legend />
						<Bar dataKey="Amount" fill="#0080FF" name="Học viên đã đăng kí" />
					</BarChart>
				</ResponsiveContainer>
			);
		}
	};

	const renderExtra = () => {
		if (typeView == 1) {
			return (
				<>
					<Select
						value={todoApiStudent.Year}
						style={{ width: 120 }}
						onChange={handleChangeYear}
						loading={isLoading.loading && isLoading.status === 'GET_STAT_STUDENT'}
					>
						{statisticalStudentYear.map((item, index) => {
							return (
								<Option value={item.Year} key={index}>
									Năm {item.Year}
								</Option>
							);
						})}
					</Select>
					<Select
						loading={isLoading.loading && isLoading.status === 'GET_STAT_STUDENT'}
						value={todoApiStudent.Month}
						style={{ width: 120 }}
						onChange={handleChangeMonth}
					>
						{statisticalStudentMonth.map((item, index) => {
							return (
								<Option value={item.Month} key={index}>
									Tháng {item.Month}
								</Option>
							);
						})}
					</Select>
				</>
			);
		} else if (typeView == 2) {
			return (
				<Select
					loading={isLoading.loading && isLoading.status === 'GET_STAT_STUDENT'}
					value={todoApiStudent.Year}
					style={{ width: 120 }}
					onChange={handleChangeYear}
				>
					{statisticalStudentYear.map((item, index) => {
						return (
							<Option value={item.Year} key={index}>
								Năm {item.Year}
							</Option>
						);
					})}
				</Select>
			);
		}
	};

	const getStatisticalStudentYear = async () => {
		setIsLoading({ status: 'GET_STAT_STUDENT', loading: true });
		try {
			let res = await statisticalApi.getStatisticalStudentYear(todoApiStudent);
			console.log(res.data);
			if (res.status == 200) {
				setStatisticalStudentYear(res.data.data);
			}
		} catch (error) {
			// showNoti("danger", "get data student year faile");
		} finally {
			setIsLoading({ status: 'GET_STAT_STUDENT', loading: false });
		}
	};

	const getStatisticalStudentMonth = async () => {
		setIsLoading({ status: 'GET_STAT_STUDENT', loading: true });
		try {
			let res = await statisticalApi.getStatisticalStudentMonth(todoApiStudent);
			console.log(res.data);
			if (res.status == 200) {
				setStatisticalStudentMonth(res.data.data);
			}
		} catch (error) {
			// showNoti("danger", "get data student Month faile");
		} finally {
			setIsLoading({ status: 'GET_STAT_STUDENT', loading: false });
		}
	};

	const getStatisticalStudentDay = async () => {
		setIsLoading({ status: 'GET_STAT_STUDENT', loading: true });
		try {
			let res = await statisticalApi.getStatisticalStudentDay(todoApiStudent);
			console.log(res.data);
			if (res.status == 200) {
				setStatisticalStudentDay(res.data.data);
			}
		} catch (error) {
			// showNoti("danger", "get data student Day faile");
		} finally {
			setIsLoading({ status: 'GET_STAT_STUDENT', loading: false });
		}
	};

	useEffect(() => {
		getStatisticalStudentYear();
		getStatisticalStudentMonth();
		getStatisticalStudentDay();
	}, [todoApiStudent]);

	return (
		<>
			<Card
				title={
					<div>
						<h4>HỌC VIÊN</h4>
						<div>Số lượng học viên</div>
					</div>
				}
				style={{ borderRadius: 20 }}
				extra={
					<>
						{renderExtra()}
						<Radio.Group onChange={onChange} optionType="button" buttonStyle="solid" value={typeView}>
							<Radio.Button value={1}>Ngày</Radio.Button>
							<Radio.Button value={2}>Tháng</Radio.Button>
							<Radio.Button value={3}>Năm</Radio.Button>
						</Radio.Group>
					</>
				}
			>
				{renderView()}
			</Card>
		</>
	);
};

export default AcademicChart;
