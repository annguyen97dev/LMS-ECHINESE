import {Tooltip} from 'antd';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import {Eye} from 'react-feather';
import {studentListInCourseApi} from '~/apiBase';
import PowerTable from '~/components/PowerTable';
import {useWrap} from '~/context/wrap';

const StudentsList = () => {
	const router = useRouter();
	const {slug: ID} = router.query;
	const {showNoti} = useWrap();
	const [studentList, setStudentList] = useState<IStudentListInCourse[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const [filters, setFilters] = useState({
		pageSize: 10,
		pageIndex: 1,
		CourseID: ID,
	});
	// PAGINATION
	const getPagination = (pageIndex: number) => {
		setFilters({
			...filters,
			pageIndex,
		});
	};
	const columns = [
		{title: 'Student', dataIndex: 'StudentName'},
		{title: 'Phone', dataIndex: 'Mobile'},
		{title: 'Email', dataIndex: 'Email'},
		{title: 'Academic', dataIndex: 'AcademicName'},
		{title: 'Day off', dataIndex: 'DayOff'},
		{
			title: 'Warning',
			dataIndex: 'Warning',
			render: (bool) => bool && <span className="tag yellow">Warning</span>,
		},
		{
			title: '',
			render: (value) => (
				<Link
					href={{
						pathname: '/customer/student/student-list/student-detail/[slug]',
						query: {slug: value.StudentID},
					}}
				>
					<Tooltip title="Xem chi tiết">
						<button className="btn btn-icon">
							<Eye />
						</button>
					</Tooltip>
				</Link>
			),
		},
	];
	// GET DATA IN FIRST TIME
	const fetchTeacherList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
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
				status: false,
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
				Extra={<h5>Học viên</h5>}
			/>
		</>
	);
};
export default StudentsList;
