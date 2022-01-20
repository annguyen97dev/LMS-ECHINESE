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
import { DatePicker, Skeleton } from 'antd';
import BarChartStatistical from '~/components/Dashboard/BarChart';
import moment from 'moment';
import StatisticalTotalLessonOfTeacher from '~/components/Dashboard/StatisticalTable';
import StatisticalRankTeacher from '~/components/Dashboard/StatisticalRankTeacher';

const StatisticalTotalDefault = {
	Warning: 0,
	Prewarning: 0,
	AverageView: 0,
	CompleteHomework: 0,
	PrecompleteHomework: 0,
	NotDonePaidCoursePrice: 0,
	PrenotDonePaidCoursePrice: 0,
	TotalVideoViews: 0,
	PretotalVideoViews: 0,
	VideoCourseRevenue: 0,
	PrevideoCourseRevenue: 0,
	ExamAppointmentResultNotDone: 0,
	CourseExamresultNotDone: 0,
	SetPackageResultNotDone: 0,
	DonePaidCoursePrice: 0,
	PredonePaidCoursePrice: 0,
	CourseSecond3Month: 0,
	Customer: 0,
	PreCustomer: 0,
	TestAppointment: 0,
	PreTestAppointment: 0,
	TestDone: 0,
	PreTestDone: 0,
	RegisterAppointment: 0,
	PreRegisterAppointment: 0,
	Studying: 0,
	PreStudying: 0,
	Reserve: 0,
	Prereserve: 0,
	Changecourse: 0,
	PreChangecourse: 0,
	Teacher: 0,
	PreTeacher: 0,
	Employee: 0,
	PreEmployee: 0,
	Submittopic: 0,
	Marktopic: 0,
	Remaketopic: 0,
	Enable: true,
	CreatedOn: '',
	CreatedBy: '',
	ModifiedOn: '',
	ModifiedBy: ''
};

