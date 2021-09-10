import {yupResolver} from '@hookform/resolvers/yup';
import {Button, Popover, Spin} from 'antd';
import Form from 'antd/lib/form/Form';
import Modal from 'antd/lib/modal/Modal';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';
import UploadFileField from '~/components/FormControl/UploadFileField';
moment.locale('vi');
const localizer = momentLocalizer(moment);

const CDCalendar = (props) => {
	const {
		isLoading,
		isUploadDocument,
		eventList,
		isLoaded,
		handleUploadDocument,
	} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [courseScheduleID, setCourseScheduleID] = useState(0);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);
	const schema = yup.object().shape({
		CourseScheduleID: yup.number().required('Bạn không được để trống'),
		File: yup
			.array()
			.min(1, 'Bạn phải chọn ít nhất 1 file')
			.nullable()
			.required('Bạn không được để trống'),
	});

	const defaultValuesInit = {
		CourseScheduleID: 0,
		File: [],
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (!isModalVisible) {
			form.reset({...defaultValuesInit});
		}
		if (!courseScheduleID) return;
		form.setValue('CourseScheduleID', courseScheduleID);
	}, [isModalVisible]);

	const checkHandleUploadDocument = (data) => {
		if (!handleUploadDocument) return;
		handleUploadDocument(data).then((res) => {
			if (res && res.status === 200) {
				closeModal();
				form.reset({...defaultValuesInit});
			}
		});
	};
	const middlewareUploadImage = (ID) => {
		setCourseScheduleID(+ID);
		openModal();
	};
	const styleEvent = ({event}, idx) => {
		const {
			ID,
			CourseID,
			RoomName,
			BranchName,
			TeacherName,
			SubjectName,
			LinkDocument,
			//
			StudyTimeName,
		}: ICourseDetailSchedule = event.resource;
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
					<li>
						<span>Tài liệu: </span>
						{LinkDocument ? (
							<a href={LinkDocument} target="_blank" download>
								<i>Click to download</i>
							</a>
						) : (
							'Trống'
						)}
					</li>
					{isUploadDocument && (
						<li>
							<Button
								size="middle"
								className="mt-3 btn-warning w-100"
								onClick={() => middlewareUploadImage(ID)}
							>
								Thêm tài liệu
							</Button>
						</li>
					)}
				</ul>
			</div>
		);
		return (
			<Popover
				title={`Ca: ${StudyTimeName}`}
				content={content}
				placement="rightTop"
				trigger={
					window.matchMedia('(max-width: 1199px)').matches ? 'click' : 'hover'
				}
			>
				<div className="course-dt-event">
					<div className="time">Ca: {StudyTimeName}</div>
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
			LinkDocument,
			//
			StudyTimeName,
		}: ICourseDetailSchedule = event.resource;
		return (
			<div className="course-dt-event">
				<div className="time">Ca: {StudyTimeName}</div>
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
						<li>
							<span>Tài liệu: </span>
							{LinkDocument ? (
								<a href={LinkDocument} target="_blank" download>
									<i>Click to download</i>
								</a>
							) : (
								'Trống'
							)}
						</li>
					</ul>
				</div>
			</div>
		);
	};

	const styleDay = ({event}) => {
		const {
			ID,
			CourseID,
			RoomName,
			BranchName,
			TeacherName,
			SubjectName,
			LinkDocument,
			//
			StudyTimeName,
		}: ICourseDetailSchedule = event.resource;
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
					<li>
						<span>Tài liệu: </span>
						{LinkDocument ? (
							<a href={LinkDocument} target="_blank" download>
								<i>Click to download</i>
							</a>
						) : (
							'Trống'
						)}
					</li>
					{isUploadDocument && (
						<li>
							<Button
								size="middle"
								className="mt-3 btn-warning w-100"
								onClick={() => middlewareUploadImage(ID)}
							>
								Thêm tài liệu
							</Button>
						</li>
					)}
				</ul>
			</div>
		);
		return (
			<Popover
				title={`Ca: ${StudyTimeName}`}
				content={content}
				placement="bottomLeft"
				trigger={
					window.matchMedia('(max-width: 1199px)').matches ? 'click' : 'hover'
				}
			>
				<div className="course-dt-event">
					<div className="time">Ca: {StudyTimeName}</div>
				</div>
			</Popover>
		);
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
				popup
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
			{isUploadDocument && (
				<Modal
					title="Thêm tài liệu cho buổi học"
					visible={isModalVisible}
					footer={null}
					onCancel={closeModal}
					width={400}
				>
					<div className="wrap-form">
						<Form
							layout="vertical"
							onFinish={form.handleSubmit(checkHandleUploadDocument)}
						>
							<div className="row">
								<div className="col-md-12 col-12">
									<InputTextField
										form={form}
										name="CourseScheduleID"
										label="Mã buổi học"
										disabled={true}
									/>
								</div>
								<div className="col-md-12 col-12">
									<UploadFileField
										form={form}
										name="File"
										label="Tài liệu buổi học"
										max={1}
									/>
								</div>
								<div
									className="col-md-12 col-12 mt-3"
									style={{textAlign: 'center'}}
								>
									<button
										type="submit"
										className="btn btn-primary"
										disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
									>
										Thêm tài liệu
										{isLoading.type == 'ADD_DATA' && isLoading.status && (
											<Spin className="loading-base" />
										)}
									</button>
								</div>
							</div>
						</Form>
					</div>
				</Modal>
			)}
		</div>
	);
};
CDCalendar.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	isUploadDocument: PropTypes.bool,
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
				StudyTimeName: PropTypes.string,
			}),
		})
	).isRequired,
	isLoaded: PropTypes.bool,
	handleUploadDocument: PropTypes.func,
};
CDCalendar.defaultProps = {
	isLoading: {type: '', status: false},
	isUploadDocument: false,
	eventList: [],
	isLoaded: false,
	handleUploadDocument: null,
};
export default CDCalendar;
