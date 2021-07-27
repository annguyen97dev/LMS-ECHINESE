import {Popconfirm} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {useWrap} from '~/context/wrap';
import ScheduleItem from '../Schedule/ScheduleItem';
import ScheduleList from '../Schedule/ScheduleList';
moment.locale('vi');
const localizer = momentLocalizer(moment);

const CreateCourseCalendar = (props) => {
	const {
		eventList,
		handleRemoveCourse,
		handleSelectDate,
		handleSelectSlot,
		dateSelected,
	} = props;
	const {dateString} = dateSelected;
	const {showNoti} = useWrap();

	const styleEvent = ({event}) => {
		const [isVisible, setIsVisible] = useState(false);
		const {dateString, limit, scheduleList, valid} = event.resource;
		const scheduleInDay = scheduleList.length;
		const dateFm = moment(dateString).format('DD/MM/YYYY');
		const openModal = () => {
			console.log(123);
			setIsVisible(true);
		};
		const closeModal = () => setIsVisible(false);
		// console.log(isVisible);
		useEffect(() => {
			console.log(isVisible);
		}, [isVisible]);
		return (
			<>
				<div
					onClick={(e) => {
						e.stopPropagation();
						// alert(isVisible);
						// handleSelectDate(event, valid).then((res) => {
						// 	// console.log(res);
						// 	// openModal();
						// 	// setIsVisible(res);
						// 	console.log(res);
						// });
						setIsVisible(true);

						if (valid) {
							handleSelectDate(event);
							showNoti(
								'success',
								`Ngày ${dateFm}- hãy chọn ${limit - scheduleInDay} ca`
							);
						} else {
							showNoti('danger', 'Số ca đạt giới hạn');
						}
						// openModal();
						// if (event.resource.valid) {
						// showNoti(
						// 	'success',
						// 	`Ngày ${moment(event.resource.dateString.slice(0, 10)).format(
						// 		'DD/MM/YYYY'
						// 	)}- chọn tối đa ${event.resource.limit} ca`
						// );
						// handleSelectEvent(event);
						// } else {
						// showNoti('danger', 'Không còn ca trống trong ngày');
						// }
					}}
				>
					<strong>Số ca trống: {limit - scheduleInDay}</strong>
					<br />
					<strong>Số ca đã xếp: {scheduleInDay}</strong>

					{/* {event.resource.scheduleList && event.resource.scheduleList.map((s) => <div>{s.eventName}</div>)} */}
				</div>
				<Modal
					title={`Chi tiết ngày ${dateFm}`}
					visible={isVisible}
					footer={null}
					onCancel={closeModal}
				>
					<div>
						<p style={{marginBottom: '5px'}}>
							<strong>Thông tin cơ bản: </strong>
						</p>
						<div className="row">
							<div className="col-12 col-md-4">
								<p>
									Tổng số ca: <strong>{limit}</strong>
								</p>
							</div>
							<div className="col-12 col-md-4">
								<p>
									Số ca đã sắp xếp: <strong>{scheduleInDay}</strong>
								</p>
							</div>
							<div className="col-12 col-md-4">
								<p>
									Số ca còn lại: <strong>{limit - scheduleInDay}</strong>
								</p>
							</div>
						</div>
						<div>
							<p style={{marginBottom: '5px'}}>
								<strong>Chi tiết các buổi học trong ngày: </strong>
							</p>
							<div className="wrap-card-info-course">
								<div className="info-course">
									{
										<ScheduleList>
											{scheduleList.map((s, idx) => (
												<ScheduleItem key={idx} scheduleObj={s} />
											))}
										</ScheduleList>
									}
								</div>
							</div>
						</div>
					</div>
				</Modal>
			</>
		);
	};

	const customEventPropGetter = (event, start, end, isSelected) => {
		if (event.resource.dateString === dateString) {
			return {
				className: 'create-course-event create-course-event-active',
			};
		} else {
			return {
				className: 'create-course-event',
			};
		}
	};

	return (
		<>
			<Calendar
				selectable
				localizer={localizer}
				events={eventList}
				startAccessor="start"
				endAccessor="end"
				style={{height: 600}}
				popup={true}
				showMultiDayTimes={true}
				// min={new Date()}
				// defaultView="week"
				// onSelectEvent={handleSelectEvent}
				// onSelectSlot={handleSelectSlot}
				// dayPropGetter={customDayPropGetter}
				eventPropGetter={customEventPropGetter}
				components={{event: styleEvent}}
			/>
		</>
	);
};

CreateCourseCalendar.propTypes = {
	evenList: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			title: PropTypes.string.isRequired,
			start: PropTypes.instanceOf(Date).isRequired,
			end: PropTypes.instanceOf(Date).isRequired,
			resource: PropTypes.arrayOf(
				PropTypes.shape({
					center: PropTypes.string.isRequired,
					academy: PropTypes.string.isRequired,
					room: PropTypes.string.isRequired,
					session: PropTypes.string.isRequired,
					book: PropTypes.string.isRequired,
					block: PropTypes.string.isRequired,
					classTT: PropTypes.string.isRequired,
				}).isRequired
			),
		})
	),
	// handleRemoveCourse: PropTypes.func.isRequired,
	handleSelectDate: PropTypes.func.isRequired,
	// handleSelectSlot: PropTypes.func.isRequired,
	//
	dateSelected: PropTypes.shape({
		// scheduleList: PropTypes.array.isRequired,
		dateString: PropTypes.string.isRequired,
	}),
};
CreateCourseCalendar.defaultProps = {
	eventList: [],
	//
	dateSelected: {
		// scheduleList: [],
		dateString: '',
	},
};
export default CreateCourseCalendar;
