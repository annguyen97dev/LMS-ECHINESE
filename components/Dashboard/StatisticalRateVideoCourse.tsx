import { Skeleton } from 'antd';
import React, { useState, useEffect } from 'react';
import { statisticalApi } from '~/apiBase/statistical/statistical-total';
import { dataPie } from '~/lib/dashboard/data';
import RateChart from './RateChart';

const StatisticalRate = () => {
	const [statisticalRateVideoCourse, setStatisticalRateVideoCourse] = useState<IStatRate[]>([]);
	const [inView, setInView] = useState(false);
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

	const getStatisticalRateVideoCourse = async () => {
		setIsLoading({ status: 'GET_STAT_RATE', loading: true });
		try {
			let res = await statisticalApi.getStatisticalRateVideoCourse();
			if (res.status === 200) {
				setStatisticalRateVideoCourse(res.data.data);
			}
			if (res.status === 204) {
				setStatisticalRateVideoCourse([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'GET_STAT_RATE', loading: false });
		}
	};

	useEffect(() => {
		getStatisticalRateVideoCourse();
	}, []);

	return (
		<>
			{isLoading.status === 'GET_STAT_RATE' && isLoading.loading == true ? (
				<div className="col-xl-6 col-12">
					<Skeleton active />
				</div>
			) : (
				<div className="col-xl-6 col-12">
					<div className="chart-comment">
						<RateChart
							statisticalRate={statisticalRateVideoCourse}
							dataPie={dataPie}
							isLoading={isLoading}
							type="VIDEO_COURSE"
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default StatisticalRate;
