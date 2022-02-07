import { Skeleton } from 'antd';
import React, { useState, useEffect } from 'react';
import { statisticalApi } from '~/apiBase/statistical/statistical-total';
import { dataPie } from '~/lib/dashboard/data';
import RateChart from './RateChart';

const StatisticalRate = () => {
	const [statisticalRate, setStatisticalRate] = useState<IStatRate[]>([]);
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

	const getStatisticalRate = async () => {
		setIsLoading({ status: 'STAT_GET_RATE', loading: true });
		try {
			let res = await statisticalApi.getStatisticalRate(todoApi);
			if (res.status == 200) {
				setStatisticalRate(res.data.data);
			}
			if (res.status == 204) {
				setStatisticalRate([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'STAT_GET_RATE', loading: false });
		}
	};

	useEffect(() => {
		getStatisticalRate();
	}, [todoApi]);

	return (
		<>
			{isLoading.status === 'GET_STAT_RATE' && isLoading.loading ? (
				<div className="col-xl-6 col-12">
					<Skeleton active />
				</div>
			) : (
				<div className="col-xl-6 col-12">
					<div className="chart-comment">
						<RateChart statisticalRate={statisticalRate} dataPie={dataPie} isLoading={isLoading} type="SELLER" />
					</div>
				</div>
			)}
		</>
	);
};

export default StatisticalRate;