const Dashboard = () => {
	const [statisticalTotal, setStatisticalTotal] = useState<IStatistical>(StatisticalTotalDefault);
	const [statisticalCourse, setStatisticalCourse] = useState<IStatCourse[]>([]);
	const [statisticalRate, setStatisticalRate] = useState<IStatRate[]>([]);
	const [statisticalRateVideoCourse, setStatisticalRateVideoCourse] = useState<IStatRate[]>([]);
	const [statisticalAverageAgeOfStudent, setStatisticalAverageAgeOfStudent] = useState<IStatDataBarChart[]>([]);
	const [statisticalPercentStudentByArea, setStatisticalPercentStudentByArea] = useState<IStatDataBarChart[]>([]);
	const [statisticalPercentStudentBySource, setStatisticalPercentStudentBySource] = useState<IStatDataBarChart[]>([]);
	const [statisticalCoursePurchases, setStatisticalCoursePurchases] = useState<IStatDataBarChart[]>([]);
	const [statisticalJobOfStudent, setStatisticalJobOfStudent] = useState<IStatDataBarChart[]>([]);
	const [statisticalSalaryOfStaff, setStatisticalSalaryOfStaff] = useState<IStatDataBarChart[]>([]);
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
	const [period, setPeriod] = useState({
		fromDate: '',
		toDate: ''
	});

	const getStatisticalTotal = async () => {
		setIsLoading({ status: 'STAT_GET_ALL', loading: true });
		try {
			let res = await statisticalApi.getStatisticalTotal(todoApi);
			if (res.status == 200) {
				setStatisticalTotal(res.data.data);
			}
			if (res.status == 204) {
				setStatisticalTotal(null);
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
		getStatisticalTotal();
		getStatisticalRate();
		getStatisticalRateVideoCourse();
		getStatisticalCourse();
		getAgerageAgeOfStudent();
		getPercentOfStudentByArea();
		getPercentOfStudentBySource();
		getStatisticalCoursePurchases();
		getStatisticalJobOfStudent();
	}, []);

	const renderStatisticalTotal = () => {
		if (isLoading.status === 'STAT_GET_ALL' && isLoading.loading == true) {
			return <Skeleton active />;
		} else {
			return (
				<>
					<div className="row">
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={1} styleName="down" title="Khóa học đang mở" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={2} title="Học viên đang học" styleName="up" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={3} styleName="down" title="Học viên mới đăng kí" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={2} styleName="down" title="Học viên hẹn đăng kí" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							{' '}
							<ChartCard typeChart={3} styleName="up" title="Học viên hẹn test" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={1} title="Học viên đến test" styleName="up" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={2} styleName="up" title="Học viên đăng kí" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={1} styleName="up" title="Học viên bảo lưu" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={3} styleName="up" title="Bài tập đã nộp" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={1} title="Bài đã chấm" styleName="down" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={2} styleName="up" title="Bài không đạt" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={3} styleName="up" title="Tỷ lệ lấp đầy phòng trống" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={1} styleName="up" title="Học viên chuyển khóa" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={2} styleName="up" title="Giáo viên" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={3} styleName="up" title="Nhân viên" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={4} styleName="up" title="Học viên bị cảnh cáo" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={1} styleName="up" title="Doanh thu khóa học video" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={2} styleName="up" title="Lượt xem khóa học video" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={4} styleName="up" title="Lượt xem video trung bình" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={3} styleName="up" title="Tỉ lệ nợ học phí" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={1} styleName="up" title="Tỉ lệ hoàn thành học phí" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={2} styleName="up" title="Tỉ lệ nộp bài đúng hạn" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard
								typeChart={3}
								styleName="up"
								title="Tỉ lệ quay lại sau 3 tháng"
								statisticalTotal={statisticalTotal}
							/>
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={1} styleName="up" title="Bài hẹn test chưa chấm" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={2} styleName="up" title="Bài kiểm tra chưa chấm" statisticalTotal={statisticalTotal} />
						</div>
						<div className="mb-4 col-xl-2 col-md-3 col-sm-4 col-6">
							<ChartCard typeChart={3} styleName="up" title="Bộ đề chưa chấm" statisticalTotal={statisticalTotal} />
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
				<div className="col-12 mb-5">
					<Skeleton active />
				</div>
			);
		} else {
			return (
				<div className="col-12 mb-5">
					<AcademicChart />
				</div>
			);
		}
	};

	const renderStatisticalRate = () => {
		if (isLoading.status === 'GET_STAT_RATE' && isLoading.loading == true) {
			return (
				<div className="col-xl-6 col-12">
					<Skeleton active />;
				</div>
			);
		} else {
			return (
				<div className="col-xl-6 col-12">
					<div className="chart-comment">
						<RateChart statisticalRate={statisticalRate} dataPie={dataPie} isLoading={isLoading} type="SELLER" />
					</div>
				</div>
			);
		}
	};

	const renderStatisticalRateVideoCourse = () => {
		if (isLoading.status === 'GET_STAT_RATE' && isLoading.loading == true) {
			return (
				<div className="col-xl-6 col-12">
					<Skeleton active />;
				</div>
			);
		} else {
			return (
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

	const renderAverageAgeOfStudent = () => {
		if (isLoading.status === 'GET_STAT_AVERAGE_AGE' && isLoading.loading == true) {
			return (
				<div className="row pt-5 pb-5">
					<Skeleton active />
				</div>
			);
		} else {
			return (
				<div className="row pt-5 pb-5">
					<div className="col-12">
						<BarChartStatistical
							title={'Thống kê độ tuổi của học viên'}
							dataStatistical={statisticalAverageAgeOfStudent}
							colorTick="#c0183c"
						/>
					</div>
				</div>
			);
		}
	};

	const renderPercentOfStudentByArea = () => {
		if (isLoading.status === 'GET_STAT_PERCENT_STUDENT_BY_AREA' && isLoading.loading == true) {
			return (
				<div className="row pt-5 pb-5">
					<Skeleton active />
				</div>
			);
		} else {
			return (
				<div className="row pt-5 pb-5">
					<div className="col-12">
						<BarChartStatistical
							title={'Thống kê phần trăm học viên theo tỉnh thành'}
							dataStatistical={statisticalPercentStudentByArea}
							colorTick="#0da779"
						/>
					</div>
				</div>
			);
		}
	};

	const renderPercentOfStudentBySource = () => {
		if (isLoading.status === 'GET_STAT_PERCENT_STUDENT_BY_SOURCE' && isLoading.loading == true) {
			return (
				<div className="row pt-5 pb-5">
					<Skeleton active />
				</div>
			);
		} else {
			return (
				<div className="row pt-5 pb-5">
					<div className="col-12">
						<BarChartStatistical
							title={'Thống kê phần trăm học viên theo nguồn'}
							dataStatistical={statisticalPercentStudentBySource}
							colorTick="#dd4667"
						/>
					</div>
				</div>
			);
		}
	};

	const renderStatisticalCoursePurchases = () => {
		if (isLoading.status === 'GET_STAT_COURSE_PURCHASES' && isLoading.loading == true) {
			return (
				<div className="row pt-5 pb-5">
					<Skeleton active />
				</div>
			);
		} else {
			return (
				<div className="row pt-5 pb-5">
					<div className="col-12">
						<BarChartStatistical
							title={'Thống kê khóa học có lượt mua cao nhất'}
							dataStatistical={statisticalCoursePurchases}
							colorTick="#162b5b"
						/>
					</div>
				</div>
			);
		}
	};

	const renderStatisticalJobOfStudent = () => {
		if (isLoading.status === 'GET_STAT_JOB_OF_STUDENT' && isLoading.loading == true) {
			return (
				<div className="row pt-5 pb-5">
					<Skeleton active />
				</div>
			);
		} else {
			return (
				<div className="row pt-5 pb-5">
					<div className="col-12">
						<BarChartStatistical
							title={'Thống kê nghề nghiệp của học viên'}
							dataStatistical={statisticalJobOfStudent}
							colorTick="#ff7c38"
						/>
					</div>
				</div>
			);
		}
	};

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
	const renderStatisticalSalaryOfStaff = () => {
		if (isLoading.status === 'GET_STAT_SALARY_OF_STAFF' && isLoading.loading == true) {
			return (
				<div className="row pt-5 pb-5">
					<Skeleton active />
				</div>
			);
		} else {
			return (
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
			);
		}
	};

	const renderStatisticalTotalLessonOfTeacher = () => {
		return (
			<div className="row pt-5 pb-5">
				<div className="col-12">
					<StatisticalTotalLessonOfTeacher />
				</div>
			</div>
		);
	};

	const renderStatisticalRankTeacher = () => {
		return (
			<div className="row pt-5 pb-5">
				<div className="col-12">
					<StatisticalRankTeacher />
				</div>
			</div>
		);
	};

	useEffect(() => {
		getStatisticalSalaryOfStaff();
	}, [period]);

	return (
		<div>
			<TitlePage title="Dashboard" />
			{renderStatisticalTotal()}

			{renderStatisticalRevenue()}

			<div className="row mt-5">{renderStatisticalAcademic()}</div>

			<div className="row mt-5">
				{renderStatisticalRate()}
				{renderStatisticalRateVideoCourse()}
			</div>

			{renderStatisticalCourse()}
			{renderAverageAgeOfStudent()}
			{renderPercentOfStudentByArea()}
			{renderPercentOfStudentBySource()}
			{renderStatisticalCoursePurchases()}
			{renderStatisticalJobOfStudent()}
			{renderStatisticalSalaryOfStaff()}
			{renderStatisticalTotalLessonOfTeacher()}
			{renderStatisticalRankTeacher()}
		</div>
	);
};

Dashboard.layout = LayoutBase;

export default Dashboard;
