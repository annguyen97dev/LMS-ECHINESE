import { Skeleton } from 'antd';
import React, { useState, useEffect } from 'react';
import { statisticalApi } from '~/apiBase/statistical/statistical-total';
import CourseChart from './CourseChart';

const StatisticalRate = () => {
	const [statisticalCourse, setStatisticalCourse] = useState<IStatCourse[]>([]);
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

	const getStatisticalCourse = async () => {
		setIsLoading({ status: 'STAT_GET_COURSE', loading: true });
		try {
			let res = await statisticalApi.getStatisticalCourse();
			if (res.status == 200) {
				setStatisticalCourse(res.data.data);
			}
			if (res.status == 204) {
				setStatisticalCourse([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'STAT_GET_COURSE', loading: false });
		}
	};

	useEffect(() => {
		getStatisticalCourse();
	}, [todoApi]);

	return (
		<>
			{isLoading.status === 'STAT_GET_COURSE' && isLoading.loading == true ? (
				<div className="row pt-5 pb-5">
					<Skeleton active />
				</div>
			) : (
				<div className="row pt-5 pb-5">
					<div className="col-12">
						<CourseChart
							statisticalCourse={statisticalCourse}
							setTodoApi={setTodoApi}
							isLoading={isLoading}
							todoApi={todoApi}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default StatisticalRate;
