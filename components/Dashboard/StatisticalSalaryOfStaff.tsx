import { DatePicker, Skeleton } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { statisticalApi } from '~/apiBase/statistical/statistical-total';
import BarChartStatistical from './BarChart';

const StatisticalRate = () => {
	const [statisticalSalaryOfStaff, setStatisticalSalaryOfStaff] = useState<IStatDataBarChart[]>([]);
	const [isLoading, setIsLoading] = useState({
		status: '',
		loading: false
	});
	const [period, setPeriod] = useState({
		fromDate: '',
		toDate: ''
	});

	const { RangePicker } = DatePicker;
	const renderRangePickerDate = () => {
		return (
			<RangePicker
				allowClear={true}
				className="style-input"
				onChange={(date) => {
					setPeriod({
						fromDate: moment(date[0]).format('YYYY/MM/DD'),
						toDate: moment(date[1]).format('YYYY/MM/DD')
					});
				}}
			/>
		);
	};

	const getStatisticalSalaryOfStaff = async () => {
		setIsLoading({ status: 'GET_STAT_SALARY_OF_STAFF', loading: true });
		try {
			let res = await statisticalApi.getStatisticalSalaryOfStaff(period);
			if (res.status === 200) {
				let temp = [];
				res.data.data.forEach((item) =>
					temp.push({
						ID: item.RoleID,
						dataKey: item.RoleName,
						value: item.SalaryTotal,
						title: 'Tổng lương theo chức vụ'
					})
				);
				setStatisticalSalaryOfStaff(temp);
			}
			if (res.status === 204) {
				setStatisticalSalaryOfStaff([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'GET_STAT_SALARY_OF_STAFF', loading: false });
		}
	};

	useEffect(() => {
		getStatisticalSalaryOfStaff();
	}, [period]);

	return (
		<>
			{isLoading.status === 'GET_STAT_SALARY_OF_STAFF' && isLoading.loading == true ? (
				<div className="row pt-5 pb-5">
					<Skeleton active />
				</div>
			) : (
				<div className="row pt-5 pb-5">
					<div className="col-12">
						<BarChartStatistical
							title={'Lương theo chức vụ'}
							dataStatistical={statisticalSalaryOfStaff}
							extra={renderRangePickerDate()}
							colorTick="#4cbbb9"
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default StatisticalRate;
