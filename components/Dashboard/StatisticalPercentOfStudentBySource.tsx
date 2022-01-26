import { Skeleton } from 'antd';
import React, { useState, useEffect } from 'react';
import { statisticalApi } from '~/apiBase/statistical/statistical-total';
import BarChartStatistical from './BarChart';

const StatisticalRate = () => {
	const [statisticalPercentStudentBySource, setStatisticalPercentStudentBySource] = useState<IStatDataBarChart[]>([]);
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

	const getPercentOfStudentBySource = async () => {
		setIsLoading({ status: 'GET_STAT_PERCENT_STUDENT_BY_SOURCE', loading: true });
		try {
			let res = await statisticalApi.getPercentOfStudentBySource();
			if (res.status === 200) {
				let temp = [];
				res.data.data.forEach((item) =>
					temp.push({
						ID: item.SourceInformationID,
						dataKey: item.SourceInformationName,
						value: item.Amount,
						title: 'TỈ LỆ HỌC VIÊN THEO NGUỒN'
					})
				);
				setStatisticalPercentStudentBySource(temp);
			}
			if (res.status === 204) {
				setStatisticalPercentStudentBySource([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'GET_STAT_PERCENT_STUDENT_BY_SOURCE', loading: false });
		}
	};

	useEffect(() => {
		getPercentOfStudentBySource();
	}, []);

	return (
		<>
			{isLoading.status === 'GET_STAT_PERCENT_STUDENT_BY_SOURCE' && isLoading.loading == true ? (
				<div className="row pt-5 pb-5">
					<Skeleton active />
				</div>
			) : (
				<div className="row pt-5 pb-5">
					<div className="col-12">
						<BarChartStatistical
							title={'Thống kê phần trăm học viên theo nguồn'}
							dataStatistical={statisticalPercentStudentBySource}
							colorTick="#dd4667"
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default StatisticalRate;
