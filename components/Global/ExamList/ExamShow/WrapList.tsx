import React, { useEffect, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Tooltip, Popconfirm } from 'antd';
import { Trash2 } from 'react-feather';
import { examDetailApi } from '~/apiBase';
import { useExamDetail } from '~/pages/question-bank/exam-list/exam-detail/[slug]';
import { useWrap } from '~/context/wrap';
import EditPoint from '../ExamForm/EditPoint';
import ChangePosition from '../ExamForm/ChangePosition';

const WrapList = (props) => {
	const { children, dataQuestion, listQuestionID, arPosition, handleChange, addOldItem } = props;
	const { onDeleteQuestion, isChangePosition } = useExamDetail();
	const { showNoti } = useWrap();
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [visible, setVisible] = useState({
		id: null,
		status: false
	});
	const [listQuesiton, setListQuesiton] = useState([]);

	const returnSpaceQuestion = (data) => {
		let indexStart = listQuestionID.indexOf(data[0]?.ExerciseID);
		let indexEnd = listQuestionID.indexOf(data[data.length - 1]?.ExerciseID);
		let text = '';
		if (indexStart === indexEnd) {
			text = 'Câu ' + (indexStart + 1).toString();
		} else {
			text = 'Câu ' + (indexStart + 1).toString() + ' - ' + (indexEnd + 1).toString();
		}
		return <p className="space-question">{text}</p>;
	};

	// Chấp nhận xóa câu hỏi
	const handleOk = async (quesItem) => {
		let itemDelete = {
			ID: dataQuestion.ID,
			Enable: false,
			ExerciseOrExerciseGroup: []
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

	useEffect(() => {
		dataQuestion?.ExerciseTopic.forEach((element) => {
			listQuesiton.push({
				Point: element.Point,
				ExerciseOrExerciseGroupID: element.ExerciseID
			});
		});
		setListQuesiton([...listQuesiton]);
	}, []);

	return (
		<>
			{dataQuestion?.ExerciseGroupID !== 0 ? (
				<div className="wrap-group-list question-item">
					<div className="box-detail">
						<div className="content">
							<h6 className="content-title">Đọc đoạn văn và trả lời câu hỏi</h6>
							{returnSpaceQuestion(dataQuestion?.ExerciseTopic)}
							{dataQuestion.LinkAudio !== '' && (
								<audio controls>
									<source src={dataQuestion.LinkAudio} type="audio/mpeg" />
								</audio>
							)}
							{ReactHtmlParser(dataQuestion?.Content)}
						</div>
						{dataQuestion.Type == 3 && <h6 className="font-italic mb-3 mt-4">Điền vào ô trống</h6>}
						<>{React.cloneElement(children)}</>
					</div>
					<div className="box-action">
						{!isChangePosition && (
							<>
								{listQuesiton.length > 0 && (
									<EditPoint quesItem={null} listQuestionGroup={listQuesiton} dataQuestion={dataQuestion} />
								)}
								<Popconfirm
									title="Bạn có chắc muốn xóa?"
									onConfirm={() => handleOk(dataQuestion)}
									okButtonProps={{ loading: confirmLoading }}
									onCancel={() => handleCancel(dataQuestion.ID)}
								>
									<Tooltip title="Xóa nhóm câu hỏi" placement="rightTop">
										<button className="btn btn-icon delete" onClick={() => deleteQuestionItem(dataQuestion.ID)}>
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
						{!isChangePosition && (
							<div className="point-question mt-2">
								<p className="text">{dataQuestion.ExerciseTopic[0]?.Point}</p>
							</div>
						)}
					</div>
				</div>
			) : (
				<>{React.cloneElement(children)}</>
			)}
		</>
	);
};

export default WrapList;
