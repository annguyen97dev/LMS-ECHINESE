import React, { useContext, useEffect, useState } from 'react';
import { Modal, Spin } from 'antd';
import QuestionCreate from '../QuestionBank/QuestionCreate';
import ExamDetail, { useExamDetail } from '~/pages/question-bank/exam-list/exam-detail/[slug]';
import { examDetailApi, examTopicApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import { Plus } from 'react-feather';

const AddQuestionModal = (props) => {
	const { dataExam, onFetchData } = props;
	const { onAddQuestion, listQuestionAddOutside } = useExamDetail();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { showNoti } = useWrap();

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleAddQuestion = async () => {
		// onAddQuestion();
		if (listQuestionAddOutside.length > 0) {
			setIsLoading(true);
			try {
				let res = await examDetailApi.add({
					ExamTopicID: dataExam.ID,
					ExerciseOrExerciseGroup: listQuestionAddOutside
				});
				if (res.status == 200) {
					showNoti('success', 'Thêm câu hỏi thành công');

					onFetchData && onFetchData();
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsModalVisible(false);
				setIsLoading(false);
			}
		} else {
			showNoti('danger', 'Bạn chưa chọn câu hỏi nào!');
		}
	};

	return (
		<>
			<button className="btn btn-success d-block w-100 text-center" onClick={showModal}>
				<div className="d-flex align-items-center w-100">
					<Plus className="mr-2" style={{ width: '20px' }} />
					Thêm câu hỏi
				</div>
			</button>
			<Modal
				centered={true}
				style={{ top: 10 }}
				width={'90%'}
				title="Thêm câu hỏi vào đề"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				className="modal-add-question"
				footer={
					<div className="text-center">
						<button className="btn btn-light mr-2" onClick={handleCancel}>
							Đóng
						</button>
						<button className="btn btn-primary" onClick={handleAddQuestion}>
							Lưu
							{isLoading && <Spin className="loading-base" />}
						</button>
					</div>
				}
			>
				<QuestionCreate isOpenModal={isModalVisible} dataExam={dataExam} />
			</Modal>
		</>
	);
};

export default AddQuestionModal;
