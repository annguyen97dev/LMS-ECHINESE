import React, { useEffect, useState } from 'react';
import { Card, Checkbox, Spin, Modal, Skeleton } from 'antd';
import { CloseOutlined, RightOutlined, LeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { examDetailApi, examTopicApi, doingTestApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import CountDown from '~/components/Elements/CountDown/CountDown';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { useRouter } from 'next/router';
import { useDoingTest } from '~/context/useDoingTest';
import dynamic from 'next/dynamic';
import DecideModal from '~/components/Elements/DecideModal';

const ListQuestion = dynamic(() => import('~/components/Global/DoingTest/ListQuestion'), {
	loading: () => <p>...</p>,
	ssr: false
});

const MainTest = (props) => {
	const { getListQuestionID, getActiveID, activeID, listPicked } = useDoingTest();
	const { examID, infoExam, packageDetailID, dataDoneTest, isDone, listIDFromDoneTest, listGroupIDFromDoneTest, closeMainTest } = props;
	const listTodoApi = {
		pageIndex: 1,
		pageSize: 999,
		ExamTopicID: examID
	};
	const { showNoti } = useWrap();
	const [todoApi, setTodoApi] = useState(listTodoApi);
	const [isLoading, setIsLoading] = useState(false);
	const [dataQuestion, setDataQuestion] = useState<IExamDetail[]>(null);
	const [isGroup, setIsGroup] = useState(false);
	const [addMinutes, setAddMinutes] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [listQuestionID, setListQuestionID] = useState([]); // Lấy tất cả ID đã có
	const [listGroupID, setListGroupID] = useState([]); // Lấy tất cả group ID đã có
	const [spaceQuestion, setSpaceQuestion] = useState({
		start: 0,
		end: null
	});
	const [pageCurrent, setPageCurrent] = useState<number>(1);
	const [listPreview, setListPreview] = useState<Array<number>>([]);
	const router = useRouter();
	const packageID = router.query.packageID as string;
	const { packageResult, getPackageResult } = useDoingTest();
	const { userInformation } = useWrap();
	const [loadingSubmit, setLoadingSubmit] = useState(false);
	const [isLong, setIsLong] = useState(false);
	const [isModalConfirm, setIsModalConfirm] = useState(false);
	const [isModalSuccess, setIsModalSuccess] = useState(false);

	// console.log("Info Exam is: ", infoExam);

	console.log('DataQuestion: ', dataQuestion);
	// console.log("Data Done Test: ", dataDoneTest);
	// console.log("Space Question: ", spaceQuestion);
	// console.log("List question ID: ", listQuestionID);

	// --- GET LIST QUESTION ---
	const getListQuestion = async () => {
		let cloneListQuestionID = [...listQuestionID];
		let cloneListGroupID = [...listGroupID];
		setIsLoading(true);
		try {
			let res = await examDetailApi.getAll(todoApi);
			if (res.status == 200) {
				setDataQuestion(res.data.data);

				// Add questionid to list
				res.data.data.forEach((item, index) => {
					if (item.Enable) {
						item.ExerciseGroupID !== 0 && cloneListGroupID.push(item.ExerciseGroupID);
						item.ExerciseTopic.forEach((ques) => {
							cloneListQuestionID.push(ques.ExerciseID);
						});
					}
				});

				// Calculate space question
				checkSpaceQuestionAtFirst(res.data.data);

				setListGroupID([...cloneListGroupID]);
				setListQuestionID([...cloneListQuestionID]);
			}
			if (res.status == 204) {
				setDataQuestion([]);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const checkSpaceQuestionAtFirst = (data) => {
		if (data[0].ExerciseGroupID !== 0) {
			setIsGroup(true);
			setSpaceQuestion({
				start: 0,
				end: 1
			});
		} else {
			data.every((item, index) => {
				if (index == spaceQuestion.start + 1) {
					if (item.ExerciseGroupID !== 0) {
						setSpaceQuestion({
							...spaceQuestion,
							end: index
						});
						return false;
					} else {
						setIsGroup(false);
						setSpaceQuestion({
							...spaceQuestion,
							end: index + 1
						});
						return false;
					}
				}

				return true;
			});
		}
	};

	// -- CHECK IS SINGLE
	const checkIsSingle = (indexCurrent) => {
		if (indexCurrent !== spaceQuestion.start && indexCurrent !== 0 && indexCurrent !== spaceQuestion.end) {
			if (spaceQuestion.end - spaceQuestion.start == 2) {
				if (indexCurrent > spaceQuestion.start && indexCurrent < spaceQuestion.end) {
					indexCurrent = indexCurrent - 1;
				}
			}
		}

		dataQuestion.every((item, index) => {
			if (index == indexCurrent + 1) {
				if (item.ExerciseGroupID !== 0) {
					// nếu là group

					setSpaceQuestion({
						start: indexCurrent,
						end: index
					});
					return false;
				} else {
					setSpaceQuestion({
						start: indexCurrent,
						end: index + 1
					});
					return false;
				}
			}

			return true;
		});
	};

	// -- CHECK IS GROUP --
	const checkIsGroup = (page: number) => {
		console.log('page: ', page);
		let exerciseID = listQuestionID[page - 1];

		dataQuestion.every((item, index) => {
			// Kiểm tra nếu trong list Exercise Topic có exercise ID thì bắt đầu lấy được vị trí
			if (item.ExerciseTopic.some((object) => object['ExerciseID'] == exerciseID)) {
				// Kiểm tra ở vị trí này là câu hỏi nhóm hay đơn
				if (item.ExerciseGroupID !== 0) {
					// Nếu là nhóm
					setSpaceQuestion({
						start: index,
						end: index + 1
					});
					setIsGroup(true);
				} else {
					setIsGroup(false);
					checkIsSingle(index);
				}
				return false;
			}
			return true;
		});

		// return isGroup;
	};

	// --- ON CHAGNE PAGINATION

	const onChange_pagination = (e, page: number) => {
		setPageCurrent(page);
		e.preventDefault();
		// setActiveID(listQuestionID[page - 1]);
		getActiveID(listQuestionID[page - 1]);

		checkIsGroup(page);
	};

	// - Previous page
	const onChange_PreviousPage = () => {
		listQuestionID.every((item, index) => {
			if (item === activeID) {
				if (index == 0) {
					setPageCurrent(listQuestionID.length);
					checkIsGroup(listQuestionID.length);
					getActiveID(listQuestionID[listQuestionID.length - 1]);
				} else {
					setPageCurrent((pageCurrent) => pageCurrent - 1);
					checkIsGroup(pageCurrent - 1);
					getActiveID(listQuestionID[index - 1]);
				}

				return false;
			}
			return true;
		});
	};

	// - Next Page
	const onChange_NextPage = (e) => {
		console.log('Active ID in next: ', activeID);
		listQuestionID.every((item, index) => {
			if (item === activeID) {
				if (index === listQuestionID.length - 1) {
					setPageCurrent(1);
					checkIsGroup(1);
					getActiveID(listQuestionID[0]);
				} else {
					setPageCurrent((pageCurrent) => pageCurrent + 1);
					checkIsGroup(pageCurrent + 1);
					getActiveID(listQuestionID[index + 1]);
				}

				return false;
			}
			return true;
		});
	};

	console.log('space question: ', spaceQuestion);

	// - Preview
	function onChange_preview(e) {
		const checked = e.target.checked;
		if (!listPreview.includes(activeID)) {
			listPreview.push(activeID);
			setListPreview([...listPreview]);
		} else {
			let newListPreview = listPreview.filter((item) => (item! -= activeID));
			console.log('NEW LIST NUMBER: ', newListPreview);
			setListPreview([...newListPreview]);
		}
	}

	console.log('List Preview: ', listPreview);

	// --- TIME UP ---
	const timeUp = () => {
		// setHandleclick(false);
		// setShowPopup(true);
		alert('Hết giờ làm bài');
	};

	// --- ACTION SHOW MODAL ---
	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const remakeData = () => {
		let cloneData = { ...packageResult };
		cloneData.SetPackageResultDetailInfoList.forEach((item) => {
			if (item.Type == 3 || item.Type == 2 || item.Type == 5) {
				item.SetPackageExerciseStudentInfoList.forEach((e) => {
					if (e.SetPackageExerciseAnswerStudentList.length == 0) {
						e.SetPackageExerciseAnswerStudentList.push({
							AnswerID: 0,
							AnswerContent: '',
							FileAudio: ''
						});
					}
				});
			}
		});

		return cloneData;
	};

	// ===== ON SUBMIT DOING TEST =====
	const onSubmit_DoingTest = async () => {
		setIsModalConfirm(false);
		setLoadingSubmit(true);
		let dataSubmit = remakeData();

		try {
			let res = await doingTestApi.add(dataSubmit);
			if (res.status === 200) {
				setIsModalSuccess(true);
				setTimeout(() => {
					router.push({
						pathname: '/done-test',
						query: { SetPackageResultID: res.data.data.ID }
					});
				}, 1000);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoadingSubmit(false);
		}
	};

	// Return text confirm
	const returnTextConfirm = () => {
		let textConfirm = 'Bạn có chắc muốn nộp bài?';
		if (listPicked.length < listQuestionID.length) {
			let numberOfQuestion = listQuestionID.length - listPicked.length;
			textConfirm = `Bạn còn ${numberOfQuestion} câu chưa làm. Bạn có chắc muốn nộp bài?`;
		}

		return textConfirm;
	};

	// ===== ALL USE EFFECT ====

	useEffect(() => {
		if (!isDone) {
			getListQuestion();
			packageResult.SetPackageDetailID = parseInt(packageDetailID);
			getPackageResult({ ...packageResult });
		} else {
			setDataQuestion(dataDoneTest);
			checkSpaceQuestionAtFirst(dataDoneTest);
			setListQuestionID(listIDFromDoneTest);
			setListGroupID(listGroupIDFromDoneTest);
		}
	}, []);

	useEffect(() => {
		if (listQuestionID?.length > 0) {
			getListQuestionID(listQuestionID);
			getActiveID(listQuestionID[0]);

			// setActiveID(listQuestionID[0]);
		}
	}, [listQuestionID]);

	// Use to check
	useEffect(() => {
		if (spaceQuestion.start !== null && spaceQuestion.end !== null) {
			dataQuestion.slice(spaceQuestion.start, spaceQuestion.end).map((item) => console.log('ITEM ACTIVE: ', item));
		}
	}, [spaceQuestion]);

	useEffect(() => {
		if (userInformation) {
			getPackageResult({
				...packageResult,
				SetPackageDetailID: parseInt(packageID),
				StudentID: userInformation.UserInformationID
			});
		}
	}, [userInformation]);

	useEffect(() => {
		if (!isDone) {
			if (dataQuestion?.length > 0) {
				dataQuestion.forEach((item, index) => {
					let listQuestion = [];

					item.ExerciseTopic.forEach((ques, index) => {
						listQuestion.push({
							ExerciseID: ques.ExerciseID,
							SetPackageExerciseAnswerStudentList: []
						});
					});

					packageResult.SetPackageResultDetailInfoList.push({
						ExamTopicDetailID: item.ID,
						ExerciseGroupID: item.ExerciseGroupID,
						Level: item.Level,
						Type: item.Type,
						SkillID: item.SkillID,
						SetPackageExerciseStudentInfoList: listQuestion
					});

					getPackageResult({
						...packageResult
					});
				});
			}
		}
	}, [dataQuestion]);

	useEffect(() => {
		if (infoExam && dataQuestion) {
			// Run time
			const add_minutes = (function (dt, minutes) {
				return new Date(dt.getTime() + minutes * 60000);
			})(new Date(), infoExam.Time);
			setAddMinutes(add_minutes);
		}
	}, [infoExam, dataQuestion]);

	useEffect(() => {
		let testFooter = document.getElementById('test-footer');
		let heightFooter = testFooter.offsetHeight;
		if (heightFooter > 70) {
			setIsLong(true);
		}
	});

	useEffect(() => {
		if (activeID) {
			let index = listQuestionID.findIndex((id) => id === activeID);
			setPageCurrent(index + 1);
		}
	}, [activeID]);

	return (
		<div className="test-wrapper doing-test">
			{/* Modal báo thành công **/}
			<Modal title="Thông báo" footer={null} className="" visible={isModalSuccess}>
				<div className="modal-submit-success-test">
					<CheckCircleOutlined />
					<p className="text">Nộp bài thành công</p>
				</div>
			</Modal>
			{/* Modal xác nhận submit **/}
			<DecideModal
				isOpen={isModalConfirm}
				isCancel={() => setIsModalConfirm(false)}
				isOk={() => onSubmit_DoingTest()}
				content={returnTextConfirm()}
			/>
			{/* Modal hết giờ làm bài **/}
			<Modal title="Chú ý!" visible={isModalVisible} okText="Đồng ý" cancelText="Đóng" onOk={handleOk} onCancel={handleCancel}>
				<p style={{ fontWeight: 500 }}>Bạn chưa chọn đề thi. Chuyển đến trang bộ đề?</p>
			</Modal>

			{/* Card Main Test **/}
			<Card
				className="test-card"
				title={
					<div className="test-title-info">
						<h6 className="name-type-test">{infoExam?.Name}</h6>
						<p className="info-user">
							<span>{infoExam?.ProgramName}</span>
						</p>
					</div>
				}
				extra={
					infoExam &&
					dataQuestion?.length > 0 &&
					addMinutes && <CountDown addMinutes={addMinutes} onFinish={() => !isModalVisible && timeUp()} />
				}
			>
				<div className="test-body">
					{loadingSubmit && (
						<div className="loading-submit text-center">
							<div className="w-100 text-center">
								<Spin />
								<p className="mt-3" style={{ fontStyle: 'italic', fontWeight: 500 }}>
									Đang tiến hành nộp bài...
								</p>
							</div>
						</div>
					)}
					{isLoading ? (
						<div className="w-100 mt-4 ">
							<div className="w-50">
								<Skeleton />
								<Skeleton />
							</div>
						</div>
					) : dataQuestion?.length > 0 ? (
						dataQuestion.slice(spaceQuestion.start, spaceQuestion.end).map((item, index) => {
							if (isGroup) {
								return (
									<div className="doingtest-group h-100" key={index}>
										<div className="row h-100">
											<div className="col-md-6 col-12 h-100">
												<div className="box-paragraph h-100">{ReactHtmlParser(item.Content)}</div>
											</div>
											<div className="col-md-6 col-12 h-100 pl-0">
												<ListQuestion dataQuestion={item} listQuestionID={listQuestionID} />
											</div>
										</div>
									</div>
								);
							} else {
								return (
									<div className="doingtest-single" key={index}>
										<div className="row">
											<div className="col-12">
												<ListQuestion dataQuestion={item} listQuestionID={listQuestionID} />
											</div>
										</div>
									</div>
								);
							}
						})
					) : (
						<div className="w-100 text-center">
							<p style={{ fontWeight: 500 }}>Đề thi này chưa có câu hỏi</p>
						</div>
					)}
				</div>
				<div className="test-footer" id="test-footer">
					{/* <div className="footer-preview">
              <Checkbox onChange={onChange_preview}>Preview</Checkbox>
            </div> */}
					<div className="footer-pagination row-pagination">
						{/* {listQuestionID?.length > 0 && (
                <Pagination
                  defaultCurrent={1}
                  total={listQuestionID.length}
                  pageSize={1}
                  onChange={onChange_pagination}
                />
              )} */}

						<button className="close-icon">
							<CloseOutlined />
						</button>
						<p className="pagi-name">Danh sách câu hỏi</p>
						<div className="box-preview">
							<Checkbox checked={listPreview.includes(activeID) ? true : false} onChange={onChange_preview}>
								Preview
							</Checkbox>
						</div>
						<button className="pagi-btn previous" onClick={onChange_PreviousPage}>
							<LeftOutlined />
						</button>
						<ul className="list-answer">
							{listQuestionID?.length > 0 &&
								listQuestionID.map((questionID, index) => (
									<li
										className={`item `}
										value={questionID}
										key={questionID}
										style={{ marginBottom: isLong ? '10px' : '' }}
									>
										<a
											href=""
											onClick={(e) => onChange_pagination(e, index + 1)}
											className={`
                      ${questionID == activeID ? 'activeDoing' : ''}
                      ${listPicked.includes(questionID) ? 'checked' : ''} ${listPreview.includes(questionID) ? 'checked_preview' : ''}`}
										>
											{index + 1}
										</a>
									</li>
								))}
						</ul>
						<button className="pagi-btn next" onClick={onChange_NextPage}>
							<RightOutlined />
						</button>
					</div>
					<div className="footer-submit text-right">
						<button
							className="btn btn-primary"
							onClick={() => (!dataDoneTest ? setIsModalConfirm(true) : closeMainTest && closeMainTest())}
						>
							{!dataDoneTest ? 'Nộp bài' : 'Đóng'}
						</button>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default MainTest;
