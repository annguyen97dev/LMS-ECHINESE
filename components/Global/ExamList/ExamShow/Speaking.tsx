import React, { useEffect, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Tooltip, Popconfirm } from 'antd';
import { Trash2 } from 'react-feather';
import { examDetailApi } from '~/apiBase';
import { useExamDetail } from '~/pages/question-bank/exam-list/exam-detail/[slug]';
import { useWrap } from '~/context/wrap';
import EditPoint from '../ExamForm/EditPoint';
import ChangePosition from '../ExamForm/ChangePosition';
import AudioRecord from '~/components/Elements/AudioRecord/AudioRecord';
import { useDoingTest } from '~/context/useDoingTest';
import { useDoneTest } from '~/context/useDoneTest';
import MarkingExam from '../MarkingExam/MarkingExam';

const SpeakingList = (props) => {
	const { isChangePosition } = useExamDetail();
	const { doneTestData, dataMarking, getDataMarking } = useDoneTest();
	const { onDeleteQuestion } = useExamDetail();
	const { activeID, packageResult, getPackageResult, getListPicked } = useDoingTest();
	const { dataQuestion, listQuestionID, isDoingTest, isMarked, arPosition, handleChange, addOldItem } = props;
	const { showNoti } = useWrap();
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [visible, setVisible] = useState({
		id: null,
		status: false
	});
	const [linkRecord, setLinkRecord] = useState('');

	const returnPosition = (quesID) => {
		let index = listQuestionID.indexOf(quesID);
		let text = 'Câu ' + (index + 1).toString();
		return text;
	};

	// Chấp nhận xóa câu hỏi
	const handleOk = async (quesItem) => {
		let itemDelete = {
			ID: dataQuestion.ID,
			Enable: false,
			ExerciseOrExerciseGroup: [
				{
					Point: quesItem.Point,
					ExerciseOrExerciseGroupID: quesItem.ExerciseID
				}
			]
		};

		setConfirmLoading(true);
		try {
			let res = await examDetailApi.update(itemDelete);
			if (res.status == 200) {
				onDeleteQuestion(itemDelete);
				showNoti('success', 'Xóa thành công');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setConfirmLoading(false);
		}
	};

	// Handle cancel popup delte
	const handleCancel = (quesID) => {
		setVisible({
			id: quesID,
			status: false
		});
	};

	const deleteQuestionItem = (quesID) => {
		!visible.status
			? setVisible({
					id: quesID,
					status: true
			  })
			: setVisible({
					id: quesID,
					status: false
			  });
	};

	const onGetPoint = (point, questionID) => {
		if (dataMarking.setPackageExerciseStudentsList.some((item, index) => item['ID'] === questionID)) {
			dataMarking.setPackageExerciseStudentsList.every((item) => {
				if (item.ID === questionID) {
					item.Point = point;
					return false;
				}
				return true;
			});
		} else {
			dataMarking.setPackageExerciseStudentsList.push({
				ID: questionID,
				Point: point
			});
		}

		getDataMarking({ ...dataMarking });
	};

	// ----------- ALL ACTION IN DOINGTEST -------------

	const onGetLinkRecord = (linkRecord, quesID) => {
		getListPicked(quesID);
		// Find index
		let indexQuestion = packageResult.SetPackageResultDetailInfoList.findIndex((item) => item.ExamTopicDetailID === dataQuestion.ID);

		let indexQuestionDetail = packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList.findIndex(
			(item) => item.ExerciseID === quesID
		);

		// Add new answer to list
		if (
			packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[indexQuestionDetail]
				.SetPackageExerciseAnswerStudentList.length == 0
		) {
			packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
				indexQuestionDetail
			].SetPackageExerciseAnswerStudentList.push({
				AnswerID: 0,
				AnswerContent: '',
				FileAudio: linkRecord
			});
		} else {
			packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[
				indexQuestionDetail
			].SetPackageExerciseAnswerStudentList[0].FileAudio = linkRecord;
		}

		getPackageResult({ ...packageResult });
	};

	useEffect(() => {
		if (!doneTestData) {
			if (isDoingTest) {
				// Find index
				let indexQuestion = packageResult.SetPackageResultDetailInfoList.findIndex(
					(item) => item.ExamTopicDetailID === dataQuestion.ID
				);
				if (
					packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[0]
						.SetPackageExerciseAnswerStudentList.length > 0
				) {
					setLinkRecord(
						packageResult.SetPackageResultDetailInfoList[indexQuestion].SetPackageExerciseStudentInfoList[0]
							.SetPackageExerciseAnswerStudentList[0].FileAudio
					);
				}
			}
		} else {
			if (dataQuestion.ExerciseTopic[0].ExerciseAnswer.length > 0) {
				setLinkRecord(dataQuestion.ExerciseTopic[0].ExerciseAnswer[0].FileAudio);
			}
		}
	}, [activeID]);

	return (
		<>
			{dataQuestion.ExerciseTopic.map((ques, ind) => (
				<div className={`question-item ${ques.ExerciseID === activeID ? 'active-doing' : ''}`} key={ind}>
					<div className="box-detail">
						<div className="box-title">
							<span className={`title-ques `}>{returnPosition(ques.ExerciseID)}</span>

							<div className="title-text mt-3">{ReactHtmlParser(ques.Content)}</div>
							{doneTestData && linkRecord && (
								<audio controls>
									<source src={linkRecord} type="audio/mpeg" />
								</audio>
							)}
							{!doneTestData && isDoingTest && (
								<AudioRecord
									linkRecord={linkRecord}
									getLinkRecord={(linkRecord) => onGetLinkRecord(linkRecord, ques.ExerciseID)}
								/>
							)}
						</div>
					</div>

					<div className="box-action">
						<div className="box-action-list mb-2">
							{!doneTestData && !isDoingTest && (
								<>
									{!isChangePosition && (
										<>
											<EditPoint quesItem={ques} dataQuestion={dataQuestion} />
											<Popconfirm
												title="Bạn có chắc muốn xóa?"
												onConfirm={() => handleOk(ques)}
												okButtonProps={{ loading: confirmLoading }}
												onCancel={() => handleCancel(ques.ID)}
											>
												<Tooltip title="Xóa câu hỏi" placement="rightTop">
													<button className="btn btn-icon delete" onClick={() => deleteQuestionItem(ques.ID)}>
														<Trash2 />
													</button>
												</Tooltip>
											</Popconfirm>
										</>
									)}
									<ChangePosition
										dataQuestion={dataQuestion}
										arPosition={arPosition}
										questionID={dataQuestion.ID}
										handleChange={handleChange}
										addOldItem={addOldItem}
									/>
								</>
							)}
						</div>
						<div className="point-question">
							<p className="text mb-2">
								{!dataMarking
									? ques.Point
									: dataMarking.setPackageExerciseStudentsList.find((item) => item['ID'] === ques.ID).Point}
							</p>
						</div>
						{!isChangePosition && dataMarking && !isMarked && (
							<div className="point-marking">
								<MarkingExam onGetPoint={(point) => onGetPoint(point, ques.ID)} dataRow={ques} dataMarking={dataMarking} />
							</div>
						)}
					</div>
				</div>
			))}
		</>
	);
};

export default SpeakingList;
