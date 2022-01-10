import { Spin } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useWrap } from '~/context/wrap';
moment.locale('vi');
const localizer = momentLocalizer(moment);

const CreateCourseCalendar = (props) => {
	const {
		eventList,
		isLoaded,
		//
		handleSetDataModalCalendar,
		dataModalCalendar,
		//
		unAvailableList
	} = props;
	const isSmDown = window.matchMedia('(max-width: 767px)').matches;
	const [isVisible, setIsVisible] = useState(false);
	const { showNoti } = useWrap();
	const openModal = () => setIsVisible(true);
	const closeModal = () => setIsVisible(false);
	const { dateString, limit, scheduleInDay, scheduleList } = dataModalCalendar;
	const checkHandleSetDataModalCalendar = (obj) => {
		if (!handleSetDataModalCalendar) return;
		handleSetDataModalCalendar(obj);
	};
	const styleEvent = ({ event }) => {
		const { dateString, limit, scheduleList, valid } = event.resource;
		const scheduleInDay = scheduleList.length;
		return (
			<>
				<div
					onClick={(e) => {
						e.stopPropagation();
						checkHandleSetDataModalCalendar({
							dateString,
							limit,
							scheduleInDay,
							scheduleList
						});
						openModal();
						if (valid) {
							showNoti('success', `Ngày ${moment(dateString).format('DD/MM/YYYY')}- hãy chọn ${limit - scheduleInDay} ca`);
						}
					}}
				>
					<strong>Còn trống: {limit - scheduleInDay}</strong>
					<br />
					<strong>Đã xếp: {scheduleInDay}</strong>
				</div>
			</>
		);
	};
	const customEventPropGetter = (event, start, end, isSelected) => {
		let cls;
		if (event.resource.limit !== event.resource.scheduleList.length) {
			cls = 'create-course-event create-course-event-green';
		}
		if (event.resource.limit === event.resource.scheduleList.length) {
			cls = 'create-course-event';
		}
		if (event.resource.scheduleList.length === 0) {
			cls = 'create-course-event create-course-event-gray';
		}
		if (event.resource.dateString === dateString) {
			return {
				className: 'create-course-event create-course-event-active'
			};
		} else {
			return {
				className: cls
			};
		}
	};
	return (
		<div className="wrap-calendar">
			<Spin spinning={!isLoaded} size="large" wrapperClassName="calendar-loading">
				<Calendar
					className="custom-calendar"
					localizer={localizer}
					events={eventList}
					startAccessor="start"
					endAccessor="end"
					style={{ minHeight: isSmDown ? 500 : 600 }}
					popup={true}
					views={['month']}
					defaultView="month"
					showMultiDayTimes={true}
					eventPropGetter={customEventPropGetter}
					components={{ event: styleEvent }}
					formats={{
						monthHeaderFormat: (date) => moment(date).format('MM/YYYY'),
						dayRangeHeaderFormat: ({ start, end }) => `${moment(start).format('DD/MM')} - ${moment(end).format('DD/MM')}`
					}}
				/>
			</Spin>
			<Modal
				style={{
					top: window.matchMedia('(min-width: 1001px)').matches ? 122 : isSmDown ? 15 : 158
				}}
				className="custom-calendar-modal create-course-modal"
				getContainer={isSmDown ? document.body : '.create-course-wrap-modal'}
				zIndex={isSmDown ? 903 : 900}
				title={`Chi tiết ngày ${moment(dateString).format('DD/MM/YYYY')}`}
				visible={isVisible}
				okButtonProps={{ style: { display: 'none' } }}
				onCancel={closeModal}
				cancelText="Đóng"
			>
				<div>
					<div className="tt">
						<p style={{ marginBottom: '5px' }}>
							<strong>Thông tin cơ bản: </strong>
						</p>
						<div className="row">
							<div className="col-4 col-md-4">
								<p>
									Tổng số ca: <strong>{limit}</strong>
								</p>
							</div>
							<div className="col-4 col-md-4">
								<p>
									Đã xếp: <strong>{scheduleInDay}</strong>
								</p>
							</div>
							<div className="col-4 col-md-4">
								<p>
									Còn trống: <strong>{limit - scheduleInDay}</strong>
								</p>
							</div>
						</div>
					</div>
					<div className="cnt-wrap">
						<p className="tt" style={{ marginBottom: '5px' }}>
							<strong>Chi tiết các ca trong ngày: </strong>
						</p>
						<div className="cnt">
							<div className="wrap-card-info-course">
								<div className="info-course">{props.children}</div>
							</div>
						</div>
					</div>
					<div className="unavailable-mobile">{unAvailableList}</div>
				</div>
			</Modal>
		</div>
	);
};
CreateCourseCalendar.propTypes = {
	eventList: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			title: PropTypes.string.isRequired,
			start: PropTypes.instanceOf(Date).isRequired,
			end: PropTypes.instanceOf(Date).isRequired,
			resource: PropTypes.shape({
				dateString: PropTypes.string.isRequired,
				valid: PropTypes.bool.isRequired,
				limit: PropTypes.number.isRequired,
				scheduleList: PropTypes.array
			})
		})
	).isRequired,
	isLoaded: PropTypes.bool,
	//
	handleSetDataModalCalendar: PropTypes.func,
	dataModalCalendar: PropTypes.shape({
		dateString: PropTypes.string,
		limit: PropTypes.number,
		scheduleInDay: PropTypes.number,
		scheduleList: PropTypes.array
	}),
	//
	unAvailableList: PropTypes.node,
	//
	children: PropTypes.node
};
CreateCourseCalendar.defaultProps = {
	eventList: [],
	isLoaded: false,
	//
	handleSetDataModalCalendar: null,
	dataModalCalendar: {
		dateString: '',
		limit: 0,
		scheduleInDay: 0,
		scheduleList: []
	},
	//
	unAvailableList: null
};
export default CreateCourseCalendar;
