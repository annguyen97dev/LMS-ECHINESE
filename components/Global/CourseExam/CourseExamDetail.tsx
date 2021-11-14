import React, { useState, useEffect } from 'react';
import { courseExamApi } from '~/apiBase/package/course-exam';
import { useWrap } from '~/context/wrap';
import Link from 'next/link';
import NestedTable from '~/components/Elements/NestedTable';
import { Tooltip } from 'antd';
import { ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons';
import CourseExamPoint from './CourseExamPoint';
import { teacherApi } from '~/apiBase';
import CourseExamUpdate from './CourseExamUpdate';

const CourseExamDetail = (props) => {
	const { studentID } = props;
	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<ICourseExam[]>([]);
	const { showNoti, pageSize, userInformation } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [indexRow, setIndexRow] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: 1,
		sort: null,
		sortType: null,
		ProgramCode: null,
		ProgramName: null,
		Type: null,
		Level: null,
		fromDate: null,
		toDate: null,
		UserInformationID: studentID
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	const [dataTeacher, setDataTeacher] = useState([]);

	// Get list teacher
	const getListTeacher = async () => {
		// setLoadingTeacher(true);
		try {
			let res = await teacherApi.getAll({
				selectAll: true,
				StatusID: 0
			});

			if (res.status === 200) {
				let newData = res.data.data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}));
				setDataTeacher(newData);
			}
		} catch (error) {
			console.log('Error Get List Teacher: ', error.message);
		} finally {
			// setLoadingTeacher(true);
		}
	};

	// GET DATA SOURCE
	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});

		try {
			let res = await courseExamApi.getAll(todoApi);
			res.status == 200 && (setDataSource(res.data.data), setTotalPage(res.data.totalRow));

			res.status == 204 && setDataSource([]);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);

		setTodoApi({
			...todoApi,
			// ...listFieldSearch,
			pageIndex: pageNumber
		});
	};

	// ============== USE EFFECT - FETCH DATA ===================
	useEffect(() => {
		getDataSource();
	}, [todoApi]);

	// ---------------- COLUMN --------------------
	const columns = [
		{
			title: 'Đề thi',
			dataIndex: 'ExamTopicName',
			render: (text, data) => (
				<>
					{userInformation.RoleID !== 2 ? (
						<Link
							href={{
								pathname: '/course-exam/detail/[slug]',
								query: { slug: `${data.ID}` }
							}}
						>
							<a href="#" className="font-weight-black">
								{text}
							</a>
						</Link>
					) : (
						<Link
							href={{
								pathname: '/course-exam/detail/[slug]',
								query: {
									slug: `${data.ID}`,
									teacherMarking: data.TeacherID,
									packageResultID: data.ID,
									type: 'check'
								}
							}}
						>
							<a href="#" className="font-weight-black">
								{text}
							</a>
						</Link>
					)}
				</>
			)
		},
		{
			title: 'Tổng điểm',
			dataIndex: 'PointTotal',
			render: (point, data) => <CourseExamPoint infoID={data.ID} point={point} detailID={data.ID} />
		},
		{
			title: 'Dạng đề',
			dataIndex: 'Type',
			render: (text, data) => {
				return (
					<>
						{data.Type == 1 && <p className="font-weight-black">Bài tập</p>}
						{data.Type == 2 && (
							<p className="font-weight-black" style={{ color: '#174898' }}>
								Bài kiểm tra
							</p>
						)}
					</>
				);
			}
		},

		{
			title: 'Giáo viên chấm bài',
			dataIndex: 'TeacherName',
			render: (text) => <p className="font-weight-blue">{text}</p>
		},
		{
			title: 'Trạng thái chấm bài',
			dataIndex: 'isDone',
			filters: [
				{
					text: 'Đã chấm xong',
					value: true
				},
				{
					text: 'Chưa chấm xong',
					value: false
				}
			],
			onFilter: (value, record) => record.isDone === value,
			render: (type) => (
				<>
					{type == true && <span className="tag green">Đã chấm xong</span>}
					{type == false && <span className="tag gray">Chưa chấm xong</span>}
				</>
			)
		},

		{
			render: (data) => (
				<>
					{userInformation.RoleID !== 2 ? (
						<>
							<CourseExamUpdate dataTeacher={dataTeacher} dataRow={data} onFetchData={() => setTodoApi({ ...todoApi })} />
							<Link
								href={{
									pathname: '/course-exam/detail/[slug]',
									query: { slug: `${data.ID}` }
								}}
							>
								<Tooltip title="Chi tiết bài làm">
									<button className="btn btn-icon">
										<ExclamationCircleOutlined />
									</button>
								</Tooltip>
							</Link>
						</>
					) : (
						<Link
							href={{
								pathname: '/course-exam/detail/[slug]',
								query: {
									slug: `${data.ID}`,
									teacherMarking: data.TeacherID,
									packageResultID: data.ID,
									type: 'check'
								}
							}}
						>
							<Tooltip title="Chấm bài ngay">
								<button className="btn btn-icon edit">
									<FormOutlined />
								</button>
							</Tooltip>
						</Link>
					)}
				</>
			)
		}
	];

	useEffect(() => {
		getListTeacher();
	}, []);

	return (
		<>
			<NestedTable
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				addClass="basic-header"
				TitlePage=""
				dataSource={dataSource}
				columns={columns}
			/>
		</>
	);
};

export default CourseExamDetail;
