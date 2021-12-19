import { Modal, Spin } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
const SaveSelfCourse = (props) => {
	const { isLoading, isEdit, saveInfo, handleFetchDataToSave, handleSaveCourse, scheduleShow } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);
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
	const renderScheduleList = () => {
		return Object.keys(scheduleShow).map((date, idx) => (
			<div
				className={`create-course-save-list-item ${
					scheduleShow[date].some((obj) => obj.isValid) ? 'create-course-save-list-item-error' : ''
				}`}
				key={idx}
			>
				<span>
					{scheduleShow[date][0]?.dayOffWeek} - {moment(date).format('DD/MM/YYYY')}: {}
				</span>
				<ul>
					{scheduleShow[date]
						.sort((a, b) => a.StudyTimeID - b.StudyTimeID)
						.map((s, idx) => (
							<li key={idx}>
								<span>{s.studyTimeName}</span>
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
			{
				<Modal
					style={{ top: 20 }}
					title="Đăng ký buổi học"
					visible={isModalVisible}
					onCancel={closeModal}
					footer={
						<button
							className="btn btn-primary"
							onClick={checkHandleSaveCourse}
							disabled={isLoading.type == 'SAVE_COURSE' && isLoading.status}
						>
							Đăng ký
							{isLoading.type == 'SAVE_COURSE' && isLoading.status && <Spin className="loading-base" />}
						</button>
					}
					width={600}
				>
					<div className="create-course-save-info">
						<div className="row">
							<div className="col-md-12 col-12">
								<div className="item">
									<p style={{ marginBottom: 0 }}>
										<span>Những buổi học đăng ký:</span>
									</p>
									<div className="create-course-save-list">{renderScheduleList()}</div>
								</div>
							</div>
						</div>
					</div>
				</Modal>
			}
		</>
	);
};

SaveSelfCourse.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	isEdit: PropTypes.bool,
	scheduleShow: PropTypes.shape({}),
	saveInfo: PropTypes.shape({
		CourseName: PropTypes.string,
		BranchName: PropTypes.string,
		ProgramName: PropTypes.string,
		CurriculumName: PropTypes.string,
		DaySelectedName: PropTypes.string,
		StudyTimeName: PropTypes.string,
		EndDay: PropTypes.string
	}),
	handleSaveCourse: PropTypes.func,
	handleFetchDataToSave: PropTypes.func
};
SaveSelfCourse.defaultProps = {
	isLoading: { type: '', status: false },
	isEdit: false,
	scheduleShow: {},
	saveInfo: {},
	handleSaveCourse: null,
	handleFetchDataToSave: null
};
export default SaveSelfCourse;
