import {Collapse, Modal, Spin} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
// ------------ DRAWER INFO CORUSE --------------
const SaveCreateCourse = (props) => {
	const {
		isLoading,
		saveInfo,
		handleFetchDataToSave,
		handleSaveCourse,
		scheduleShow,
	} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);
	const {Panel} = Collapse;
	const checkHandleFetchDataToSave = () => {
		if (!handleFetchDataToSave) return;
		handleFetchDataToSave();
	};
	const checkHandleSaveCourse = () => {
		if (!handleSaveCourse) return;
		handleSaveCourse().then((res) => {
			if (res && res.status === 200) {
				closeModal();
			}
		});
	};
	// const renderScheduleList = () => {
	// 	return Object.keys(scheduleShow).map((date, idx1) => (
	// 		<Panel
	// 			header={`${scheduleShow[date][0]?.dayOffWeek} - ${moment(date).format(
	// 				'DD/MM/YYYY'
	// 			)}`}
	// 			key={idx1 + 1}
	// 			className={`create-course-general ${
	// 				scheduleShow[date][0]?.isValid ? 'create-course-general-error' : ''
	// 			}`}
	// 		>
	// 			<div className="create-course-general-box">
	// 				{scheduleShow[date]
	// 					?.sort((a, b) => a.StudyTimeID - b.StudyTimeID)
	// 					.map((s, idx2) => (
	// 						<div className="create-course-general-item" key={idx2}>
	// 							<span>
	// 								{s.studyTimeName} - {s.roomName}
	// 							</span>
	// 							<br />
	// 							<span>Giáo viên: {s.teacherName}</span>
	// 						</div>
	// 					))}
	// 			</div>
	// 		</Panel>
	// 	));
	// };
	const renderScheduleList = () => {
		return Object.keys(scheduleShow).map((date, idx) => (
			<div
				className={`create-course-general-item ${
					scheduleShow[date][0]?.isValid
						? 'create-course-general-item-error'
						: ''
				}`}
				key={idx}
			>
				<span>
					{scheduleShow[date][0]?.dayOffWeek} -{' '}
					{moment(date).format('DD/MM/YYYY')}: {}
				</span>
				<ul>
					{scheduleShow[date]
						.sort((a, b) => a.StudyTimeID - b.StudyTimeID)
						.map((s, idx) => (
							<li key={idx}>
								<span>
									{s.studyTimeName} - {s.roomName}
								</span>
								<p>Giáo viên: {s.teacherName}</p>
							</li>
						))}
				</ul>
			</div>
		));
	};
	return (
		<>
			<button
				type="button"
				className="btn btn-success"
				onClick={() => {
					openModal();
					checkHandleFetchDataToSave();
				}}
			>
				Lưu
			</button>
			<Modal
				title="Thông tin khóa học"
				visible={isModalVisible}
				onCancel={closeModal}
				footer={null}
				width={800}
			>
				<div className="info-course-save">
					<div className="row">
						<div className="col-md-12 col-12">
							<div className="item">
								<p>
									<span>Tên khóa học:</span>
									<span>{saveInfo.CourseName}</span>
								</p>
							</div>
						</div>
						<div className="col-md-6 col-12">
							<div className="item">
								<p>
									<span>Trung tâm:</span>
									<span>{saveInfo.BranchName}</span>
								</p>
							</div>
						</div>
						<div className="col-md-6 col-12">
							<div className="item">
								<p>
									<span>Phòng:</span>
									<span>{saveInfo.RoomName}</span>
								</p>
							</div>
						</div>
						<div className="col-md-6 col-12">
							<div className="item">
								<p>
									<span>Ca:</span>
									<span>{saveInfo.StudyTimeName}</span>
								</p>
							</div>
						</div>
						<div className="col-md-6 col-12">
							<div className="item">
								<p>
									<span>Thứ:</span>
									<span>{saveInfo.DaySelectedName}</span>
								</p>
							</div>
						</div>
						<div className="col-md-6 col-12">
							<div className="item">
								<p>
									<span>Giáo trình:</span>
									<span>{saveInfo.CurriculumName}</span>
								</p>
							</div>
						</div>
						<div className="col-md-6 col-12">
							<div className="item">
								<p>
									<span>Chương trình học:</span>
									<span>{saveInfo.ProgramName}</span>
								</p>
							</div>
						</div>
						<div className="col-md-6 col-12">
							<div className="item">
								<p>
									<span>Ngày bắt đầu:</span>
									<span>{moment(saveInfo.StartDay).format('DD/MM/YYYY')}</span>
								</p>
							</div>
						</div>
						<div className="col-md-6 col-12">
							<div className="item">
								<p>
									<span>Ngày kết thúc:</span>
									<span>{moment(saveInfo.EndDay).format('DD/MM/YYYY')}</span>
								</p>
							</div>
						</div>
						<div className="col-md-12 col-12">
							<div className="item">
								<p style={{marginBottom: 0}}>
									<span>Lịch học tổng quát:</span>
								</p>
								<div className="create-course-general">
									{renderScheduleList()}
								</div>
							</div>
						</div>
						{/* <div className="col-md-12 col-12">
							<div className="item">
								<p style={{marginBottom: 0}}>
									<span>Lịch học tổng quát:</span>
								</p>
								<div>
									<Collapse defaultActiveKey={['1']} accordion>
										{renderScheduleList()}
									</Collapse>
								</div>
							</div>
						</div> */}
						<div className="col-12 mt-3">
							<button
								className="btn btn-primary w-100"
								onClick={checkHandleSaveCourse}
								disabled={isLoading.type == 'SAVE_COURSE' && isLoading.status}
							>
								Lưu tất cả
								{isLoading.type == 'SAVE_COURSE' && isLoading.status && (
									<Spin className="loading-base" />
								)}
							</button>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

SaveCreateCourse.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	scheduleShow: PropTypes.shape({}),
	// scheduleShow: PropTypes.arrayOf(
	// 	PropTypes.shape({
	// 		date: PropTypes.string.isRequired,
	// 		dayOffWeek: PropTypes.string.isRequired,
	// 		roomName: PropTypes.string.isRequired,
	// 		studyTimeName: PropTypes.string.isRequired,
	// 	})
	// ),
	saveInfo: PropTypes.shape({}),
	handleSaveCourse: PropTypes.func,
	handleFetchDataToSave: PropTypes.func,
};
SaveCreateCourse.defaultProps = {
	scheduleShow: {},
	saveInfo: {},
	handleSaveCourse: null,
	handleFetchDataToSave: null,
};
export default SaveCreateCourse;
