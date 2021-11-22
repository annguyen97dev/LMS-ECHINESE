import React, { useState, useEffect } from 'react';
import ChartCard from '~/components/Dashboard/ChartCard';
import { increamentData, lineData, dataPie } from '../../lib/dashboard/data';
import TitlePage from '~/components/TitlePage';
import RevenueChart from '~/components/Dashboard/RevenueChart';
import AcademicChart from '~/components/Dashboard/AcademicChart';
import RateChart from '~/components/Dashboard/RateChart';
import AreaCard from '../../components/Dashboard/ChartCard/AreaCard';
import ModelCard from '../../components/Dashboard/ChartCard/ModelCard';
import RippleCard from '../../components/Dashboard/ChartCard/RippleCard';
import LineCard from 'components/Dashboard/ChartCard/LineCard';

import LayoutBase from '~/components/LayoutBase';
import { statisticalApi } from './../../apiBase/statistical/statistical-total';
import { useWrap } from '~/context/wrap';
import CourseChart from '~/components/Dashboard/CourseChart';
import { Skeleton } from 'antd';

const Dashboard = () => {
	const [statisticalTotal, setStatisticalTotal] = useState<IStatistical[]>([]);
	const [statisticalCourse, setStatisticalCourse] = useState<IStatCourse[]>([]);
	const [statisticalRate, setStatisticalRate] = useState<IStatRate[]>([]);
	const [isLoading, setIsLoading] = useState({
		status: '',
		loading: false
	});
	const { showNoti } = useWrap();
	const [todoApi, setTodoApi] = useState({
		branch: 0,
		StartYear: 2017,
		EndYear: 2022,
		Year: new Date().getFullYear(),
		Month: new Date().getMonth() + 1
	});

	const getStatisticalTotal = async () => {
		setIsLoading({ status: 'STAT_GET_ALL', loading: true });
		try {
			let res = await statisticalApi.getStatisticalTotal(todoApi);
			if (res.status == 200) {
				setStatisticalTotal(res.data.data);
			}
			if (res.status == 204) {
				setStatisticalTotal([]);
			}
		} catch (error) {
			// showNoti("danger", "lỗi tải dữ liệu statistical total");
		} finally {
			setIsLoading({ status: 'STAT_GET_ALL', loading: false });
		}
	};

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
			// showNoti("danger", "lỗi tải dữ liệu thống kê khóa học");
		} finally {
			setIsLoading({ status: 'STAT_GET_COURSE', loading: false });
		}
	};

	const getStatisticalRate = async () => {
		setIsLoading({ status: 'STAT_GET_RATE', loading: true });
		try {
			let res = await statisticalApi.getStatisticalRate(todoApi);
			console.log(res.data);
			if (res.status == 200) {
				setStatisticalRate(res.data.data);
			}
			if (res.status == 204) {
				setStatisticalRate([]);
			}
		} catch (error) {
			// showNoti("danger", "get data student Day faile");
		} finally {
			setIsLoading({ status: 'STAT_GET_RATE', loading: false });
		}
	};

	useEffect(() => {
		getStatisticalTotal();
		getStatisticalRate();
		getStatisticalCourse();
	}, []);

	const renderStatisticalTotal = () => {
		if (isLoading.status === 'STAT_GET_ALL' && isLoading.loading == true) {
			return <Skeleton active />;
		} else {
			return (
				<>
					<div className="row">
						<div className="col-md-2 col-sm-4 col-6">
							<ChartCard
								typeChart={1}
								prize="0"
								percent="100"
								styleName="down"
								title="Khóa học đang mở"
								children={<LineCard dataCard={increamentData} />}
								statisticalTotal={statisticalTotal}
							/>
						</div>
						<div className="col-md-2 col-sm-4 col-6">
							<ChartCard
								typeChart={2}
								title="Học viên đang học"
								prize="20"
								percent="88"
								children={<ModelCard dataCard={increamentData} />}
								styleName="up"
								statisticalTotal={statisticalTotal}
							/>
						</div>
						<div className="col-md-2 col-sm-4 col-6">
							<ChartCard
								typeChart={3}
								prize="3"
								percent="8"
								children={<RippleCard dataCard={increamentData} />}
								styleName="down"
								title="Học viên mới đăng kí"
								statisticalTotal={statisticalTotal}
							/>
						</div>
						<div className="col-md-2 col-sm-4 col-6">
							<ChartCard
								typeChart={2}
								prize="3"
								percent="10"
								children={<AreaCard dataCard={increamentData} />}
								styleName="down"
								title="Học viên hẹn đăng kí"
								statisticalTotal={statisticalTotal}
							/>
						</div>
						<div className="col-md-2 col-sm-4 col-6">
							{' '}
							<ChartCard
								typeChart={3}
								prize="12"
								percent="23"
								styleName="up"
								title="Học viên hẹn test"
								children={<ModelCard dataCard={increamentData} />}
								statisticalTotal={statisticalTotal}
							/>
						</div>
						<div className="col-md-2 col-sm-4 col-6">
							<ChartCard
								typeChart={1}
								title="Học viên đến test"
								prize="19"
								percent="45"
								children={<RippleCard dataCard={increamentData} />}
								styleName="up"
								statisticalTotal={statisticalTotal}
							/>
						</div>
					</div>
					<div className="row pt-5">
						<div className="col-md-2 col-sm-4 col-6">
							<ChartCard
								typeChart={2}
								prize="3"
								percent="8"
								children={<AreaCard dataCard={increamentData} />}
								styleName="up"
								title="Học viên đăng kí"
								statisticalTotal={statisticalTotal}
							/>
						</div>
						<div className="col-md-2 col-sm-4 col-6">
							<ChartCard
								typeChart={1}
								prize="40"
								percent="85"
								children={<LineCard dataCard={lineData} />}
								styleName="up"
								title="Học viên bảo lưu"
								statisticalTotal={statisticalTotal}
							/>
						</div>
						<div className="col-md-2 col-sm-4 col-6">
							<ChartCard
								typeChart={3}
								prize="12"
								percent="23"
								styleName="up"
								title="Bài tập đã nộp"
								children={<ModelCard dataCard={increamentData} />}
								statisticalTotal={statisticalTotal}
							/>
						</div>
						<div className="col-md-2 col-sm-4 col-6">
							<ChartCard
								typeChart={1}
								title="Bài đã chấm"
								prize="4"
								percent="90"
								children={<RippleCard dataCard={increamentData} />}
								styleName="down"
								statisticalTotal={statisticalTotal}
							/>
						</div>
						<div className="col-md-2 col-sm-4 col-6">
							<ChartCard
								typeChart={2}
								prize="100"
								percent="100"
								children={<AreaCard dataCard={increamentData} />}
								styleName="up"
								title="Bài không đạt"
								statisticalTotal={statisticalTotal}
							/>
						</div>
						<div className="col-md-2 col-sm-4 col-6">
							<ChartCard
								typeChart={3}
								prize="12"
								percent="47"
								children={<LineCard dataCard={lineData} />}
								styleName="up"
								title="Tỷ lệ lấp đầy phòng trống"
								statisticalTotal={statisticalTotal}
							/>
						</div>
					</div>
					<div className="row pt-5">
						<div className="col-md-2 col-sm-4 col-6">
							<ChartCard
								typeChart={1}
								prize="12"
								percent="47"
								children={<LineCard dataCard={lineData} />}
								styleName="up"
								title="Học viên chuyển khóa"
								statisticalTotal={statisticalTotal}
							/>
						</div>
						<div className="col-md-2 col-sm-4 col-6">
							<ChartCard
								typeChart={2}
								prize="12"
								percent="47"
								children={<LineCard dataCard={lineData} />}
								styleName="up"
								title="Giáo viên"
								statisticalTotal={statisticalTotal}
							/>
						</div>
						<div className="col-md-2 col-sm-4 col-6">
							<ChartCard
								typeChart={3}
								prize="12"
								percent="47"
								children={<LineCard dataCard={lineData} />}
								styleName="up"
								title="Nhân viên"
								statisticalTotal={statisticalTotal}
							/>
						</div>
					</div>
				</>
			);
		}
	};

	const renderStatisticalRevenue = () => {
		if (isLoading.status === 'GET_STAT_REVENUE' && isLoading.loading == true) {
			return <Skeleton active />;
		} else {
			return (
				<div className="row pt-5">
					<div className="col-12">
						<RevenueChart />
					</div>
				</div>
			);
		}
	};

	const renderStatisticalAcademic = () => {
		if (isLoading.status === 'GET_STAT_STUDENT' && isLoading.loading == true) {
			return (
				<div className="col-md-8 col-12">
					<Skeleton active />
				</div>
			);
		} else {
			return (
				<div className="col-md-8 col-12">
					<AcademicChart />
				</div>
			);
		}
	};

	const renderStatisticalRate = () => {
		if (isLoading.status === 'GET_STAT_RATE' && isLoading.loading == true) {
			return (
				<div className="col-md-4 col-12">
					<Skeleton active />;
				</div>
			);
		} else {
			return (
				<div className="col-md-4 col-12">
					<div className="chart-comment">
						<RateChart statisticalRate={statisticalRate} dataPie={dataPie} isLoading={isLoading} />
					</div>
				</div>
			);
		}
	};

	const renderStatisticalCourse = () => {
		if (isLoading.status === 'GET_STAT_COURSE' && isLoading.loading == true) {
			return (
				<div className="row pt-5 pb-5">
					<Skeleton active />
				</div>
			);
		} else {
			return (
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
			);
		}
	};

	return (
		<div>
			<TitlePage title="Dashboard" />
			{renderStatisticalTotal()}

			{renderStatisticalRevenue()}

			<div className="row pt-5 pb-5">
				{renderStatisticalAcademic()}
				{renderStatisticalRate()}
			</div>

			{renderStatisticalCourse()}
		</div>
	);
};

Dashboard.layout = LayoutBase;

export default Dashboard;
