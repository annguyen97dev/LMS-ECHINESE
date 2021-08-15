// import {Popover} from 'antd';
// import moment from 'moment';
// import PropTypes from 'prop-types';
// import React from 'react';
// import {Calendar, momentLocalizer} from 'react-big-calendar';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// moment.locale('vi');
// const localizer = momentLocalizer(moment);

// const ScheduleCalendar = (props) => {
// 	const {eventList, typeStyle} = props;
// 	let styleEvent, styleAgenda, styleDay;
// 	switch (typeStyle) {
// 		case 'FmLikeCourseDetailCalendar':
// 			styleEvent = ({event}) => {
// 				const {
// 					CourseID,
// 					RoomName,
// 					BranchName,
// 					TeacherName,
// 					SubjectName,
// 					//
// 					studyTime,
// 				} = event.resource;
// 				const content = (
// 					<div className="course-dt-event-info">
// 						<ul>
// 							<li>
// 								<span>Môn:</span> {SubjectName}
// 							</li>
// 							<li>
// 								<span>Phòng:</span> {RoomName}
// 							</li>
// 							<li>
// 								<span>GV:</span> {TeacherName}
// 							</li>
// 							<li>
// 								<span>Trung tâm:</span> {BranchName}
// 							</li>
// 						</ul>
// 					</div>
// 				);
// 				return (
// 					<Popover
// 						title={`Ca: ${studyTime}`}
// 						content={content}
// 						placement="rightTop"
// 						trigger={
// 							window.matchMedia('(max-width: 1199px)').matches
// 								? 'click'
// 								: 'hover'
// 						}
// 					>
// 						<div className="course-dt-event">
// 							<div className="time">Ca: {studyTime}</div>
// 						</div>
// 					</Popover>
// 				);
// 			};
// 			styleAgenda = ({event}) => {
// 				const {
// 					CourseID,
// 					RoomName,
// 					BranchName,
// 					TeacherName,
// 					SubjectName,
// 					//
// 					studyTime,
// 				} = event.resource;
// 				return (
// 					<div className="course-dt-event">
// 						<div className="time">Ca: {studyTime}</div>
// 						<div className="course-dt-event-info">
// 							<ul>
// 								<li>
// 									<span>Môn:</span> {SubjectName}
// 								</li>
// 								<li>
// 									<span>Phòng:</span> {RoomName}
// 								</li>
// 								<li>
// 									<span>GV:</span> {TeacherName}
// 								</li>
// 								<li>
// 									<span>Trung tâm:</span> {BranchName}
// 								</li>
// 							</ul>
// 						</div>
// 					</div>
// 				);
// 			};
// 			styleDay = ({event}) => {
// 				const {
// 					CourseID,
// 					RoomName,
// 					BranchName,
// 					TeacherName,
// 					SubjectName,
// 					//
// 					studyTime,
// 				} = event.resource;
// 				const content = (
// 					<div className="course-dt-event-info">
// 						<ul>
// 							<li>
// 								<span>Môn:</span> {SubjectName}
// 							</li>
// 							<li>
// 								<span>Phòng:</span> {RoomName}
// 							</li>
// 							<li>
// 								<span>GV:</span> {TeacherName}
// 							</li>
// 							<li>
// 								<span>Trung tâm:</span> {BranchName}
// 							</li>
// 						</ul>
// 					</div>
// 				);
// 				return (
// 					<Popover
// 						title={`Ca: ${studyTime}`}
// 						content={content}
// 						placement="bottomLeft"
// 						trigger={
// 							window.matchMedia('(max-width: 1199px)').matches
// 								? 'click'
// 								: 'hover'
// 						}
// 					>
// 						<div className="course-dt-event">
// 							<div className="time">Ca: {studyTime}</div>
// 						</div>
// 					</Popover>
// 				);
// 			};
// 			break;
// 		case 'CheckBranch':
// 			styleEvent = ({event}) => {
// 				const {
// 					CourseID,
// 					RoomName,
// 					BranchName,
// 					TeacherName,
// 					SubjectName,
// 					//
// 					studyTime,
// 				} = event.resource;
// 				const content = (
// 					<div className="course-dt-event-info">
// 						<ul>
// 							<li>
// 								<span>Môn:</span> {SubjectName}
// 							</li>
// 							<li>
// 								<span>Phòng:</span> {RoomName}
// 							</li>
// 							<li>
// 								<span>GV:</span> {TeacherName}
// 							</li>
// 							<li>
// 								<span>Trung tâm:</span> {BranchName}
// 							</li>
// 						</ul>
// 					</div>
// 				);
// 				return (
// 					<Popover
// 						title={`Ca: ${studyTime}`}
// 						content={content}
// 						placement="rightTop"
// 						trigger={
// 							window.matchMedia('(max-width: 1199px)').matches
// 								? 'click'
// 								: 'hover'
// 						}
// 					>
// 						<div className="course-dt-event">
// 							<div className="time">Ca: {studyTime}</div>
// 						</div>
// 					</Popover>
// 				);
// 			};
// 			styleAgenda = ({event}) => {
// 				const {
// 					CourseID,
// 					RoomName,
// 					BranchName,
// 					TeacherName,
// 					SubjectName,
// 					//
// 					studyTime,
// 				} = event.resource;
// 				return (
// 					<div className="course-dt-event">
// 						<div className="time">Ca: {studyTime}</div>
// 						<div className="course-dt-event-info">
// 							<ul>
// 								<li>
// 									<span>Môn:</span> {SubjectName}
// 								</li>
// 								<li>
// 									<span>Phòng:</span> {RoomName}
// 								</li>
// 								<li>
// 									<span>GV:</span> {TeacherName}
// 								</li>
// 								<li>
// 									<span>Trung tâm:</span> {BranchName}
// 								</li>
// 							</ul>
// 						</div>
// 					</div>
// 				);
// 			};
// 			styleDay = ({event}) => {
// 				const {
// 					CourseID,
// 					RoomName,
// 					BranchName,
// 					TeacherName,
// 					SubjectName,
// 					//
// 					studyTime,
// 				} = event.resource;
// 				const content = (
// 					<div className="course-dt-event-info">
// 						<ul>
// 							<li>
// 								<span>Môn:</span> {SubjectName}
// 							</li>
// 							<li>
// 								<span>Phòng:</span> {RoomName}
// 							</li>
// 							<li>
// 								<span>GV:</span> {TeacherName}
// 							</li>
// 							<li>
// 								<span>Trung tâm:</span> {BranchName}
// 							</li>
// 						</ul>
// 					</div>
// 				);
// 				return (
// 					<Popover
// 						title={`Ca: ${studyTime}`}
// 						content={content}
// 						placement="bottomLeft"
// 						trigger={
// 							window.matchMedia('(max-width: 1199px)').matches
// 								? 'click'
// 								: 'hover'
// 						}
// 					>
// 						<div className="course-dt-event">
// 							<div className="time">Ca: {studyTime}</div>
// 						</div>
// 					</Popover>
// 				);
// 			};
// 			break;
// 		case 'CheckTeacher':
// 			styleEvent = ({event}) => {
// 				const {TeacherName, StudyTimeName, BranchName} = event.resource;
// 				const content = (
// 					<div className="course-dt-event-info">
// 						<ul>
// 							<li>
// 								<span>Trung tâm:</span> {BranchName}
// 							</li>
// 							<li>
// 								<span>Ca:</span> {StudyTimeName}
// 							</li>
// 						</ul>
// 					</div>
// 				);
// 				return (
// 					<Popover
// 						title={`GV: ${TeacherName}`}
// 						content={content}
// 						placement="rightTop"
// 						trigger={
// 							window.matchMedia('(max-width: 1199px)').matches
// 								? 'click'
// 								: 'hover'
// 						}
// 					>
// 						<div className="course-dt-event">
// 							<div className="time">GV: {TeacherName}</div>
// 						</div>
// 					</Popover>
// 				);
// 			};
// 			styleAgenda = ({event}) => {
// 				const {TeacherName, StudyTimeName, BranchName} = event.resource;
// 				return (
// 					<div className="course-dt-event">
// 						<div className="time">GV: {TeacherName}</div>
// 						<div className="course-dt-event-info">
// 							<ul>
// 								<li>
// 									<span>Trung tâm:</span> {BranchName}
// 								</li>
// 								<li>
// 									<span>Ca:</span> {StudyTimeName}
// 								</li>
// 							</ul>
// 						</div>
// 					</div>
// 				);
// 			};
// 			styleDay = ({event}) => {
// 				const {TeacherName, StudyTimeName, BranchName} = event.resource;

