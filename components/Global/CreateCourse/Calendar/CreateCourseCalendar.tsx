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
		isLoading,
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
						if (valid) {
							handleSelectDate(event);
							showNoti(
								'success',
								`Ngày ${dateFm}- hãy chọn ${limit - scheduleInDay} ca`
							);
						}
					}}
				>
					<strong>Số ca trống: {limit - scheduleInDay}</strong>
					<br />
					<strong>Số ca đã xếp: {scheduleInDay}</strong>
				</div>
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

	useEffect(() => {
		handleFetchInfoAvailableSchedule(scheduleList);
	}, [scheduleList]);

	const checkHandleChangeStatusSchedule = (sch, type) => {
		const newScheduleList = [...dataModal.scheduleList];
		const idx = newScheduleList.findIndex((s) => s.ID === sch.ID);
		newScheduleList.splice(idx, 1);
		setDataModal((prevState) => ({
			...prevState,
			scheduleInDay: newScheduleList.length,
			scheduleList: newScheduleList,
		}));
		handleChangeStatusSchedule(sch, type);
	};
	const checkHandleChangeValueSchedule = (uid, key, value, pos) =>
		handleChangeValueSchedule(uid, key, value, pos);
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
				eventPropGetter={customEventPropGetter}
				components={{event: styleEvent}}
			/>
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
							<strong>Chi tiết các ca trong ngày: </strong>
						</p>
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
												optionForScheduleList={optionForScheduleList.list[idx]}
												optionStudyTime={optionStudyTime}
											/>
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
const optionPropTypes = PropTypes.arrayOf(
	PropTypes.shape({
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	})
);
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
	handleSelectDate: PropTypes.func.isRequired,
	dateSelected: PropTypes.shape({
		dateString: PropTypes.string.isRequired,
	}),
	//
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	handleChangeValueSchedule: PropTypes.func.isRequired,
	handleFetchInfoAvailableSchedule: PropTypes.func.isRequired,
	handleChangeStatusSchedule: PropTypes.func.isRequired,
	optionForScheduleList: PropTypes.shape({
		list: PropTypes.arrayOf(
			PropTypes.shape({
				optionRoomList: optionPropTypes,
				optionTeacherList: optionPropTypes,
			})
		),
		optionStudyTimeList: optionPropTypes,
	}).isRequired,
};
CreateCourseCalendar.defaultProps = {
	eventList: [],
	dateSelected: {
		dateString: '',
	},
	isLoading: {type: '', status: false},
	//
	optionForScheduleList: {
		list: [{optionRoomList: [], optionTeacherList: []}],
		optionStudyTimeList: [],
	},
};
export default CreateCourseCalendar;
