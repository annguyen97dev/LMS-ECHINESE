import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWrap } from '~/context/wrap';
import { Form, Input, Checkbox, Tooltip } from 'antd';
import { exerciseApi } from '~/apiBase/';
import { CloseOutlined } from '@ant-design/icons';
import { Plus } from 'react-feather';
import EditorSimple from '~/components/Elements/EditorSimple';
import UploadAudio from '~/components/Elements/UploadAudio';
import { parse } from 'path';

// let returnSchema = {};
// let schema = null;

let AnsID = 0;

const listAlphabet = ['A', 'B', 'C', 'D', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'];

const MultipleForm = (props) => {
	const { isSubmit, questionData, changeIsSubmit, visible, changeData } = props;
	const { showNoti } = useWrap();
	const {
		reset,
		register,
		handleSubmit,
		control,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm();
	const [form] = Form.useForm();
	const [questionDataForm, setQuestionDataForm] = useState(null);
	const [isResetEditor, setIsResetEditor] = useState(false);
	const [answerList, setAnswerList] = useState(questionData.ExerciseAnswer);
	const [loadAtFirst, setLoadAtFirst] = useState(true);

	console.log('Question in form: ', questionDataForm);

	// SUBMI FORM
	const onSubmit = handleSubmit((data: any, e) => {
		console.log('DATA SUBMIT: ', data);
	});

	// GET VALUE IN EDITOR
	const getDataEditor = (dataEditor) => {
		if (questionDataForm) {
			questionDataForm.Content = dataEditor;
		}
		setQuestionDataForm({ ...questionDataForm });
	};

	// Reset value in form
	const resetForm = () => {
		questionDataForm.Content = '';
		questionDataForm.ExerciseAnswer = [];
		setQuestionDataForm({ ...questionDataForm });
	};

	// ON CHANGE IS CORRECT
	const onChange_isCorrect = (e, AnswerID) => {
		let checked = e.target.checked;

		// Tìm vị trí sau đó gán correct vào
		let AnswerIndex = questionDataForm.ExerciseAnswer.findIndex((item) => item.ID == AnswerID);
		questionDataForm.ExerciseAnswer[AnswerIndex].isTrue = checked;
		setQuestionDataForm({ ...questionDataForm });
	};

	// ON CHANGE TEXT
	const onChange_text = (e, AnswerID) => {
		let text = e.target.value;
		let AnswerIndex = questionDataForm.ExerciseAnswer.findIndex((item) => item.ID == AnswerID);
		questionDataForm.ExerciseAnswer[AnswerIndex].AnswerContent = text;
		setQuestionDataForm({ ...questionDataForm });
	};

	// HANLDE ADD ANSWER
	const handleAddAnswer = () => {
		AnsID++;
		questionDataForm.ExerciseAnswer.push({
			ID: AnsID,
			AnswerContent: '',
			isTrue: false,
			Enable: true,
			isAdd: true
		});
		setQuestionDataForm({ ...questionDataForm });
	};

	// HANDLE DELETE ANSWER ITEM
	const deleteAnswerItem = async (AnswerID) => {
		let AnswerIndex = questionDataForm.ExerciseAnswer.findIndex((item) => item.ID == AnswerID);

		if (questionDataForm.ExerciseAnswer[AnswerIndex].isAdd) {
			questionDataForm.ExerciseAnswer.splice(AnswerIndex, 1);
		} else {
			questionDataForm.ExerciseAnswer[AnswerIndex].Enable = false;
		}

		setQuestionDataForm({ ...questionDataForm });
	};

	// SUBMIT FORM
	const handleSubmitQuestion = async () => {
		console.log('DATA SUBMIT IN FORM: ', questionDataForm);
		let res = null;

		try {
			if (questionDataForm.ID) {
				let cloneData = JSON.parse(JSON.stringify(questionDataForm));

				cloneData.ExerciseAnswer.forEach((item, index) => {
					if (item.isAdd) {
						delete item.ID;
					}
				});
				res = await exerciseApi.update(cloneData);
			} else {
				res = await exerciseApi.add(questionDataForm);
			}
			if (res.status == 200) {
				changeIsSubmit(questionDataForm.ID ? questionDataForm : res.data.data);
				showNoti('success', `${questionDataForm.ID ? 'Cập nhật' : 'Thêm'} Thành công`);
				if (!questionDataForm.ID) {
					resetForm();
				}
				setIsResetEditor(true);

				setTimeout(() => {
					setIsResetEditor(false);
				}, 500);
			}
		} catch (error) {}
	};

	// Return alphabet
	const returnAlphabet = (AnsID) => {
		let char = '';
		let cloneListAnswer = questionDataForm.ExerciseAnswer.filter((item) => item.Enable !== false);
		let indexAnswer = cloneListAnswer.findIndex((item) => item.ID == AnsID);
		char = listAlphabet[indexAnswer];

		return char;
	};

	useEffect(() => {
		isSubmit && handleSubmitQuestion();
	}, [isSubmit]);

	useEffect(() => {
		if (visible) {
			if (!questionData.ID) {
				questionData.ExerciseAnswer = [];
			}
			setQuestionDataForm({ ...questionData });
		} else {
			setQuestionDataForm(null);
			setLoadAtFirst(true);
		}
	}, [visible]);

	useEffect(() => {
		if (questionDataForm) {
			if (!loadAtFirst) {
				changeData && changeData();
			}
			setLoadAtFirst(false);
		}
	}, [questionDataForm]);

	return (
		<div className="form-create-question">
			{visible && questionDataForm && (
				<Form form={form} layout="vertical" onFinish={onSubmit}>
					<div className="container-fluid">
						<div className="row">
							<div className="col-12">
								<Form.Item name="Question" label="Câu hỏi">
									<EditorSimple
										isTranslate={true}
										handleChange={(value) => getDataEditor(value)}
										isReset={isResetEditor}
										questionContent={questionDataForm?.Content}
										questionData={questionDataForm}
									/>
								</Form.Item>
							</div>
							<div className="col-12">
								<Form.Item label="File nghe">
									<UploadAudio
										getFile={(file) => {
											questionDataForm.LinkAudio = file;
											setQuestionDataForm({ ...questionDataForm });
										}}
										valueFile={questionDataForm?.LinkAudio}
									/>
								</Form.Item>
							</div>
						</div>
						<div className="row">
							<div className="col-12 mb-4">
								<p className="style-label">Đáp án</p>
								<Tooltip title="Thêm đáp án">
									<button className="btn-add-answer" onClick={handleAddAnswer}>
										<Plus />
									</button>
								</Tooltip>
							</div>
							{questionData?.ExerciseAnswer?.map(
								(item, index) =>
									item.Enable && (
										<div className="col-md-6 col-12" key={index}>
											<div className="row-ans">
												<Checkbox checked={item.isTrue} onChange={(e) => onChange_isCorrect(e, item.ID)}></Checkbox>
												<Form.Item>
													<Input
														placeholder={returnAlphabet(item.ID)}
														value={item.AnswerContent}
														className="style-input"
														onChange={(e) => onChange_text(e, item.ID)}
													></Input>
												</Form.Item>
												<button className="delete-ans" onClick={() => deleteAnswerItem(item.ID)}>
													<CloseOutlined />
												</button>
											</div>
										</div>
									)
							)}
						</div>
					</div>
				</Form>
			)}
		</div>
	);
};

export default MultipleForm;
