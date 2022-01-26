import { Skeleton } from 'antd';
import React, { useState, useEffect } from 'react';
import { statisticalApi } from '~/apiBase/statistical/statistical-total';
import BarChartStatistical from './BarChart';

const StatisticalRate = () => {
	const [statisticalPercentStudentByArea, setStatisticalPercentStudentByArea] = useState<IStatDataBarChart[]>([]);
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

	const getPercentOfStudentByArea = async () => {
		setIsLoading({ status: 'GET_STAT_PERCENT_STUDENT_BY_AREA', loading: true });
		try {
			let res = await statisticalApi.getPercentOfStudentByArea();
			if (res.status === 200) {
				let temp = [];
				res.data.data.forEach((item) =>
					temp.push({ ID: item.AreaID, dataKey: item.AreaName, value: item.Amount, title: 'TỈ LỆ HỌC VIÊN THEO TỈNH THÀNH' })
				);
				setStatisticalPercentStudentByArea(temp);
			}
			if (res.status === 204) {
				setStatisticalPercentStudentByArea([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'GET_STAT_PERCENT_STUDENT_BY_AREA', loading: false });
		}
	};

	useEffect(() => {
		getPercentOfStudentByArea();
	}, []);

	return (
		<>
			{isLoading.status === 'GET_STAT_PERCENT_STUDENT_BY_AREA' && isLoading.loading == true ? (
				<div className="row pt-5 pb-5">
					<Skeleton active />
				</div>
			) : (
				<div className="row pt-5 pb-5">
					<div className="col-12">
						<BarChartStatistical
							title={'Thống kê phần trăm học viên theo tỉnh thành'}
							dataStatistical={statisticalPercentStudentByArea}
							colorTick="#0da779"
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default StatisticalRate;
