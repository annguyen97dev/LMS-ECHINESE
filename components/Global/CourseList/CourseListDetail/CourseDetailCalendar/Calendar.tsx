import {Popover, Spin} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
moment.locale('vi');
const localizer = momentLocalizer(moment);

const CDCalendar = (props) => {
	const now = new Date();
	const {eventList, isLoaded} = props;
	const [firstEventStartTime, setFirstEventStartTime] = useState(now);
	const styleEvent = ({event}) => {
		const {
			CourseID,
			RoomName,
			BranchName,
			TeacherName,
			SubjectName,
			//
			studyTime,
		} = event.resource;
		const content = (
			<div className="course-dt-event-info">
				<ul>
					<li>
						<span>Môn:</span> {SubjectName}
					</li>
					<li>
						<span>Phòng:</span> {RoomName}
					</li>
					<li>
						<span>GV:</span> {TeacherName}
					</li>
					<li>
						<span>Trung tâm:</span> {BranchName}
					</li>
				</ul>
			</div>
		);
		return (
			<Popover
				title={`Ca: ${studyTime}`}
				content={content}
				placement="rightTop"
				trigger={
					window.matchMedia('(max-width: 1199px)').matches ? 'click' : 'hover'
				}
			>
				<div className="course-dt-event">
					<div className="time">Ca: {studyTime}</div>
				</div>
			</Popover>
		);
	};
	const styleAgenda = ({event}) => {
		const {
			CourseID,
			RoomName,
			BranchName,
			TeacherName,
			SubjectName,
			//
			studyTime,
		} = event.resource;
		return (
			<div className="course-dt-event">
				<div className="time">Ca: {studyTime}</div>
				<div className="course-dt-event-info">
					<ul>
						<li>
							<span>Môn:</span> {SubjectName}
						</li>
						<li>
							<span>Phòng:</span> {RoomName}
						</li>
						<li>
							<span>GV:</span> {TeacherName}
						</li>
						<li>
							<span>Trung tâm:</span> {BranchName}
						</li>
					</ul>
				</div>
			</div>
		);
	};
	const styleDay = ({event}) => {
		const {
			CourseID,
			RoomName,
			BranchName,
			TeacherName,
			SubjectName,
			//
			studyTime,
		} = event.resource;
		const content = (
			<div className="course-dt-event-info">
				<ul>
					<li>
						<span>Môn:</span> {SubjectName}
					</li>
					<li>
						<span>Phòng:</span> {RoomName}
					</li>
					<li>
						<span>GV:</span> {TeacherName}
					</li>
					<li>
						<span>Trung tâm:</span> {BranchName}
					</li>
				</ul>
			</div>
		);
		return (
			<Popover
				title={`Ca: ${studyTime}`}
				content={content}
				placement="bottomLeft"
				trigger={
					window.matchMedia('(max-width: 1199px)').matches ? 'click' : 'hover'
				}
			>
				<div className="course-dt-event">
					<div className="time">Ca: {studyTime}</div>
				</div>
			</Popover>
		);
	};
	useEffect(() => {
		eventList.length && setFirstEventStartTime(eventList[0]?.start);
	}, [eventList]);

	return (
		<div
			className={`wrap-calendar ${!isLoaded ? 'wrap-calendar-loading' : ''}`}
		>
			<Calendar
				className="custom-calendar"
				localizer={localizer}
				events={eventList}
				startAccessor="start"
				endAccessor="end"
				style={{minHeight: 600}}
				popup
				defaultDate={moment(firstEventStartTime).toDate()}
				defaultView="month"
				showMultiDayTimes={false}
				formats={{
					agendaDateFormat: 'DD/MM/YYYY',
					monthHeaderFormat: (date) => moment(date).format('MM/YYYY'),
					dayHeaderFormat: (date) => {
						const dayArr = [
							'Chủ Nhật',
							'Thứ 2',
							'Thứ 3',
							'Thứ 4',
							'Thứ 5',
							'Thứ 6',
							'Thứ 7',
						];
						const dayOffWeek = dayArr[moment(date).day()];
						return `${dayOffWeek} - ${moment(date).format('DD/MM')}`;
					},
					dayRangeHeaderFormat: ({start, end}) =>
						`${moment(start).format('DD/MM')} - ${moment(end).format('DD/MM')}`,
				}}
				components={{
					event: styleEvent,
					day: {
						event: styleDay,
					},
					agenda: {event: styleAgenda},
				}}
				messages={{}}
			/>
			<Spin className="calendar-loading" size="large" />
		</div>
	);
};
CDCalendar.propTypes = {
	eventList: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			title: PropTypes.string.isRequired,
			start: PropTypes.instanceOf(Date).isRequired,
			end: PropTypes.instanceOf(Date).isRequired,
			resource: PropTypes.shape({
				CourseID: PropTypes.number,
				RoomName: PropTypes.string,
				BranchName: PropTypes.string,
				TeacherName: PropTypes.string,
				SubjectName: PropTypes.string,
				//
				studyTime: PropTypes.string,
			}),
		})
	).isRequired,
	isLoaded: PropTypes.bool,
};
CDCalendar.defaultProps = {
	eventList: [],
	isLoaded: false,
};
export default CDCalendar;
