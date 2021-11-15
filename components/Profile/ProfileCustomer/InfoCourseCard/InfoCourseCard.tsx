import { Collapse } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { courseStudentApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import RollUpTable from './RollUpTable';

InfoCourseCard.propTypes = {
	studentID: PropTypes.number
};
InfoCourseCard.defaultProps = {
	studentID: 0
};
const { Panel } = Collapse;
function InfoCourseCard(props) {
	const { studentID } = props;
	const [courseStudent, setCourseStudent] = useState<ICourseOfStudent[]>([]);
	const { showNoti } = useWrap();

	const getCourseOfStudent = async () => {
		try {
			const res = await courseStudentApi.getAll({
				pageSize: 9999,
				pageIndex: 1,
				UserInformationID: studentID
			});
			if (res.status === 200) {
				setCourseStudent(res.data.data);
			}
		} catch (error) {
			showNoti('danger', error.message);
		}
	};

	useEffect(() => {
		getCourseOfStudent();
	}, []);

	return (
		<Collapse accordion className="info-course-card">
			{courseStudent.map((item: any, index) => (
				<Panel header={item.CourseName} key={index}>
					{/* ĐIỂM DANH TRONG KHÓA HỌC */}
					<RollUpTable courseID={item.CourseID} studentID={studentID} />
					{/* <Divider /> */}
					{/* ĐIỂM BÀI TẬP TRONG KHÓA - TẠM THỜI CHƯA CÓ*/}
					{/* <ExercisePointTable courseID={item.CourseID} studentID={studentID} /> */}
					{/* <Divider /> */}
					{/* BẢNG ĐIỂM THEO KHÓA HỌC - TẠM THỜI CHƯA CÓ*/}
					{/* <ExamPointTable /> */}
				</Panel>
			))}
		</Collapse>
	);
}
export default InfoCourseCard;
