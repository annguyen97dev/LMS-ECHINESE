import React, { useEffect, useRef, useState, useContext, createContext } from 'react';

import { Popover, Card, Skeleton, Spin } from 'antd';
import TitlePage from '~/components/Elements/TitlePage';
import { Info, Bookmark } from 'react-feather';

import LayoutBase from '~/components/LayoutBase';
import { useRouter } from 'next/router';
import { examDetailApi, examTopicApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import AddQuestionModal from '~/components/Global/ExamDetail/AddQuestionModal';
import ChoiceList from '~/components/Global/ExamList/ExamShow/ChoiceList';
import MultipleList from '~/components/Global/ExamList/ExamShow/MultipleList';
import WrapList from '~/components/Global/ExamList/ExamShow/WrapList';
import MapList from '~/components/Global/ExamList/ExamShow/MapList';
import DragList from '~/components/Global/ExamList/ExamShow/DragList';
import TypingList from '~/components/Global/ExamList/ExamShow/TypingList';
import WrittingList from '~/components/Global/ExamList/ExamShow/WrittingList';
import AddQuestionAuto from '~/components/Global/ExamDetail/AddQuestionAuto';
import Link from 'next/link';
import ChangePosition from '~/components/Global/ExamList/ExamForm/ChangePosition';
import SpeakingList from '~/components/Global/ExamList/ExamShow/Speaking';
import { AlignRightOutlined } from '@ant-design/icons';
import PopupConfirm from '~/components/Elements/PopupConfirm';

const listAlphabet = ['A', 'B', 'C', 'D', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'];

type objectQuestionAddOutside = {
	type: number;
	ExerciseOrExerciseGroupID: number;
};

type objectDataChange = {
	IDChangeOne: number;
	IDChangeTwo: number;
};

export type IProps = {
	onAddQuestion: Function;
	onGetListQuestionID: Function;
	onRemoveQuestionAdd: Function;
	onDeleteQuestion: Function;
	onEditPoint: Function;
	getDataChange: Function;
	isGetQuestion: boolean;
	listQuestionAddOutside: Array<objectQuestionAddOutside>;
	listQuestionID: Array<number>;
	listGroupID: Array<number>;
	dataChange: Array<{
		ID: number;
		Index: number;
	}>;
	isChangePosition: boolean;
};

const ExamDetailContext = createContext<IProps>({
	onAddQuestion: () => {},
	onDeleteQuestion: () => {},
	onEditPoint: () => {},
	onRemoveQuestionAdd: (data) => {},
	onGetListQuestionID: (data) => {},
	getDataChange: (data) => {},
	isGetQuestion: false,
	listQuestionAddOutside: [],
	listQuestionID: [],
	listGroupID: [],
	dataChange: [],
	isChangePosition: false
});

const ExamDetail = () => {
	const { showNoti } = useWrap();
	const [tabActive, setTabActive] = useState(0);
	const router = useRouter();
	const examID = parseInt(router.query.slug as string);
	const [dataExamDetail, setDataExamDetail] = useState([]);
	const [examTopicDetail, setExamTopicDetail] = useState<IExamTopic>(null);
	const [listQuestionID, setListQuestionID] = useState([]); // Lấy tất cả ID đã có
	const [listGroupID, setListGroupID] = useState([]); // Lấy tất cả group ID đã có
	const [listQuestionAddOutside, setListQuestionAddOutside] = useState([]); // Lấy tất cả ID vừa add
	const [isGetQuestion, setIsGetQuestion] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [totalPageIndex, setTotalPageIndex] = useState(0);
	const boxEl = useRef(null);
	const [loadingQuestion, setLoadingQuestion] = useState(false);
	const listTodoApi = {
		pageIndex: 1,
		pageSize: 10,
		ExamTopicID: examID
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);
	const [listExam, setListExam] = useState([]);
	const [loadingExam, setLoadingExam] = useState(false);
	const [loadingDetail, setLoadingDetail] = useState(false);
	const [dataChange, setDataChange] = useState([]);
	const [loadingPosition, setLoadingPosition] = useState(false);
	const [isChangePosition, setIsChangePosition] = useState(false);
	const [isConfirmChange, setIsConfirmChange] = useState(false);
	const [visiblePopover, setVisiblePopover] = useState(false);

	// console.log("List question: ", listQuestionID);
	// console.log("List Group ID: ", listGroupID);

	// ---- GET LIST EXAM ----
	const getListExam = async () => {
		try {
			let res = await examTopicApi.getAll({
				setlectAll: true,
				CurriculumID: examTopicDetail.CurriculumID,
				Type: examTopicDetail.Type
			});
			if (res.status == 200) {
				setListExam(res.data.data);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoadingExam(false);
			setIsLoading(false);
		}
	};

	console.log('DAtaChange: ', dataChange);

	// ---- GET ALL LIST QUESTION ID ----
	const getAllListQuestionID = async () => {
		let cloneListQuestionID = [...listQuestionID];
		let cloneListGroupID = [...listGroupID];

		try {
			let res = await examDetailApi.getAll({ ...todoApi, pageSize: 9999, pageIndex: 1 });
			if (res.status == 200) {
				res.data.data.forEach((item) => {
					if (item.Enable) {
						item.ExerciseGroupID !== 0 && cloneListGroupID.push(item.ExerciseGroupID);
						dataChange.push({
							ID: item.ID,
							Index: null
						});
						item.ExerciseTopic.forEach((ques) => {
							cloneListQuestionID.push(ques.ExerciseID);
						});
					}
				});
				setListGroupID([...cloneListGroupID]);
				setListQuestionID([...cloneListQuestionID]);
				setDataChange([...dataChange]);
			}
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	};

	// ---- GET LIST QUESTION IN EXAM ----
	const getExamDetail = async () => {
		let cloneListQuestionID = [...listQuestionID];
		let cloneListGroupID = [...listGroupID];

		try {
			let res = await examDetailApi.getAll(todoApi);
			if (res.status == 200) {
				setDataExamDetail(res.data.data);

				let cloneData = [...dataExamDetail];
				res.data.data.forEach((item, index) => {
					cloneData.push(item);
				});

				setDataExamDetail([...cloneData]);

				res.data.data.forEach((item) => {
					if (item.Enable) {
						item.ExerciseGroupID !== 0 && cloneListGroupID.push(item.ExerciseGroupID);
						item.ExerciseTopic.forEach((ques) => {
							cloneListQuestionID.push(ques.ExerciseID);
						});
					}
				});
				setListGroupID([...cloneListGroupID]);
				setListQuestionID([...cloneListQuestionID]);
				setListQuestionAddOutside([]);

				// Caculator pageindex
				let totalPage = Math.ceil(res.data.totalRow / 10);
				setTotalPageIndex(totalPage);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoadingQuestion(false);
			setIsLoading(false);
		}
	};

	const getExamTopicDetail = async () => {
		listExam.length == 0 && setLoadingExam(true);
		setLoadingDetail(true);
		try {
			let res = await examTopicApi.getByID(examID);
			if (res.status == 200) {
				setExamTopicDetail(res.data.data);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoadingDetail(false);
		}
	};

	// RETURN QUESTION TYPE
	const returnQuestionType = (item, index) => {
		const type = item.Type;
		switch (type) {
			case 1:
				return (
					<div key={index}>
						<WrapList dataQuestion={item} listQuestionID={listQuestionID}>
							<ChoiceList
								isDoingTest={false}
								listQuestionID={listQuestionID}
								dataQuestion={item}
								listAlphabet={listAlphabet}
							/>
						</WrapList>
					</div>
				);
				break;
			case 2:
				return (
					<div key={index}>
						<WrapList dataQuestion={item} listQuestionID={listQuestionID}>
							<DragList isDoingTest={false} listQuestionID={listQuestionID} dataQuestion={item} listAlphabet={listAlphabet} />
						</WrapList>
					</div>
				);
				break;
			case 3:
				return (
					<div key={index}>
						<WrapList dataQuestion={item} listQuestionID={listQuestionID}>
							<TypingList
								isDoingTest={false}
								listQuestionID={listQuestionID}
								dataQuestion={item}
								listAlphabet={listAlphabet}
							/>
						</WrapList>
					</div>
				);
				break;
			case 4:
				return (
					<div key={index}>
						<WrapList dataQuestion={item} listQuestionID={listQuestionID}>
							<MultipleList
								isDoingTest={false}
								listQuestionID={listQuestionID}
								dataQuestion={item}
								listAlphabet={listAlphabet}
							/>
						</WrapList>
					</div>
				);
				break;
			case 5:
				return (
					<div key={index}>
						<WrapList dataQuestion={item} listQuestionID={listQuestionID}>
							<MapList isDoingTest={false} listQuestionID={listQuestionID} dataQuestion={item} listAlphabet={listAlphabet} />
						</WrapList>
					</div>
				);
				break;
			case 6:
				return (
					<div key={index}>
						<WrapList dataQuestion={item} listQuestionID={listQuestionID}>
							<WrittingList
								isDoingTest={false}
								listQuestionID={listQuestionID}
								dataQuestion={item}
								listAlphabet={listAlphabet}
							/>
						</WrapList>
					</div>
				);
				break;
			case 7:
				return (
					<div key={index}>
						<WrapList dataQuestion={item} listQuestionID={listQuestionID}>
							<SpeakingList
								isDoingTest={false}
								listQuestionID={listQuestionID}
								dataQuestion={item}
								listAlphabet={listAlphabet}
							/>
						</WrapList>
					</div>
				);
				break;
			default:
				return;
				break;
		}
	};

	// ON ADD QUESTION TO EXAM
	const onAddQuestion = () => {
		setIsGetQuestion(true);
	};

	// ON FETCH DATA
	const onFetchData = () => {
		setIsLoading(true);
		setListGroupID([]);
		setListQuestionID([]);
		setDataExamDetail([]);
		setTodoApi(listTodoApi);
		setIsGetQuestion(false);
	};

	// ON DELETE QUESTION
	const onDeleteQuestion = (dataDelete) => {
		let cloneListQuestionID = [];
		let cloneListGroupID = [];
		let cloneDataExam = [...dataExamDetail];

		let indexQues = cloneDataExam.findIndex((item) => item.ID == dataDelete.ID);
		cloneDataExam.splice(indexQues, 1);

		cloneDataExam.forEach((item) => {
			item.ExerciseGroupID !== 0 && cloneListGroupID.push(item.ExerciseGroupID);
			item.ExerciseTopic.forEach((ques) => {
				cloneListQuestionID.push(ques.ExerciseID);
			});
		});
		setListGroupID([...cloneListGroupID]);
		setListQuestionID([...cloneListQuestionID]);

		setDataExamDetail([...cloneDataExam]);
	};

	// ON EDIT POINT
	const onEditPoint = (dataEdit, detailID) => {
		dataExamDetail.every((item, index) => {
			if (detailID == item.ID) {
				item.ExerciseTopic[0].Point = dataEdit[0].Point;
				return false;
			}
			return true;
		});

		setDataExamDetail([...dataExamDetail]);
	};

	// ON REMOVE QUESTION ADD IN LIST
	const onRemoveQuestionAdd = (objectQuestion: any) => {
		let index = listQuestionAddOutside.findIndex((item) => item.ExerciseOrExerciseGroupID == objectQuestion.ExerciseOrExerciseGroupID);
		listQuestionAddOutside.splice(index, 1);
		setListQuestionAddOutside([...listQuestionAddOutside]);
	};

	// ON GET LIST QUESTION ID
	const onGetListQuestionID = (objectQuestion: any) => {
		listQuestionAddOutside.push(objectQuestion);

		setListQuestionAddOutside([...listQuestionAddOutside]);
	};

	// SCROLL TO TOP
	const scrollToTop = () => {
		boxEl.current.scrollTo(0, 0);
	};
	// ON SCROLL
	const onScroll = () => {
		const scrollHeight = boxEl.current.scrollHeight;
		const offsetHeight = boxEl.current.offsetHeight;
		const scrollTop = boxEl.current.scrollTop;

		if (scrollTop > scrollHeight - offsetHeight - 50) {
			if (todoApi.pageIndex < totalPageIndex) {
				dataExamDetail?.length !== 0 && setLoadingQuestion(true);

				if (scrollTop > 0 && loadingQuestion == false) {
					setTodoApi({
						...todoApi,
						pageIndex: todoApi.pageIndex + 1
					});
				}
			}
		}
	};

	// ACTION CHANGE POSITION
	const actionChangePosition = async () => {
		setLoadingPosition(true);
		// let cloneListQuestionID = [];
		// let cloneListGroupID = [];
		try {
			let res = await examDetailApi.changePosition(dataChange);
			if (res.status === 200) {
				showNoti('success', 'Đổi vị trí thành công');
				onFetchData();
				setIsConfirmChange(false);
				setIsChangePosition(false);

				// changePositionInArray();

				// res.data.data.forEach((item) => {
				// 	if (item.Enable) {
				// 		item.ExerciseGroupID !== 0 && cloneListGroupID.push(item.ExerciseGroupID);
				// 		item.ExerciseTopic.forEach((ques) => {
				// 			cloneListQuestionID.push(ques.ExerciseID);
				// 		});
				// 	}
				// });
				// setListGroupID([...cloneListGroupID]);
				// setListQuestionID([...cloneListQuestionID]);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoadingPosition(false);
		}
	};

	// const changePositionInArray = () => {
	// 	let dataFrom = null;
	// 	let dataTo = null;

	// 	let indexFrom = null;
	// 	let indexTo = null;

	// 	dataExamDetail.every((item, index) => {
	// 		if (item.ID === dataChange.IDChangeOne) {
	// 			dataFrom = item;
	// 			indexFrom = index;
	// 		}
	// 		if (item.ID === dataChange.IDChangeTwo) {
	// 			dataTo = item;
	// 			indexTo = index;
	// 		}
	// 		if (dataFrom && dataTo) {
	// 			return false;
	// 		} else {
	// 			return true;
	// 		}
	// 	});

	// 	dataExamDetail[indexFrom] = dataTo;
	// 	dataExamDetail[indexTo] = dataFrom;

	// 	setDataExamDetail([...dataExamDetail]);
	// };

	// START CHANGE POSITION
	const startChangePosition = () => {
		!isChangePosition && setIsChangePosition(true);
		isChangePosition && setIsConfirmChange(true);
	};

	// GET DATA CHANGE
	const getDataChange = (data: any) => {
		setDataChange([...data]);
	};

	useEffect(() => {
		setIsLoading(true);
		getExamTopicDetail();
	}, [examID]);

	useEffect(() => {
		if (examTopicDetail) {
			if (listExam.length == 0) {
				getListExam();
			}
		}
	}, [examTopicDetail]);

	useEffect(() => {
		onFetchData();
		scrollToTop();
	}, [examID]);

	useEffect(() => {
		getExamDetail();
	}, [todoApi]);

	// useEffect(() => {
	// 	if (dataChange.IDChangeOne && dataChange.IDChangeTwo) {
	// 		actionChangePosition();
	// 	}
	// }, [dataChange]);

	useEffect(() => {
		getAllListQuestionID();
		setIsLoading(true);

		window.onclick = function (ev) {
			console.log('TEST: ', ev.target);
			if (ev.target.nodeName !== 'BUTTON') {
				setVisiblePopover(false);
			}
		};
	}, []);

	const contentButton = (
		<div onClick={() => setVisiblePopover(false)}>
			<button className="btn btn-primary d-block w-100 text-center mb-2" onClick={startChangePosition}>
				<div className="d-flex align-items-center">
					<AlignRightOutlined className="mr-2" style={{ width: '18px' }} />
					{isChangePosition ? 'Lưu' : 'Sắp xếp'}
				</div>
			</button>
			<AddQuestionAuto dataExam={examTopicDetail} onFetchData={onFetchData} examTopicID={examID} />
			<AddQuestionModal dataExam={examTopicDetail} onFetchData={onFetchData} />
		</div>
	);

	const content = (
		<div className="question-bank-info">
			<ul className="list">
				<div className="d-flex">
					<li className="list-item">
						<span className="list-title">Giáo trình:</span>
						<span className="list-text">{examTopicDetail?.CurriculumName}</span>
					</li>
					<li className="list-item">
						<span className="list-title">Tổng số câu</span>
						<span className="list-text">{listQuestionID?.length}</span>
					</li>
				</div>
				<div className="d-flex">
					<li className="list-item">
						<span className="list-title">Dạng đề thi:</span>
						<span className="list-text">{examTopicDetail?.TypeName}</span>
					</li>

					<li className="list-item mb-0">
						<span className="list-title">Thời gian:</span>
						<span className="list-text">{examTopicDetail?.Time} phút</span>
					</li>
				</div>
			</ul>
		</div>
	);

	return (
		<ExamDetailContext.Provider
			value={{
				onAddQuestion,
				onEditPoint,
				isGetQuestion: isGetQuestion,
				onGetListQuestionID,
				listQuestionAddOutside,
				listQuestionID: listQuestionID,
				listGroupID: listGroupID,
				onRemoveQuestionAdd,
				onDeleteQuestion,
				dataChange: dataChange,
				getDataChange,
				isChangePosition: isChangePosition
			}}
		>
			<div className="question-create exam">
				<PopupConfirm
					okText="Đồng ý"
					cancelText="Hủy"
					isOpen={isConfirmChange}
					onOk={actionChangePosition}
					onCancel={() => setIsConfirmChange(false)}
				>
					<p style={{ fontWeight: 500 }}>Thay đổi vị trí câu hỏi ngay bây giờ?</p>
				</PopupConfirm>
				<TitlePage title="Tạo đề thi" />
				<div className="row">
					<div className="col-md-9 col-12">
						<Card
							className="card-detail-exam card-detail-question"
							title={
								<div className="title-question-bank">
									<h3 className="title-big">
										<Bookmark /> {examTopicDetail?.Name}
									</h3>
									<Popover content={content} trigger="hover" placement="bottomLeft">
										{loadingDetail ? (
											<div className="row">
												<div className="col-md-3">
													<Skeleton paragraph={false} loading={true} title={true} active />
												</div>
												<div className="col-md-3">
													<Skeleton paragraph={false} loading={true} title={true} active />
												</div>
												<div className="col-md-3">
													<Skeleton paragraph={false} loading={true} title={true} active />
												</div>
											</div>
										) : (
											<ul className="list-detail-question">
												<li>
													<span className="icon-detail-question">
														<Info />
													</span>
												</li>
												<li>
													<span className="title">Giáo trình:</span>
													<span className="text text-curriculum">{examTopicDetail?.CurriculumName}</span>
												</li>
												{/* <li>
                          <span className="title">Thời gian:</span>
                          <span className="text">
                            {examTopicDetail?.Time} phút
                          </span>
                        </li> */}
												{/* <li>
													<span className="title">Tổng số câu:</span>
													<span className="text">{listQuestionID.length}</span>
												</li> */}
											</ul>
										)}
									</Popover>
								</div>
							}
							extra={
								<>
									{/* <button className="btn btn-primary" onClick={startChangePosition}>
										<div className="d-flex align-items-center">
											<AlignRightOutlined className="mr-2" style={{ width: '18px' }} />
											{isChangePosition ? 'Lưu' : 'Sắp xếp'}
										</div>
									</button>
									<AddQuestionAuto dataExam={examTopicDetail} onFetchData={onFetchData} examTopicID={examID} />
									<AddQuestionModal dataExam={examTopicDetail} onFetchData={onFetchData} /> */}
									<Popover
										visible={visiblePopover}
										content={contentButton}
										placement="bottomRight"
										title={null}
										trigger="click"
									>
										<button className="btn btn-light btn-function" onClick={() => setVisiblePopover(!visiblePopover)}>
											Chức năng
										</button>
									</Popover>
								</>
							}
						>
							{loadingPosition && (
								<div className="loading-all">
									<Spin />
								</div>
							)}
							<div className="question-list" ref={boxEl} onScroll={onScroll}>
								{isLoading ? (
									<div className="text-center mt-3">
										<Spin />
									</div>
								) : dataExamDetail.length == 0 ? (
									<p className="text-center">
										<b>Đề thi hiện chưa có câu hỏi nào</b>
									</p>
								) : (
									dataExamDetail?.map((item, index) => item.Enable && returnQuestionType(item, index))
								)}
								{loadingQuestion && (
									<div>
										<Skeleton />
									</div>
								)}
							</div>
						</Card>
					</div>
					<div className="col-md-3 col-12 fixed-card">
						<Card
							className="card-exam-bank"
							title="Danh sách đề cùng giáo trình"
							// extra={<AddQuestionForm />}
						>
							<ul className="list-exam-bank">
								{loadingExam ? (
									<div className="text-center mt-4">
										<Spin />
										<p className="d-block">Đang tải danh sách...</p>
									</div>
								) : listExam?.length > 0 ? (
									listExam.map((item, index) => (
										<li key={index} className={item.ID == examID ? 'active' : ''}>
											<Link
												href={{
													pathname: '/question-bank/exam-list/exam-detail/[slug]',
													query: { slug: item.ID }
												}}
											>
												<a className="">
													<span className="number">{index + 1}/</span>
													<span className="text">{item.Name}</span>
												</a>
											</Link>
										</li>
									))
								) : (
									<p className="font-italic">Không có dữ liệu</p>
								)}
							</ul>
						</Card>
					</div>
				</div>
			</div>
		</ExamDetailContext.Provider>
	);
};
ExamDetail.layout = LayoutBase;
export default ExamDetail;

export const useExamDetail = () => useContext(ExamDetailContext);
