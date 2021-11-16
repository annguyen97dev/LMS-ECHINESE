import React, { useState, useEffect } from 'react';
import LayoutBase from '~/components/LayoutBase';
import { useWrap } from '~/context/wrap';
import { Select } from 'antd';
import { studentApi } from '~/apiBase';
import ExpandTable from '~/components/ExpandTable';
import { courseOfStudentApi } from '~/apiBase/customer/parents/courses-of-student';
import { numberWithCommas } from '~/utils/functions';
import RollUpExpantable from '~/components/Global/Parents/RollUpExpantable';

const RollUpStudent = () => {
	const [courseOfStudent, setCourseOfStudent] = useState<ICourseOfStudent[]>();
	const [students, setStudents] = useState<IStudent[]>();
	const { showNoti, pageSize, userInformation } = useWrap();
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [studentID, setStudentID] = useState(null);
	const { Option } = Select;
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

	const coursesParamsDefault = {
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

	const [coursesParams, setCourseParams] = useState(coursesParamsDefault);

	const columns = [
		{
			title: 'Học viên',
			// width: 200,
			width: '15%',
			dataIndex: 'FullNameUnicode',
			render: (price, record) => <p className="font-weight-primary">{price}</p>
		},
		{
			title: 'Trung tâm',
			// width: 150,
			width: '15%',
			dataIndex: 'BranchName',
			render: (price, record) => <p className="font-weight-primary">{price}</p>
		},
		{
			title: 'Môn học',
			// width: 550,
			width: '35%',
			dataIndex: 'CourseName',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Ghi chú',
			// width: 300,
			width: '20%',
			dataIndex: 'Note',
			render: (price, record) => <p>{price}</p>
		},
		{
			title: 'Cam kết',
			width: '15%',
			// width: 200,
			dataIndex: 'Commitment',
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
				// setTodoApi({ ...todoApi });
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
			let res = await courseOfStudentApi.getAll(coursesParams);
			if (res.status == 200) {
				setCourseOfStudent(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status == 204) {
				setCourseOfStudent([]);
			}
		} catch (error) {
		} finally {
			setLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const expandedRowRender = (record) => {
		return <RollUpExpantable studentID={studentID} courseID={record.CourseID} />;
	};

	const onChangeStudentID = (value) => {
		console.log(value);
		setCourseParams({ ...coursesParams, UserInformationID: value });
		setStudentID(value);
	};

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setCourseParams({
			...coursesParams,
			pageIndex: currentPage
		});
	};

	useEffect(() => {
		getCoursesOfStudent();
	}, [studentID]);

	useEffect(() => {
		getStudents();
		// getCoursesOfStudent();
	}, [userInformation]);

	return (
		<>
			<ExpandTable
				currentPage={currentPage}
				totalPage={totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={loading}
				addClass="basic-header"
				columns={columns}
				dataSource={courseOfStudent}
				TitlePage="Thông tin điểm danh học viên"
				// TitleCard={}
				Extra={
					<Select
						disabled={false}
						style={{ width: 200 }}
						className="style-input"
						placeholder="Chọn học viên"
						onChange={onChangeStudentID}
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

RollUpStudent.layout = LayoutBase;
export default RollUpStudent;
