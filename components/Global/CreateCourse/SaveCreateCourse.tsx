import {Modal, Spin} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
// ------------ DRAWER INFO CORUSE --------------
const SaveCreateCourse = (props) => {
	const {isLoading, saveInfo, handleFetchDataToSave, handleSaveCourse} = props;
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
			>
				<div className="info-course-save">
					<div className="row">
						<div className="col-md-6 col-12">
							<div className="item">
								<p>
									<span>Trung tâm</span>
									<span>{saveInfo.BranchName}</span>
								</p>
							</div>
						</div>

						<div className="col-md-6 col-12">
							<div className="item">
								<p>
									<span>Phòng</span>
									<span>{saveInfo.RoomName}</span>
								</p>
							</div>
						</div>
						<div className="col-md-6 col-12">
							<div className="item">
								<p>
									<span>Ca</span>
									<span>{saveInfo.StudyTimeName}</span>
								</p>
							</div>
						</div>
						<div className="col-md-6 col-12">
							<div className="item">
								<p>
									<span>Thứ</span>
									<span>{saveInfo.DaySelectedName}</span>
								</p>
							</div>
						</div>

						<div className="col-md-6 col-12">
							<div className="item">
								<p>
									<span>Giáo trình</span>
									<span>{saveInfo.CurriculumName}</span>
								</p>
							</div>
						</div>
						<div className="col-md-6 col-12">
							<div className="item">
								<p>
									<span>Chương trình học</span>
									<span>{saveInfo.ProgramName}</span>
								</p>
							</div>
						</div>
						<div className="col-md-6 col-12">
							<div className="item">
								<p>
									<span>Ngày bắt đầu</span>
									<span>{moment(saveInfo.StartDay).format('DD/MM/YYYY')}</span>
								</p>
							</div>
						</div>
						<div className="col-md-6 col-12">
							<div className="item">
								<p>
									<span>Học phí</span>
									<span></span>
								</p>
							</div>
						</div>
						<div className="col-md-12 col-12">
							<div className="item">
								<p>
									<span>Tên khóa học</span>
									<span>{saveInfo.CourseName}</span>
								</p>
							</div>
						</div>
						<div className="col-12 mt-1">
							<button
								className="btn btn-primary w-100"
								onClick={checkHandleSaveCourse}
								disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
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
	saveInfo: PropTypes.shape({}),
	handleSaveCourse: PropTypes.func,
	handleFetchDataToSave: PropTypes.func,
};
SaveCreateCourse.defaultProps = {
	saveInfo: {},
	handleSaveCourse: null,
	handleFetchDataToSave: null,
};
export default SaveCreateCourse;
