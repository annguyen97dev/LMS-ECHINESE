import { Tooltip, Popconfirm } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Eye } from 'react-feather';
import { studentListInCourseApi } from '~/apiBase';
import { courseOfStudentApi } from '~/apiBase/customer/parents/courses-of-student';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';
import AddTrialStudentForm from './AddTrialStudentForm';

StudentsList.propTypes = {
	courseID: PropTypes.number,
	coursePrice: PropTypes.number
};
StudentsList.defaultProps = {
	courseID: 0
};

function StudentsList(props) {
	const { courseID: ID, coursePrice } = props;
	const { showNoti, userInformation, isAdmin } = useWrap();
	const [studentList, setStudentList] = useState<IStudentListInCourse[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [filters, setFilters] = useState({
		pageSize: 10,
		pageIndex: 1,
		CourseID: ID
	});
	// PAGINATION
	const getPagination = (pageIndex: number) => {
		setFilters({
			...filters,
			pageIndex
		});
	};
	const deleteStudent = async (param) => {
		let temp: any = { ID: param, Enable: false };
		try {
			const res = courseOfStudentApi.update(temp);
			fetchTeacherList();
		} catch (error) {}
	};
	const columns = [
		{ title: 'Tên học viên', width: 150, dataIndex: 'StudentName' },
		{ title: 'SĐT', width: 150, dataIndex: 'Mobile' },
		{ title: 'Email', width: 180, dataIndex: 'Email' },
		{ title: 'Người quản lý', width: 150, dataIndex: 'AcademicName' },
		{ title: 'Số ngày nghỉ', width: 150, dataIndex: 'DayOff' },
		{
			title: 'Cảnh báo',
			width: 150,
			dataIndex: 'Warning',
			render: (bool) => bool && <span className="tag yellow">Warning</span>
		},
		{ title: 'Ghi chú', width: 200, dataIndex: 'Note' },
		{
			title: 'Hành động',
			width: 150,
			render: (value, data) => (
				<>
					<Link
						href={{
							pathname: '/customer/student/student-list/student-detail/[slug]',
							query: { slug: value.StudentID }
						}}
					>
						<Tooltip title="Xem chi tiết">
							<button className="btn btn-icon">
								<Eye />
							</button>
						</Tooltip>
					</Link>

					{isAdmin && (
						<Tooltip title="Xoá học viên khỏi lớp">
							<Popconfirm
								title="Are you sure to delete this task?"
								onConfirm={() => deleteStudent(data?.ID)}
								okText="Yes"
								cancelText="No"
							>
								<button className="btn btn-icon">
									<i className="fas fa-ban" style={{ fontSize: 16, color: '#dd4667' }}></i>
								</button>
							</Popconfirm>
						</Tooltip>
					)}
				</>
			)
		}
	];
	// GET DATA IN FIRST TIME
	const fetchTeacherList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await studentListInCourseApi.getAll(filters);
			if (res.status === 200) {
				if (res.data.TotalRow && res.data.studentList.length) {
					setStudentList(res.data.studentList);
					setTotalPage(res.data.TotalRow);
					showNoti('success', res.data.message);
				}
			} else if (res.status === 204) {
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
		fetchTeacherList();
	}, [filters]);
	return (
		<>
			<PowerTable
				loading={isLoading}
				totalPage={totalPage}
				dataSource={studentList}
				getPagination={getPagination}
				columns={columns}
				TitleCard={
					userInformation &&
					(userInformation.RoleID == 1 || userInformation.RoleID == 2 || userInformation.RoleID == 5) && (
						<AddTrialStudentForm
							CourseID={ID}
							coursePrice={coursePrice}
							onFetchData={() => {
								setFilters({ ...filters });
							}}
						/>
					)
				}
				Extra={<h5>Danh sách học viên</h5>}
			/>
		</>
	);
}
export default StudentsList;
