import { Skeleton } from 'antd';
import React, { useState, useEffect } from 'react';
import { statisticalApi } from '~/apiBase/statistical/statistical-total';
import BarChartStatistical from './BarChart';

const StatisticalRate = () => {
	const [statisticalAverageAgeOfStudent, setStatisticalAverageAgeOfStudent] = useState<IStatDataBarChart[]>([]);
	const [isLoading, setIsLoading] = useState({
		status: '',
		loading: false
	});

	const getAgerageAgeOfStudent = async () => {
		setIsLoading({ status: 'GET_STAT_AVERAGE_AGE', loading: true });
		try {
			let res = await statisticalApi.getAverageAgeOfStudent();
			if (res.status === 200) {
				let temp = [];
				res.data.data.forEach((item) =>
					temp.push({ ID: item.ID, dataKey: item.Age, value: item.Amount, title: 'SỐ HỌC VIÊN THEO ĐỘ TUỔI' })
				);
				setStatisticalAverageAgeOfStudent(temp);
			}
			if (res.status === 204) {
				setStatisticalAverageAgeOfStudent([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'GET_STAT_AVERAGE_AGE', loading: false });
		}
	};

	useEffect(() => {
		getAgerageAgeOfStudent();
	}, []);

	return (
		<>
			{isLoading.status === 'GET_STAT_AVERAGE_AGE' && isLoading.loading == true ? (
				<div className="row pt-5 pb-5">
					<Skeleton active />
				</div>
			) : (
				<div className="row pt-5 pb-5">
					<div className="col-12">
						<BarChartStatistical
							title={'Thống kê độ tuổi của học viên'}
							dataStatistical={statisticalAverageAgeOfStudent}
							colorTick="#c0183c"
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default StatisticalRate;