// 				const content = (
// 					<div className="course-dt-event-info">
// 						<ul>
// 							<li>
// 								<span>Trung tâm:</span> {BranchName}
// 							</li>
// 							<li>
// 								<span>Ca:</span> {StudyTimeName}
// 							</li>
// 						</ul>
// 					</div>
// 				);
// 				return (
// 					<Popover
// 						title={`GV: ${TeacherName}`}
// 						content={content}
// 						placement="bottomLeft"
// 						trigger={
// 							window.matchMedia('(max-width: 1199px)').matches
// 								? 'click'
// 								: 'hover'
// 						}
// 					>
// 						<div className="course-dt-event">
// 							<div className="time">GV: {TeacherName}</div>
// 						</div>
// 					</Popover>
// 				);
// 			};
// 			break;
// 		default:
// 			break;
// 	}
// 	return (
// 		<div className="wrap-calendar">
// 			<Calendar
// 				className="custom-calendar"
// 				localizer={localizer}
// 				events={eventList}
// 				startAccessor="start"
// 				endAccessor="end"
// 				style={{minHeight: 600}}
// 				popup
// 				defaultView="month"
// 				showMultiDayTimes={false}
// 				formats={{
// 					agendaDateFormat: 'DD/MM/YYYY',
// 					monthHeaderFormat: (date) => moment(date).format('MM/YYYY'),
// 					dayHeaderFormat: (date) => {
// 						const dayArr = [
// 							'Chủ Nhật',
// 							'Thứ 2',
// 							'Thứ 3',
// 							'Thứ 4',
// 							'Thứ 5',
// 							'Thứ 6',
// 							'Thứ 7',
// 						];
// 						const dayOffWeek = dayArr[moment(date).day()];
// 						return `${dayOffWeek} - ${moment(date).format('DD/MM')}`;
// 					},
// 					dayRangeHeaderFormat: ({start, end}) =>
// 						`${moment(start).format('DD/MM')} - ${moment(end).format('DD/MM')}`,
// 				}}
// 				components={{
// 					event: styleEvent,
// 					day: {
// 						event: styleDay,
// 					},
// 					agenda: {event: styleAgenda},
// 				}}
// 			/>
// 		</div>
// 	);
// };
// ScheduleCalendar.propTypes = {
// 	eventList: PropTypes.arrayOf(
// 		PropTypes.shape({
// 			id: PropTypes.number.isRequired,
// 			title: PropTypes.string.isRequired,
// 			start: PropTypes.instanceOf(Date).isRequired,
// 			end: PropTypes.instanceOf(Date).isRequired,
// 			resource: PropTypes.shape({}),
// 		})
// 	).isRequired,
// 	typeStyle: PropTypes.string,
// };
// ScheduleCalendar.defaultProps = {
// 	eventList: [],
// 	typeStyle: '',
// };
// export default ScheduleCalendar;
