import { Skeleton } from 'antd';
import React, { useState, useEffect } from 'react';
import { statisticalApi } from '~/apiBase/statistical/statistical-total';
import ChartCard from './ChartCard';

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

export default function StatisticalTotal() {
	const [statisticalTotal, setStatisticalTotal] = useState<IStatistical>(StatisticalTotalDefault);
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
		} finally {
			setIsLoading({ status: 'STAT_GET_ALL', loading: false });
		}
	};

	useEffect(() => {
		getStatisticalTotal();
	}, []);

	return (
		<>
			{isLoading.status === 'STAT_GET_ALL' && isLoading.loading == true ? (
				<Skeleton active />
			) : (
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
			)}
		</>
	);
}
