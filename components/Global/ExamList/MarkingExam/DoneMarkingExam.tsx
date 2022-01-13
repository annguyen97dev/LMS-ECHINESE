import { CheckCircleOutlined, ExclamationCircleOutlined, FormOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { packageResultDetailApi } from '~/apiBase/package/package-result-detail';
import { useDoneTest } from '~/context/useDoneTest';
import { useWrap } from '~/context/wrap';
import { Modal, Input, Spin, Button } from 'antd';
import { examAppointmentResultApi } from '~/apiBase';
import { courseExamResultApi } from '~/apiBase/package/course-exam-result';
import { homeworkPonimentApi } from '~/apiBase/course-detail/home-work-pontment';

const { TextArea } = Input;

const DoneMarkingExam = (props) => {
	const { onDoneMarking, isMarked, type } = props;
	const { dataMarking, getDataMarking } = useDoneTest();
	const { showNoti } = useWrap();
	const [loading, setLoading] = useState(false);
	const [checkDone, setCheckDone] = useState(false);

	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		handleMarkingExam();
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const remakeData = () => {
		let dataSubmit = null;
		switch (type) {
			case 'test':
				let dataTest = {
					ExamAppointmentResultID: null,
					Note: '',
					examAppointmentExerciseStudentList: []
				};
				dataTest.ExamAppointmentResultID = dataMarking.SetPackageResultID;
				dataTest.Note = dataMarking.Note;
				dataTest.examAppointmentExerciseStudentList = [...dataMarking.setPackageExerciseStudentsList];

				dataSubmit = { ...dataTest };
				break;

			case 'check':
				let dataCheck = {
					CourseExamresultID: dataMarking.SetPackageResultID,
					Note: dataMarking.Note,
					courseExamExerciseStudentList: [...dataMarking.setPackageExerciseStudentsList]
				};

				dataSubmit = { ...dataCheck };
				break;

			case 'homework':
				let dataHW = {
					HomeworkResultID: dataMarking.SetPackageResultID,
					Note: dataMarking.Note,
					homeworkExerciseStudenttList: [...dataMarking.setPackageExerciseStudentsList]
				};

				dataSubmit = { ...dataHW };
				break;

			default:
				dataSubmit = { ...dataMarking };
				break;
		}

		return dataSubmit;
	};

	const handleMarkingExam = async () => {
		setLoading(true);
		let dataSubmit = remakeData();

		console.log('Data Submit: ', dataMarking);

		let res = null;

		try {
			switch (type) {
				case 'test':
					res = await examAppointmentResultApi.updatePoint(dataSubmit);
					break;

				case 'check':
					res = await courseExamResultApi.updatePoint(dataSubmit);
					break;

				case 'homework':
					res = await homeworkPonimentApi.update(dataSubmit);
					break;

				default:
					res = await packageResultDetailApi.updatePoint(dataSubmit);
					break;
			}

			if (res.status === 200) {
				showNoti('success', 'Hoàn tất chấm bài');
				onDoneMarking && onDoneMarking();
				setIsModalVisible(false);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoading(false);
		}
	};

	const onChange_note = (value) => {
		getDataMarking({
			...dataMarking,
			Note: value
		});
	};

	useEffect(() => {
		if (isModalVisible) {
			let nullPoint = dataMarking?.setPackageExerciseStudentsList.some((item) => item['Point'] == null);
			setCheckDone(!nullPoint);
		}
	}, [isModalVisible]);

	return (
		<>
			<button className="btn btn-warning ml-2" onClick={showModal}>
				<span className="d-flex align-items-center">
					<FormOutlined className="mr-2" />
					Hoàn tất chấm bài
				</span>
			</button>
			<Modal
				title={
					isMarked || !checkDone ? (
						<button className="btn btn-icon delete">
							<WarningOutlined />
						</button>
					) : (
						'Hoàn tất chấm bài'
					)
				}
				footer={null}
				visible={isModalVisible}
				// onOk={handleOk}
				onCancel={handleCancel}
				// confirmLoading={loading}
			>
				{isMarked ? (
					<p className="mb-0" style={{ fontWeight: 500 }}>
						Đề thi này đã được chấm. <br /> Bạn chỉ được chấm lại khi có yêu cầu của học viên
					</p>
				) : !checkDone ? (
					<p className="mb-0" style={{ fontWeight: 500 }}>
						Vẫn còn câu chưa được chấm điểm! <br />
						Vui lòng chấm nốt số câu còn lại
					</p>
				) : (
					<>
						<p style={{ fontWeight: 500 }}>Nhận xét (có thể để trống)</p>
						<TextArea onChange={(e) => onChange_note(e.target.value)}></TextArea>
						<button className="btn btn-primary w-100 mt-3" onClick={handleMarkingExam}>
							Lưu
							{loading && <Spin className="loading-base" />}
						</button>{' '}
					</>
				)}
			</Modal>
		</>
	);
};

export default DoneMarkingExam;
