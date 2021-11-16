import React, { useEffect, useState } from 'react';
import { studentApi } from '~/apiBase';
import NestedTable from '~/components/Elements/NestedTable';
import { useWrap } from '~/context/wrap';

const CourseOfStudentDetail = (props) => {
	const { studentID } = props;
	const { showNoti } = useWrap();
	const [dataSource, setDataSource] = useState<any>();
	const [loading, setLoading] = useState({
		type: 'GET_ALL',
		status: false
	});

	const getDataSource = async () => {
		setLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await studentApi.getCourseOfStudentDetail(studentID);
			if (res.status === 200) {
				setDataSource(res.data.data);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	useEffect(() => {
		if (studentID) {
			getDataSource();
		}
	}, [studentID]);

	const columns = [
		{
			title: 'Khóa học',
			dataIndex: 'CourseName',
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Giáo viên',
			render: (data) =>
				data.Teacher.map((item, index) => (
					<p className="font-weight-black d-block" key={index}>
						{item.TeacherName}
					</p>
				))
		}
	];

	return (
		<>
			<NestedTable loading={loading} addClass="basic-header" dataSource={dataSource} columns={columns} haveBorder={true} />
		</>
	);
};

export default CourseOfStudentDetail;
