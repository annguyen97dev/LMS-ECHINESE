import React, { useState, useEffect } from 'react';
import { studentApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import { Button, Select } from 'antd';
import PowerTable from '~/components/PowerTable';
import LayoutBase from '~/components/LayoutBase';
import { scheduleOfStudentApi } from './../../../apiBase/customer/parents/schedule-of-student';
import moment from 'moment';
import { scoreOfStudentApi } from '~/apiBase/customer/parents/score-of-student';
import ExpandTable from '~/components/ExpandTable';
import NestedTable from '~/components/Elements/NestedTable';

const ScoreOfStudent = () => {
	const [dataSource, setDataSource] = useState<IScheduleOfStudent[]>();
	const [dataAppointment, setDataAppointment] = useState<IScoreAppointment[]>();
	const [dataExam, setDataExam] = useState<IScoreCourseExam[]>();
	const [dataSetPakage, setDataSetPakage] = useState<IScoreSetPakage[]>();
	const [students, setStudents] = useState<IStudent[]>();
	const { showNoti, pageSize, userInformation } = useWrap();
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [studentID, setStudentID] = useState(null);
	const [typeBtn, setTypeBtn] = useState(1);
	const [isLoading, setLoading] = useState({
		type: '',
		status: false
	});

	const studentParams = {
		pageSize: pageSize,
		pageIndex: 1,
		sort: null,
		sortType: null,
		FullNameUnicode: null,
		SourceInformationID: null,
		BranchID: null,
		fromDate: null,
		toDate: null,
		ParentsOf: userInformation?.UserInformationID
	};

	const params = {
		pageIndex: 1,
		pageSize: pageSize,
		UserInformationID: studentID
	};

	const paramsSetPakage = {
		pageIndex: 1,
		pageSize: pageSize,
		StudentID: studentID
	};

	const dataTest = [
		{
			ID: 41,
			StudentID: 1344,
			StudentName: 'Rose xinh đẹp',
			SetPackageDetailID: 38,
			SetPackageLevel: 2,
			ExamTopicID: 25,
			ExamTopicName: 'Đề test chuẩn',
			TeacherID: 1389,
			TeacherName: 'Kim Bảo',
			NumberExercise: 24,
			ListeningNumber: 2,
			SpeakingNumber: 1,
			ReadingNumber: 20,
			WritingNumber: 1,
			ListeningCorrect: 1,
			ReadingCorrect: 9,
			Note: '',
			isDone: false,
			isFixPaid: true,
			isReevaluate: false,
			StatusID: 2,
			StatusName: 'Đang chấm bài',
			ListeningPoint: 1,
			SpeakingPoint: 0,
			ReadingPoint: 9,
			WritingPoint: 0,
			PointTotal: 10,
			AmountFixOfStudent: 6,
			Enable: true,
			CreatedOn: '2021-10-25T09:19:04.583',
			CreatedBy: 'Rose xinh đẹp',
			ModifiedOn: '2021-10-26T11:53:13.697',
			ModifiedBy: 'Mona Media '
		},
		{
			ID: 41,
			StudentID: 1344,
			StudentName: 'Rose xinh đẹp',
			SetPackageDetailID: 38,
			SetPackageLevel: 2,
			ExamTopicID: 25,
			ExamTopicName: 'Đề test chuẩn',
			TeacherID: 1389,
			TeacherName: 'Kim Bảo',
			NumberExercise: 24,
			ListeningNumber: 2,
			SpeakingNumber: 1,
			ReadingNumber: 20,
			WritingNumber: 1,
			ListeningCorrect: 1,
			ReadingCorrect: 9,
			Note: '',
			isDone: false,
			isFixPaid: true,
			isReevaluate: false,
			StatusID: 2,
			StatusName: 'Đang chấm bài',
			ListeningPoint: 1,
			SpeakingPoint: 0,
			ReadingPoint: 9,
			WritingPoint: 0,
			PointTotal: 10,
			AmountFixOfStudent: 6,
			Enable: true,
			CreatedOn: '2021-10-25T09:19:04.583',
			CreatedBy: 'Rose xinh đẹp',
			ModifiedOn: '2021-10-26T11:53:13.697',
			ModifiedBy: 'Mona Media '
		},
		{
			ID: 41,
			StudentID: 1344,
			StudentName: 'Rose xinh đẹp',
			SetPackageDetailID: 38,
			SetPackageLevel: 2,
			ExamTopicID: 25,
			ExamTopicName: 'Đề test chuẩn',
			TeacherID: 1389,
			TeacherName: 'Kim Bảo',
			NumberExercise: 24,
			ListeningNumber: 2,
			SpeakingNumber: 1,
			ReadingNumber: 20,
			WritingNumber: 1,
			ListeningCorrect: 1,
			ReadingCorrect: 9,
			Note: '',
			isDone: false,
			isFixPaid: true,
			isReevaluate: false,
			StatusID: 2,
			StatusName: 'Đang chấm bài',
			ListeningPoint: 1,
			SpeakingPoint: 0,
			ReadingPoint: 9,
			WritingPoint: 0,
			PointTotal: 10,
			AmountFixOfStudent: 6,
			Enable: true,
			CreatedOn: '2021-10-25T09:19:04.583',
			CreatedBy: 'Rose xinh đẹp',
			ModifiedOn: '2021-10-26T11:53:13.697',
			ModifiedBy: 'Mona Media '
		},
		{
			ID: 41,
			StudentID: 1344,
			StudentName: 'Rose xinh đẹp',
			SetPackageDetailID: 38,
			SetPackageLevel: 2,
			ExamTopicID: 25,
			ExamTopicName: 'Đề test chuẩn',
			TeacherID: 1389,
			TeacherName: 'Kim Bảo',
			NumberExercise: 24,
			ListeningNumber: 2,
			SpeakingNumber: 1,
			ReadingNumber: 20,
			WritingNumber: 1,
			ListeningCorrect: 1,
			ReadingCorrect: 9,
			Note: '',
			isDone: false,
			isFixPaid: true,
			isReevaluate: false,
			StatusID: 2,
			StatusName: 'Đang chấm bài',
			ListeningPoint: 1,
			SpeakingPoint: 0,
			ReadingPoint: 9,
			WritingPoint: 0,
			PointTotal: 10,
			AmountFixOfStudent: 6,
			Enable: true,
			CreatedOn: '2021-10-25T09:19:04.583',
			CreatedBy: 'Rose xinh đẹp',
			ModifiedOn: '2021-10-26T11:53:13.697',
			ModifiedBy: 'Mona Media '
		}
	];

	const columns = [
		{
			title: 'Đề thi',
			dataIndex: 'ExamTopicName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Số bài tập',
			dataIndex: 'NumberExercise',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Số câu nghe',
			dataIndex: 'ListeningNumber',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Số câu nói',
			dataIndex: 'SpeakingNumber',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Số câu đọc',
			dataIndex: 'ReadingNumber',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Số câu viết',
			dataIndex: 'WritingNumber',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Câu nghe đúng',
			dataIndex: 'ListeningCorrect',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Câu đọc đúng',
			dataIndex: 'ReadingCorrect',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Ghi chú',
			dataIndex: 'Note',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Điểm nghe',
			dataIndex: 'ListeningPoint',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Điểm nói',
			dataIndex: 'SpeakingPoint',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Điểm đọc',
			dataIndex: 'ReadingPoint',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Điểm viết',
			dataIndex: 'WritingPoint',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Tổng điểm',
			dataIndex: 'PointTotal',
			render: (price, record) => <p>{price}</p>
		}
	];

	const columnsAppointment = [
		{
			title: 'Học viên',
			width: 150,
			dataIndex: 'FullNameUnicode',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Trung tâm',
			width: 150,
			dataIndex: 'TeacherName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Cố vấn',
			width: 150,
			dataIndex: 'CounselorsName',
			render: (price, record) => <p>{moment(price).format('DD-MM-YYYY, h:mm:ss a')}</p>
		},
		{
			title: 'Học phí tối đa',
			width: 200,
			dataIndex: 'MaxTuitionOfStudent',
			render: (price, record) => <p>{moment(price).format('DD-MM-YYYY, h:mm:ss a')}</p>
		},
		{
			title: 'Trạng thái',
			width: 150,
			dataIndex: 'StatusName',
			render: (price, record) => <p>{price}</p>
		}
	];

	const columnsCourseExam = [
		{
			title: 'Học viên',
			width: 150,
			dataIndex: 'FullNameUnicode',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Tên môn học',
			width: 650,
			dataIndex: 'CourseName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Bài học',
			width: 100,
			dataIndex: 'Lesson',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Nội dung bài học',
			width: 200,
			dataIndex: 'LessonDetailContent',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Giáo viên',
			width: 200,
			dataIndex: 'TeacherName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Loại',
			width: 150,
			dataIndex: 'TypeName',
			render: (price, record) => <p>{price}</p>
		}
	];

	const columnsSetPakege = [
		{
			title: 'Học viên',
			width: 760,
			dataIndex: 'StudentName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Cấp độ gói bài',
			width: 340,
			dataIndex: 'SetPackageLevel',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Số học sinh đã chấm',
			width: 340,
			dataIndex: 'AmountFixOfStudent',
			render: (price, record) => <p>{price}</p>
		}
	];

	const [todoApi, setTodoApi] = useState(params);
	const [todoPakageApi, setTodoPakageApi] = useState(paramsSetPakage);

	const { Option } = Select;

	const getStudents = async () => {
		setLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await studentApi.getAll(studentParams);
			console.log(res.data.data[0]);
			if (res.status === 200) {
				setStudents(res.data.data);
				setTodoApi({ ...todoApi });
			}
			if (res.status == 204) {
				showNoti('danger', 'Không có dữ liệu');
			}
		} catch (error) {
		} finally {
			setLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const getScoreAppointment = async () => {
		setLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await scoreOfStudentApi.getAppointment(todoApi);
			if (res.status == 200) {
				setDataAppointment(res.data.data);
				console.log('appointment', res.data.data);
			}
			if (res.status == 204) {
				setDataAppointment([]);
			}
		} catch (err) {
		} finally {
			setLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const getScoreExamResult = async () => {
		setLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await scoreOfStudentApi.getCourseExam(todoApi);
			if (res.status == 200) {
				setDataExam(res.data.data);
				console.log('course exam', res.data.data);
			}
			if (res.status == 204) {
				setDataExam([]);
			}
		} catch (err) {
		} finally {
			setLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const getScoreSetPakage = async () => {
		setLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await scoreOfStudentApi.getSetPakage(todoPakageApi);
			if (res.status == 200) {
				setDataSetPakage(res.data.data);
				console.log('pakage', res.data.data);
			}
			if (res.status == 204) {
				setDataSetPakage([]);
			}
		} catch (err) {
		} finally {
			setLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	useEffect(() => {
		getStudents();
	}, [userInformation]);

	useEffect(() => {
		getScoreAppointment();
		getScoreExamResult();
		getScoreSetPakage();
	}, [studentID]);

	const onChangeStudentID = (value) => {
		console.log(todoApi);
		setStudentID(value);
		setTodoApi({ ...todoApi, UserInformationID: value });
		setTodoPakageApi({ ...todoPakageApi, StudentID: value });
	};

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi
		});
	};

	const onChangeType = (index) => {
		setTypeBtn(index);
	};

	const expandedRowRender = (record) => {
		return <NestedTable columns={columns} dataSource={dataTest} />;
	};

	return (
		<>
			<ExpandTable
				currentPage={currentPage}
				totalPage={totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				// loading={loading}
				loading={isLoading}
				addClass="basic-header"
				columns={(typeBtn == 1 && columnsAppointment) || (typeBtn == 2 && columnsCourseExam) || (typeBtn == 3 && columnsSetPakege)}
				dataSource={(typeBtn == 1 && dataAppointment) || (typeBtn == 2 && dataExam) || (typeBtn == 3 && dataSetPakage)}
				// dataSource={dataTest}
				TitlePage="Bảng điểm học viên"
				TitleCard={
					<div style={{}}>
						<button
							className={typeBtn == 1 ? 'btn btn-primary ml-2' : 'btn btn-warning ml-2'}
							onClick={() => {
								onChangeType(1);
							}}
						>
							Điểm kiểm tra đầu vào{' '}
						</button>
						<button
							className={typeBtn == 2 ? 'btn btn-primary ml-2' : 'btn btn-warning ml-2'}
							onClick={() => {
								onChangeType(2);
							}}
						>
							Điểm kiểm tra
						</button>
						<button
							className={typeBtn == 3 ? 'btn btn-primary ml-2' : 'btn btn-warning ml-2'}
							onClick={() => {
								onChangeType(3);
							}}
						>
							Điểm làm bộ đề
						</button>
					</div>
				}
				Extra={
					<Select
						disabled={false}
						style={{ width: 200 }}
						className="style-input"
						placeholder="Chọn học viên"
						onChange={onChangeStudentID}
						// defaultValue={studentID ? students[studentID.index].FullNameUnicode : ''}
					>
						{students?.map((item, index) => (
							<Option key={index} value={item.UserInformationID}>
								{item.FullNameUnicode}
							</Option>
						))}
					</Select>
				}
				expandable={{
					expandedRowRender
				}}
			/>
		</>
	);
};

ScoreOfStudent.layout = LayoutBase;
export default ScoreOfStudent;
