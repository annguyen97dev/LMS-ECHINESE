import React, { useEffect, useState } from 'react';
import { Spin, Popconfirm, Tooltip, Checkbox } from 'antd';
import { Trash2 } from 'react-feather';
import CreateQuestionForm from '~/components/Global/QuestionBank/CreateQuestionForm';

import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { exerciseApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import { useExamDetail } from '~/pages/question-bank/exam-list/exam-detail/[slug]';
import { CheckOutlined } from '@ant-design/icons';

const QuestionWritting = (props: any) => {
	const { isGetQuestion, onGetListQuestionID, listQuestionID, onRemoveQuestionAdd, listQuestionAddOutside } = useExamDetail();
	const { listQuestion, loadingQuestion, onFetchData, onRemoveData, isGroup, onEditData, listAlphabet, dataExam } = props;
	const [value, setValue] = React.useState(1);
	const [dataListQuestion, setDataListQuestion] = useState(null);
	const { showNoti, userInformation } = useWrap();
	const [visible, setVisible] = useState({
		id: null,
		status: false
	});
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [loadingInGroup, setLoadingInGroup] = useState(false);
	const [loadingAudio, setLoadingAudio] = useState(null);
	const [activeID, setActiveID] = useState(null);
	const [lengthData, setLengthData] = useState(0);
	const [listQuestionAdd, setListQuestionAdd] = useState([]);

	const onChange = (e) => {
		e.preventDefault();
		// setValue(e.target.value);
	};

	// ON EDIT
	const onEdit = (dataEdit) => {
		if (!isGroup.status) {
			onEditData(dataEdit);
		} else {
			let index = dataListQuestion.findIndex((item) => item.ID == dataEdit.ID);
			dataListQuestion.splice(index, 1, dataEdit);

			setDataListQuestion([...dataListQuestion]);
		}
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

	// Chấp nhận xóa câu hỏi
	const handleOk = async (quesItem) => {
		setConfirmLoading(true);
		quesItem.Enable = false;
		try {
			let res = await exerciseApi.update(quesItem);
			if (res.status == 200) {
				setVisible({
					...visible,
					status: false
				});
				onRemoveData(quesItem);
				showNoti('success', 'Xóa thành công');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setConfirmLoading(false);
		}
	};

	const handleCancel = (quesID) => {
		setVisible({
			id: quesID,
			status: false
		});
	};

	const getQuestionInGroup = async () => {
		setLoadingInGroup(true);
		try {
			let res = await exerciseApi.getAll({
				pageIndex: 1,
				pageSize: 9999,
				ExerciseGroupID: isGroup.id
			});
			res.status == 200 && setDataListQuestion(res.data.data);
			res.status == 204 && setDataListQuestion([]);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoadingInGroup(false);
		}
	};

	const onHover = (ID: number) => {
		setActiveID(ID);
	};

	const returnAudio = (item) => {
		const audioHTML = (item) => {
			return (
				<audio controls>
					<source src={item.LinkAudio} type="audio/mpeg" />
				</audio>
			);
		};

		return (
			<>
				{!activeID ? (
					item.LinkAudio !== '' && audioHTML(item)
				) : item.ID == activeID ? (
					!loadingAudio ? (
						item.LinkAudio !== '' && audioHTML(item)
					) : (
						<></>
					)
				) : (
					item.LinkAudio !== '' && audioHTML(item)
				)}
			</>
		);
	};

	useEffect(() => {
		// Check active item when add new data
		if (dataListQuestion?.length > 0) {
			if (listQuestion.length > lengthData) {
				setActiveID(listQuestion[0].ID);
			}
		}
		setLengthData(listQuestion.length);
		// Loading audio for change html audio (because the link not change when update state)
		setLoadingAudio(true);
		setTimeout(() => {
			setLoadingAudio(false);
		}, 100);

		setDataListQuestion(listQuestion);
	}, [listQuestion]);

	// On change - add question
	const onChange_AddQuestion = (checked, quesID) => {
		let objectQuestion = {
			type: 1,
			ExerciseOrExerciseGroupID: quesID
		};

		// Call function to get ID of question
		if (checked) {
			onGetListQuestionID(objectQuestion);
		} else {
			onRemoveQuestionAdd(objectQuestion);
		}

		// Check isChecked in checkbox
		// dataListQuestion.every((item) => {
		//   if (item.ID == quesID) {
		//     item.isChecked = checked;
		//     return false;
		//   }
		//   return true;
		// });

		// setDataListQuestion([...dataListQuestion]);
	};

	useEffect(() => {
		if (dataListQuestion?.length > 0) {
			if (listQuestionAddOutside?.length > 0) {
				dataListQuestion?.forEach((item) => {
					if (listQuestionAddOutside.some((object) => object['ExerciseOrExerciseGroupID'] == item.ID)) {
						item.isChecked = true;
					} else {
						item.isChecked = false;
					}
				});
			} else {
				dataListQuestion?.forEach((item) => {
					item.isChecked = false;
				});
			}
			setDataListQuestion([...dataListQuestion]);
		}
	}, [listQuestionAddOutside]);

	// CHECK AND REMOVE ID IS SELECTED
	// useEffect(() => {
	//   setListQuestionAdd([]);
	// }, [listQuestionID]);

	return (
		<>
			{dataListQuestion?.length == 0 ? (
				<p className="text-center">
					<b>Danh sách còn trống</b>
				</p>
			) : (
				dataListQuestion?.map((item, index) => (
					<div
						className={`question-item ${item.ID == activeID ? 'active' : ''}`}
						key={index}
						onMouseEnter={() => onHover(item.ID)}
					>
						<div className="box-detail">
							<div className="box-title">
								<span className="title-ques">Câu hỏi {index + 1}</span>
								{item.LinkAudio && returnAudio(item)}
								<div className="title-text">{ReactHtmlParser(item.Content)}</div>
							</div>
						</div>
						<div className="box-action">
							<CreateQuestionForm
								questionData={item}
								onFetchData={onFetchData}
								onEditData={(dataEdit) => onEdit(dataEdit)}
								isGroup={{ status: false, id: null }}
								getActiveID={(ID: any) => setActiveID(ID)}
							/>
							{userInformation && userInformation.RoleID !== 2 && (
								<Popconfirm
									title="Bạn có chắc muốn xóa?"
									// visible={item.ID == visible.id && visible.status}
									onConfirm={() => handleOk(item)}
									okButtonProps={{ loading: confirmLoading }}
									onCancel={() => handleCancel(item.ID)}
								>
									<Tooltip title="Xóa câu hỏi" placement="rightTop">
										<button className="btn btn-icon delete" onClick={() => deleteQuestionItem(item.ID)}>
											<Trash2 />
										</button>
									</Tooltip>
								</Popconfirm>
							)}
							{dataExam &&
								(listQuestionID.includes(item.ID) ? (
									<Tooltip title="Đã có trong đề thi">
										<button className="btn btn-icon edit">
											<CheckOutlined />
										</button>
									</Tooltip>
								) : (
									<Checkbox
										className="checkbox-addquestion"
										checked={item.isChecked}
										onChange={(e) => onChange_AddQuestion(e.target.checked, item.ID)}
									/>
								))}
						</div>
					</div>
				))
			)}

			{/* {isGroup?.status && loadingInGroup ? (
        <div>
          <Skeleton />
        </div>
      ) : (
        dataListQuestion?.length == 0 && (
          <p style={{ color: "#dd4667" }}>
            <i>Nhóm này chưa có câu hỏi</i>
          </p>
        )
      )}
      {loadingQuestion && (
        <div>
          <Skeleton />
        </div>
      )} */}
		</>
	);
};

export default QuestionWritting;
