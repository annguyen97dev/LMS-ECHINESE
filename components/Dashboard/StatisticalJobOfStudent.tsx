import { Skeleton } from 'antd';
import React, { useState, useEffect } from 'react';
import { statisticalApi } from '~/apiBase/statistical/statistical-total';
import BarChartStatistical from './BarChart';

const StatisticalRate = () => {
	const [statisticalJobOfStudent, setStatisticalJobOfStudent] = useState<IStatDataBarChart[]>([]);
	const [isLoading, setIsLoading] = useState({
		status: '',
		loading: false
	});

	const getStatisticalJobOfStudent = async () => {
		setIsLoading({ status: 'GET_STAT_JOB_OF_STUDENT', loading: true });
		try {
			let res = await statisticalApi.getStatisticalJobOfStudent();
			if (res.status === 200) {
				let temp = [];
				res.data.data.forEach((item) =>
					temp.push({
						ID: item.JobID,
						dataKey: item.JobName,
						value: item.Amount,
						title: 'Nghề nghiệp của học viên'
					})
				);
				setStatisticalJobOfStudent(temp);
			}
			if (res.status === 204) {
				setStatisticalJobOfStudent([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'GET_STAT_JOB_OF_STUDENT', loading: false });
		}
	};

	useEffect(() => {
		getStatisticalJobOfStudent();
	}, []);

	return (
		<>
			{isLoading.status === 'GET_STAT_JOB_OF_STUDENT' && isLoading.loading == true ? (
				<div className="row pt-5 pb-5">
					<Skeleton active />
				</div>
			) : (
				<div className="row pt-5 pb-5">
					<div className="col-12">
						<BarChartStatistical
							title={'Thống kê nghề nghiệp của học viên'}
							dataStatistical={statisticalJobOfStudent}
							colorTick="#ff7c38"
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default StatisticalRate;
