import { Input, Popconfirm, Select, Tooltip } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { homeworkApi } from '~/apiBase/course-detail/home-work';
import { rollUpApi } from '~/apiBase/course-detail/roll-up';
import { examTopicApi } from '~/apiBase/options/exam-topic';
import { useWrap } from '~/context/wrap';
import ModalCreateExercise from './ModalCreateExercise';
import Link from 'next/link';
import ExpandTable from '~/components/ExpandTable';
import TableDetail from './TableDetail';
import ExamAppointmentPoint from '~/components/Global/ExamAppointment/ExamAppointmentPoint';
import { DeleteOutlined, ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons';

Homework.propTypes = {
	courseID: PropTypes.number,
	CurriculumID: PropTypes.any
};

interface IStudentRollUp {
	ID: number;
	CourseID: number;
	StudentID: number;
	StudentName: string;
	Mobile: string;
	Email: string;
	AcademicName: string;
	DayOff: number;
	Warning: boolean;
	RollUpID: number;
	BranchID: number;
	CourseScheduleID: number;
	Note: string;
	StatusID: number;
	StatusName: string;
	LearningStatusID: number;
	LearningStatusName: string;
}

type TypeDataRollUp = {
	RollUp: IRollUp[];
	ScheduleList: IOptionCommon[];
	StudentList: IStudentRollUp[];
};

function Homework(props) {
	const { courseID, CurriculumID } = props;
	const { showNoti, isAdmin, userInformation } = useWrap();
	const [dataRollUp, setDataRollUp] = useState<TypeDataRollUp>({
		RollUp: [],
		ScheduleList: [],
		StudentList: []
	});
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const { Option } = Select;

	// FILTER
	const [filters, setFilters] = useState({
		pageSize: 10,
		pageIndex: 1
	});

	// PAGE NUMBER
	const getPagination = (pageNumber: number) => {
		setFilters({
			...filters,
			pageIndex: pageNumber
		});
	};

	const [scheduleSelected, setScheduleSelected] = useState(0);

	const onSelectCourseSchedule = (CourseScheduleID: number) => {
		setScheduleSelected(CourseScheduleID);
	};

	// GET ROLL UP
	const getRollUpList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			const res = await rollUpApi.getAll(filters);
			if (res.status === 200) {
				const { RollUp, ScheduleList, StudentList, TotalRow } = res.data;
				const fmScheduleList = ScheduleList.map((item, index) => {
					const date = moment(item.StartTime).format('DD/MM/YYYY');
					const startTime = moment(item.StartTime).format('HH:mm');
					const endTime = moment(item.EndTime).format('HH:mm');
					return {
						value: item.ID,
						title: `${item.RoomName ? `[${item.RoomName}]` : ''}[${date}] ${startTime} - ${endTime}`,
						options: {
							BranchID: item.BranchID
						}
					};
				});
				const fmStudentList = StudentList.map((s) => {
					const studentRollUp = RollUp.find((r) => r.StudentID === s.StudentID);
					const moreInfo = {
						RollUpID: studentRollUp?.ID || 0,
						BranchID: studentRollUp?.BranchID || 0,
						CourseScheduleID: studentRollUp?.CourseScheduleID || 0,
						Note: studentRollUp?.Note || '',
						StatusID: studentRollUp?.StatusID || 0,
						StatusName: studentRollUp?.StatusName || '',
						LearningStatusID: studentRollUp?.LearningStatusID || 0,
						LearningStatusName: studentRollUp?.LearningStatusName || ''
					};
					return {
						...s,
						...moreInfo
					};
				});
				setDataRollUp({
					RollUp,
					ScheduleList: [{ value: 0, title: '---Chọn ca học---' }, ...fmScheduleList],
					StudentList: fmStudentList
				});
				setTotalPage(TotalRow);
			}
			if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	useEffect(() => {
		getRollUpList();
		getHomeWorkList({
			CourseID: props.courseID,
			...filters
		});
	}, [filters]);

	const deleteHomework = async (params) => {
		try {
			const res = await homeworkApi.update(params);
			res.status == 200 &&
				getHomeWorkList({
					CourseID: props.courseID,
					...filters
				});
		} catch (error) {
			showNoti('danger', error.message);
		}
	};

	const columns = [
		{
			title: 'Đề thi',
			dataIndex: 'ExamTopicName',
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Ngày bắt đầu',
			dataIndex: 'DateStart',
			render: (text) => <p className="font-weight-primary">{moment(text).format('DD/MM/yyy')}</p>
		},
		{
			title: 'Ngày kết thúc',
			dataIndex: 'DateEnd',
			render: (text) => <p className="font-weight-primary">{moment(text).format('DD/MM/yyy')}</p>
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusName',
			align: 'center',
			render: (value) => (
				<>{value == 'Chưa bắt đầu' ? <span className="tag gray">{value}</span> : <span className="tag green">{value}</span>}</>
			)
		},
		{
			width: 120,
			title: 'Hành động',
			dataIndex: 'Warning',
			align: 'center',
			render: (warning, item: any, idx) => {
				return (
					<>
						{userInformation?.RoleID == 1 || userInformation?.RoleID == 2 ? (
							<Popconfirm
								title="Bạn muốn xóa bài tập này?"
								onConfirm={() => deleteHomework({ ID: item.ID, Enable: false })}
								// onCancel={cancel}
								okText="Yes"
								cancelText="No"
							>
								<Tooltip title="Xoá bài tập">
									<button className="btn btn-icon">
										<DeleteOutlined />
									</button>
								</Tooltip>
							</Popconfirm>
						) : (
							<>
								{item.isSubmitted ? (
									<Link
										href={{
											pathname: '/course/exercise/result/[slug]',
											query: {
												slug: item.ID,
												examID: item.ExamTopicID,
												ExamAppointmentResultID: item.ExamAppointmentResultID
											}
										}}
									>
										<Tooltip title="Chi tiết kết quả">
											<button className="btn btn-icon">
												<ExclamationCircleOutlined />
											</button>
										</Tooltip>
									</Link>
								) : (
									<Link
										href={{
											pathname: '/exam/exam-review',
											query: {
												examID: item.ExamTopicID,
												isExercise: true,
												packageDetailID: item.ID,
												type: 'examination' // Thi cử
											}
										}}
									>
										<Tooltip title="Làm bài tập">
											<button className="btn btn-icon exchange">
												<i
													className="fas fa-edit"
													style={{ color: item.isSubmitted ? '#CFD8DC' : '#34c4a4', fontSize: 16 }}
												/>
											</button>
										</Tooltip>
									</Link>
								)}
							</>
						)}
					</>
				);
			}
		}
	];

	const [examTopics, setExamTopics] = useState([]);
	const [homeWorks, setHomeWorks] = useState([]);

	useEffect(() => {
		console.log('props: ', props);
		getDataExam();
	}, []);

	// GET EXAM TOPIC
	const getDataExam = async () => {
		try {
			let res = await examTopicApi.getAll({
				selectAll: true,
				type: 4,
				CurriculumID: CurriculumID
			});
			if (res.status === 200) {
				setTotalPage(res.data.totalRow);
				setExamTopics(res.data.data);
			}
		} catch (error) {
			console.log('Error Exam: ', error.message);
			showNoti('danger', error.message);
		}
	};

	// GET HOMEWORK LIST
	const getHomeWorkList = async (params) => {
		try {
			const res = await homeworkApi.getAll(params);
			if (res.status === 200) {
				setHomeWorks(res.data.data);
			}
		} catch (error) {
			showNoti('danger', error.message);
		}
	};

	const expandedRowRender = (record, x, y, visible: boolean) => {
		return (
			<>
				<p style={{ fontWeight: 500 }} className="mt-3 mb-2">
					Chi tiết
				</p>
				<p>{record.Note}</p>
				{userInformation?.RoleID == 1 || userInformation?.RoleID == 2 ? (
					<TableDetail dataRow={record} visible={visible} courseID={props.courseID} CurriculumID={props.CurriculumID} />
				) : (
					<ExamAppointmentPoint
						isExercise={true}
						visible={visible}
						infoID={record.ID}
						userID={userInformation?.UserInformationID}
					/>
				)}
			</>
		);
	};

	return (
		<>
			<ExpandTable
				loading={isLoading}
				currentPage={filters.pageIndex}
				totalPage={totalPage}
				getPagination={getPagination}
				dataSource={homeWorks}
				columns={columns}
				Extra={
					scheduleSelected !== 0 ? (
						<ModalCreateExercise
							dataExam={examTopics}
							courseID={props.courseID}
							onFetchData={() =>
								getHomeWorkList({
									CourseID: props.courseID,
									...filters
								})
							}
							CurriculumID={props.CurriculumID}
						/>
					) : null
				}
				TitleCard={
					(userInformation?.RoleID == 1 || userInformation?.RoleID == 2) && (
						<div className="d-flex align-items-center">
							<div className="">
								<b>Ca học:</b>
							</div>
							<div>
								<Select
									defaultValue={0}
									style={{ width: 280, paddingLeft: 20, marginBottom: 0 }}
									className="style-input"
									onChange={onSelectCourseSchedule}
								>
									{dataRollUp.ScheduleList.map((o, idx) => (
										<Option key={idx} value={o.value}>
											{o.title}
										</Option>
									))}
								</Select>
							</div>
						</div>
					)
				}
				expandable={{ expandedRowRender }}
			/>
		</>
	);
}
export default Homework;
