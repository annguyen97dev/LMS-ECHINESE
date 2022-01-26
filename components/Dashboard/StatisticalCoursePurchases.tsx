import { Skeleton } from 'antd';
import React, { useState, useEffect } from 'react';
import { statisticalApi } from '~/apiBase/statistical/statistical-total';
import BarChartStatistical from './BarChart';

const StatisticalRate = () => {
	const [statisticalCoursePurchases, setStatisticalCoursePurchases] = useState<IStatDataBarChart[]>([]);
	const [isLoading, setIsLoading] = useState({
		status: '',
		loading: false
	});

	const getStatisticalCoursePurchases = async () => {
		setIsLoading({ status: 'GET_STAT_COURSE_PURCHASES', loading: true });
		try {
			let res = await statisticalApi.getStatisticalCoursePurchases();
			if (res.status === 200) {
				let temp = [];
				res.data.data.forEach((item) =>
					temp.push({
						ID: item.ID,
						dataKey: item.CourseName,
						sortName: item.CourseName.slice(0, 13).concat('...'),
						value: item.TotalPurchases,
						title: 'Khóa học có lượt mua cao nhất'
					})
				);
				setStatisticalCoursePurchases(temp);
			}
			if (res.status === 204) {
				setStatisticalCoursePurchases([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'GET_STAT_COURSE_PURCHASES', loading: false });
		}
	};

	useEffect(() => {
		getStatisticalCoursePurchases();
	}, []);

	return (
		<>
			{isLoading.status === 'GET_STAT_COURSE_PURCHASES' && isLoading.loading == true ? (
				<div className="row pt-5 pb-5">
					<Skeleton active />
				</div>
			) : (
				<div className="row pt-5 pb-5">
					<div className="col-12">
						<BarChartStatistical
							title={'Thống kê khóa học có lượt mua cao nhất'}
							dataStatistical={statisticalCoursePurchases}
							colorTick="#162b5b"
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default StatisticalRate;
