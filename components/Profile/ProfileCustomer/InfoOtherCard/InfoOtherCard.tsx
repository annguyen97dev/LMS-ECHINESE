import {Divider} from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import ChangeCourseTable from './ChangeCourseTable';
import ExamAppointmentTable from './ExamAppointmentTable';
import ReverseCourseTable from './ReverseCourseTable';

InfoOtherCard.propTypes = {
	studentID: PropTypes.number,
};
InfoOtherCard.defaultProps = {
	studentID: null,
};

function InfoOtherCard(props) {
	const {studentID} = props;

	return (
		<>
			<ChangeCourseTable studentID={studentID} />
			<Divider />
			<ExamAppointmentTable studentID={studentID} />
			<Divider />
			<ReverseCourseTable studentID={studentID} />
		</>
	);
}
export default InfoOtherCard;
