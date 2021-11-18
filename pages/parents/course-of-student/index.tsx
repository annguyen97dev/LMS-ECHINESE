import React, { useState, useEffect } from 'react';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';
import { Select, Tooltip } from 'antd';
import { studentApi } from './../../../apiBase/customer/student/student-list';
import { courseOfStudentApi } from '~/apiBase/customer/parents/courses-of-student';
import { numberWithCommas } from '~/utils/functions';

const CourseOfStudent = () => {
	const [dataSource, setDataSource] = useState<ICourseOfStudent[]>();
	const [students, setStudents] = useState<IStudent[]>();
	const { showNoti, pageSize, userInformation } = useWrap();
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [studentID, setStudentID] = useState(null);
	const [loading, setLoading] = useState({
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
		sort: null,
		sortType: null,
		fromDate: null,
		toDate: null,
		CourseID: null,
		BranchID: null,
		CourseOfStudentPriceID: null,
		FullNameUnicode: null,
		UserInformationID: studentID
	};

	const [todoApi, setTodoApi] = useState(params);

	const { Option } = Select;
	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'FullNameUnicode',
			width: '15%',
			render: (price, record) => <p className="font-weight-primary">{price}</p>
		},
		{
			title: 'Trung tâm',
			width: '10%',
			dataIndex: 'BranchName',
			render: (price, record) => <p className="font-weight-primary">{price}</p>
		},
		{
			title: 'Môn học',
			dataIndex: 'CourseName',
			width: '30%',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Giá khóa học',
			dataIndex: 'Price',
			width: '10%',
			render: (price, record) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Kết quả ',
			dataIndex: 'Examresult',
			width: '10%'
		},
		{
			title: 'Ghi chú',
			dataIndex: 'Note',
			width: '15%',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Cam kết',
			dataIndex: 'Commitment',
			width: '10%',
			render: (price, record) => <p>{price}</p>
		}
	];

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
				setStudentID({ ID: res.data.data[0].UserInformationID, index: 0 });
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

	const getCoursesOfStudent = async () => {
		setLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await courseOfStudentApi.getAll(todoApi);
			if (res.status == 200) {
				setDataSource(res.data.data);
				console.log(res.data.data);
			}
			if (res.status == 204) {
				setDataSource([]);
			}
		} catch (error) {
		} finally {
			setLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const onChangeStudentID = (value) => {
		console.log(value);
		setTodoApi({ ...todoApi, UserInformationID: value });
		setStudentID(value);
	};

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			pageIndex: currentPage
		});
	};

	useEffect(() => {
		getStudents();
		// getCoursesOfStudent();
	}, [userInformation]);

	useEffect(() => {
		getCoursesOfStudent();
	}, [studentID]);

	return (
		<>
			<PowerTable
				currentPage={currentPage}
				// totalPage={totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={loading}
				addClass="basic-header"
				columns={columns}
				dataSource={dataSource}
				TitlePage="Danh sách khóa học của học viên"
				// TitleCard={}
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
			/>
		</>
	);
};

CourseOfStudent.layout = LayoutBase;
export default CourseOfStudent;
