import React, { useState, useEffect } from 'react';
import { courseExamApi } from '~/apiBase/package/course-exam';
import { useWrap } from '~/context/wrap';
import Link from 'next/link';
import { Tooltip, Select } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import CourseExamPoint from '~/components/Global/CourseExam/CourseExamPoint';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';

const CouseExamStudent = (props) => {
	const { Option } = Select;
	const { studentID } = props;
	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<ICourseExam[]>([]);
	const { showNoti, pageSize, userInformation } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [loadFirst, setLoadFirst] = useState(true);

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
		UserInformationID: null
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

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
		if (!loadFirst) {
			getDataSource();
		}
	}, [todoApi]);

	// ---------------- COLUMN --------------------
	const columns = [
		{
			title: 'Đề thi',
			dataIndex: 'ExamTopicName',
			render: (text, data) => (
				<Link
					href={{
						pathname: '/customer/student/course-exam-student/detail/[slug]',
						query: { slug: `${data.ID}` }
					}}
				>
					<a href="#" className="font-weight-black">
						{text}
					</a>
				</Link>
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
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Trạng thái chấm bài',
			dataIndex: 'isDone',
			filters: [
				{
					text: 'Chưa chấm xong',
					value: 0
				},
				{
					text: 'Đã chấm xong',
					value: 1
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
					<Link
						href={{
							pathname: '/customer/student/course-exam-student/detail/[slug]',
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
			)
		}
	];

	useEffect(() => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		if (userInformation) {
			if (loadFirst) {
				setTodoApi({
					...todoApi,
					UserInformationID: userInformation.UserInformationID
				});
				setLoadFirst(false);
			}
		}
	}, [userInformation]);

	function handleChange(value) {
		if (value === 0) {
			setTodoApi({
				...todoApi,
				Type: null
			});
		} else {
			setTodoApi({
				...todoApi,
				Type: value
			});
		}
	}

	return (
		<>
			<PowerTable
				Extra={
					<Select className="style-input" defaultValue={0} style={{ width: 150 }} onChange={handleChange}>
						<Option value={0}>Tất cả</Option>
						<Option value={1}>Bài tập</Option>
						<Option value={2}>Bài kiểm tra</Option>
					</Select>
				}
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				addClass="basic-header"
				TitlePage="Bài kiểm tra"
				dataSource={dataSource}
				columns={columns}
			/>
		</>
	);
};

CouseExamStudent.layout = LayoutBase;
export default CouseExamStudent;
