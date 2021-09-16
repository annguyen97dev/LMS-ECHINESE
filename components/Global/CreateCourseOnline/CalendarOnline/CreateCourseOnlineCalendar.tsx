import {Spin} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {useWrap} from '~/context/wrap';
moment.locale('vi');
const localizer = momentLocalizer(moment);

const CreateCourseOnlineCalendar = (props) => {
	const {
		eventList,
		handleSelectDate,
		dateSelected,
		//
		isLoaded,
		//
		handleSetDataModalCalendar,
		dataModalCalendar,
	} = props;

	const [isVisible, setIsVisible] = useState(false);
	const {showNoti} = useWrap();
	const openModal = () => setIsVisible(true);
	const closeModal = () => setIsVisible(false);
	const {dateFm, limit, scheduleInDay, scheduleList} = dataModalCalendar;
	const checkHandleSetDataModalCalendar = (obj) => {
		if (!handleSetDataModalCalendar) return;
		handleSetDataModalCalendar(obj);
	};
	const styleEvent = ({event}) => {
		const {dateString, limit, scheduleList, valid} = event.resource;
		const scheduleInDay = scheduleList.length;
		const dateFm = moment(dateString).format('DD/MM/YYYY');
		return (
			<>
				<div
					onClick={(e) => {
						e.stopPropagation();
						checkHandleSetDataModalCalendar({
							dateFm,
							limit,
							scheduleInDay,
							scheduleList,
						});
						openModal();
						if (handleSelectDate) {
							handleSelectDate(event);
						}
						if (valid) {
							showNoti(
								'success',
								`Ngày ${dateFm}- hãy chọn ${limit - scheduleInDay} ca`
							);
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
		if (event.resource.dateString === dateSelected) {
			return {
				className: 'create-course-event create-course-event-active',
			};
		} else {
			return {
				className: cls,
			};
		}
	};
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
				popup={true}
				views={['month']}
				defaultView="month"
				showMultiDayTimes={true}
				eventPropGetter={customEventPropGetter}
				components={{event: styleEvent}}
				formats={{
					monthHeaderFormat: (date) => moment(date).format('MM/YYYY'),
					dayRangeHeaderFormat: ({start, end}) =>
						`${moment(start).format('DD/MM')} - ${moment(end).format('DD/MM')}`,
				}}
			/>
			<Spin className="calendar-loading" size="large" />
			<Modal
				className="custom-calendar-modal create-course-modal"
				getContainer=".create-course-wrap-modal"
				zIndex={900}
				title={`Chi tiết ngày ${dateFm}`}
				visible={isVisible}
				footer={null}
				onCancel={closeModal}
			>
				<div>
					<div className="tt">
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
									Đã xếp: <strong>{scheduleInDay}</strong>
								</p>
							</div>
							<div className="col-12 col-md-4">
								<p>
									Còn trống: <strong>{limit - scheduleInDay}</strong>
								</p>
							</div>
						</div>
					</div>
					<div className="cnt-wrap">
						<p className="tt" style={{marginBottom: '5px'}}>
							<strong>Chi tiết các ca trong ngày: </strong>
						</p>
						<div className="cnt">
							<div className="wrap-card-info-course">
								<div className="info-course">{props.children}</div>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
};
CreateCourseOnlineCalendar.propTypes = {
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
				scheduleList: PropTypes.array,
			}),
		})
	).isRequired,
	handleSelectDate: PropTypes.func,
	dateSelected: PropTypes.string,
	isLoaded: PropTypes.bool,
	//
	handleSetDataModalCalendar: PropTypes.func,
	dataModalCalendar: PropTypes.shape({
		dateFm: PropTypes.string,
		limit: PropTypes.number,
		scheduleInDay: PropTypes.number,
		scheduleList: PropTypes.array,
	}),
	//
	children: PropTypes.node,
};
CreateCourseOnlineCalendar.defaultProps = {
	eventList: [],
	handleSelectDate: null,
	dateSelected: '',
	isLoaded: false,
	//
	handleSetDataModalCalendar: null,
	dataModalCalendar: {
		dateFm: '',
		limit: 0,
		scheduleInDay: 0,
		scheduleList: [],
	},
};
export default CreateCourseOnlineCalendar;
