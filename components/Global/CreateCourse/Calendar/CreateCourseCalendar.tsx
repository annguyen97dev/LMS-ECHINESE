import {Spin} from 'antd';
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
		handleSelectDate,
		dateSelected,
		//
		isLoaded,
		isLoading,
		//
		unavailableSch,
		//
		handleChangeValueSchedule,
		handleFetchInfoAvailableSchedule,
		handleChangeStatusSchedule,
		//
		optionForScheduleList,
	} = props;
	const [isVisible, setIsVisible] = useState(false);
	const {dateString} = dateSelected;
	const {showNoti} = useWrap();
	const [dataModal, setDataModal] = useState({
		dateFm: '',
		limit: 0,
		scheduleInDay: 0,
		scheduleList: [],
	});
	const [optionStudyTime, setOptionStudyTime] = useState([]);
	const openModal = () => setIsVisible(true);
	const closeModal = () => setIsVisible(false);
	const {dateFm, limit, scheduleInDay, scheduleList} = dataModal;
	useEffect(() => {
		setOptionStudyTime(optionForScheduleList.optionStudyTimeList);
	}, [optionForScheduleList]);

	const styleEvent = ({event}) => {
		const {dateString, limit, scheduleList, valid} = event.resource;
		const scheduleInDay = scheduleList.length;
		const dateFm = moment(dateString).format('DD/MM/YYYY');
		return (
			<>
				<div
					onClick={(e) => {
						e.stopPropagation();
						setDataModal({
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
		if (event.resource.dateString === dateString) {
			return {
				className: 'create-course-event create-course-event-active',
			};
		} else {
			return {
				className: cls,
			};
		}
	};
	// FETCH DATA FOR SELECT FIELD IF DAY HAVE SCHEDULE
	useEffect(() => {
		handleFetchInfoAvailableSchedule &&
			handleFetchInfoAvailableSchedule(scheduleList);
	}, [scheduleList]);
	// ADD UNAVAILABLE SCHEDULE TO LOCAL ARRAY ON MODAL CALENDAR (UI)
	useEffect(() => {
		unavailableSch.ID && handleScheduleUnavailableList(unavailableSch);
	}, [unavailableSch]);

	const handleScheduleUnavailableList = (sch) => {
		const newScheduleList = [...dataModal.scheduleList];
		const idx = newScheduleList.findIndex((s) => s.ID === sch.ID);
		if (idx >= 0) {
			newScheduleList.splice(idx, 1);
		} else {
			newScheduleList.push(sch);
		}

		setDataModal((prevState) => ({
			...prevState,
			scheduleInDay: newScheduleList.length,
			scheduleList: newScheduleList,
		}));
	};

	const checkHandleChangeStatusSchedule = (sch, type) => {
		if (!handleChangeStatusSchedule) return;
		handleScheduleUnavailableList(sch);
		handleChangeStatusSchedule(sch, type);
	};
	const checkHandleChangeValueSchedule = (uid, key, value, pos) => {
		if (!handleChangeValueSchedule) return;
		handleChangeValueSchedule(uid, key, value, pos);
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
				views={['month', 'week']}
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
								<div className="info-course">
									{
										<ScheduleList
											panelActiveListInModal={scheduleList.map((_, idx) => idx)}
										>
											{scheduleList.map((s, idx) => (
												<ScheduleItem
													key={idx}
													isUpdate={true}
													scheduleObj={s}
													isLoading={isLoading}
													handleChangeValueSchedule={(uid, key, vl) =>
														checkHandleChangeValueSchedule(uid, key, vl, idx)
													}
													handleChangeStatusSchedule={
														checkHandleChangeStatusSchedule
													}
													optionForScheduleList={
														optionForScheduleList.list[idx]
													}
													optionStudyTime={optionStudyTime}
												/>
											))}
										</ScheduleList>
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
};
const optionPropTypes = PropTypes.arrayOf(
	PropTypes.shape({
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	})
);
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
				scheduleList: PropTypes.array,
			}),
		})
	).isRequired,
	handleSelectDate: PropTypes.func,
	dateSelected: PropTypes.shape({
		dateString: PropTypes.string.isRequired,
	}),
	isLoaded: PropTypes.bool,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	//
	handleChangeValueSchedule: PropTypes.func,
	handleFetchInfoAvailableSchedule: PropTypes.func,
	handleChangeStatusSchedule: PropTypes.func,
	//
	unavailableSch: PropTypes.shape({}),
	optionForScheduleList: PropTypes.shape({
		list: PropTypes.arrayOf(
			PropTypes.shape({
				optionRoomList: optionPropTypes,
				optionTeacherList: optionPropTypes,
			})
		),
		optionStudyTimeList: optionPropTypes,
	}),
};
CreateCourseCalendar.defaultProps = {
	eventList: [],
	handleSelectDate: null,
	dateSelected: {
		dateString: '',
	},
	isLoaded: false,
	isLoading: {type: '', status: false},
	//
	handleChangeValueSchedule: null,
	handleFetchInfoAvailableSchedule: null,
	handleChangeStatusSchedule: null,
	//
	unavailableSch: {},
	optionForScheduleList: {
		list: [
			{
				optionRoomList: [
					{
						title: '',
						value: '',
					},
				],
				optionTeacherList: [
					{
						title: '',
						value: '',
					},
				],
			},
		],
		optionStudyTimeList: [
			{
				title: '',
				value: '',
			},
		],
	},
};
export default CreateCourseCalendar;
