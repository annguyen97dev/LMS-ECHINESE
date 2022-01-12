import { Card, Skeleton, Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Bookmark } from 'react-feather';
import { useWrap } from '~/context/wrap';
import TitlePage from '~/components/Elements/TitlePage';
import router from 'next/router';
import ReactHtmlParser from 'react-html-parser';
import ListQuestion from '~/components/Global/DoingTest/ListQuestion';
import { useDoneTest } from '~/context/useDoneTest';
import { ProfileOutlined } from '@ant-design/icons';
import MainTest from '~/components/Global/DoingTest/MainTest';
import { homeworkResultApi } from '~/apiBase/course-detail/home-work-result';
import { homeworkResultDetailApi } from '~/apiBase/course-detail/home-work-result-details';

const HomeworkStudentResult = () => {
	// ---- Get Router ----

	const { ExamAppointmentResultID: ExamAppointmentResultID, examID: examID, score: score } = router.query;
	const HomeworkResultID = router.query.slug as string;
	const {} = useDoneTest();
	const { getDoneTestData, doneTestData, dataMarking } = useDoneTest();
	const [detailResult, setDetailResult] = useState([]);
	const [visibleNofi, setVisibleNofi] = useState(false);
	const boxEl = useRef(null);

	// console.log('score: ', score);

	const paramsDefault = {
		pageSize: 999,
		pageIndex: 1,
		ExamAppointmentResultID: parseInt(ExamAppointmentResultID as string)
	};
	const [params, setParams] = useState(paramsDefault);
	const [loading, setLoading] = useState(false);
	const [listQuestionID, setListQuestionID] = useState([]); // Lấy tất cả ID đã có
	const [listGroupID, setListGroupID] = useState([]); // Lấy tất cả group ID đã có

	const [showMainTest, setShowMainTest] = useState(false);
	const { showNoti, userInformation } = useWrap();
	const [isMarked, setIsMarked] = useState(false);
	const [showNote, setShowNote] = useState(false);
	const [infoTest, setInfoTest] = useState(null);
	const [loadingInfoTest, setLoadingInfoTest] = useState(false);

	const getInfoTest = async () => {
		setLoadingInfoTest(true);
		try {
			let res = await homeworkResultApi.getAll({
				HomeworkID: HomeworkResultID,
				UserInformationID: userInformation.UserInformationID
			});
			if (res.status === 200) {
				let dataInfo: any = res.data.data[0];
				let totalQuestion = dataInfo.ListeningNumber + dataInfo.ReadingNumber;
				setInfoTest({
					...res.data.data[0],
					TotalQuestion: totalQuestion
				});

				getDataSetPackageResult(res.data.data[0].ID);
			}
		} catch (error) {
			console.log('error', error.message);
		} finally {
			setLoadingInfoTest(false);
		}
	};

	const getDataSetPackageResult = async (ID) => {
		let cloneListQuestionID = [...listQuestionID];
		let cloneListGroupID = [...listGroupID];
		setLoading(true);

		try {
			let res = await homeworkResultDetailApi.getAll({ ...params, HomeworkResultID: ID });

			//@ts-ignore
			if (res.status == 200) {
				console.log('res.status == 200');

				convertDataDoneTest(res.data.data);

				// Add questionid to list
				res.data.data.forEach((item, index) => {
					if (item.Enable) {
						item.ExerciseGroupID !== 0 && cloneListGroupID.push(item.ExerciseGroupID);
						item.HomeworkExerciseStudent.forEach((ques) => {
							cloneListQuestionID.push(ques.ExerciseID);
						});
					}
				});

				// ----- //

				console.log('cloneListQuestionID: ', cloneListQuestionID);
				console.log('cloneListGroupID: ', cloneListGroupID);

				getDoneTestData(res.data.data);
				setListGroupID([...cloneListGroupID]);
				setListQuestionID([...cloneListQuestionID]);
			}

			if (res.status == 204) {
				showNoti('danger', 'Không tìm thấy dữ liệu!');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoading(false);
		}
	};

	const convertDataDoneTest = (data) => {
		let cloneData = [...data];

		cloneData.forEach((item) => {
			item.ExerciseTopic = [...item.HomeworkExerciseStudent];
			item.ExerciseTopic.forEach((ques) => {
				ques.ExerciseAnswer = [...ques.HomeworkExerciseAnswerStudent];
			});
		});

		setDetailResult([...cloneData]);
	};

	const returnSpaceQuestion = (data) => {
		let indexStart = listQuestionID.indexOf(data[0].ExerciseID);
		let indexEnd = listQuestionID.indexOf(data[data.length - 1].ExerciseID);

		let text = '';
		if (indexStart === indexEnd) {
			text = 'Câu ' + (indexStart + 1).toString();
		} else {
			text = 'Câu ' + (indexStart + 1).toString() + ' - ' + (indexEnd + 1).toString();
		}

		return <p className="space-question">{text}</p>;
	};

	useEffect(() => {
		if (dataMarking && !showNote) {
			if (dataMarking.setPackageExerciseStudentsList.length > 0) {
				dataMarking.setPackageExerciseStudentsList.every((item) => {
					if (item.Point) {
						setVisibleNofi(true);
						setShowNote(true);
						setTimeout(() => {
							setVisibleNofi(false);
						}, 5000);
						return false;
					}
					return true;
				});
			}
		}
	}, [dataMarking]);

	useEffect(() => {
		if (userInformation) {
			getInfoTest();
		}
	}, [userInformation]);

	return (
		<>
			{showMainTest ? (
				<MainTest
					dataDoneTest={detailResult}
					isDone={true}
					listIDFromDoneTest={listQuestionID}
					listGroupIDFromDoneTest={listGroupID}
					closeMainTest={() => setShowMainTest(false)}
				/>
			) : (
				<div className="test-wrapper done-test">
					<TitlePage title="Kết quả bộ đề chi tiết" />
					<div className="row">
						<div className="col-md-10 col-12">
							<Card
								className=""
								title={
									<div className="title-question-bank">
										<h3 className="title-big">
											<Bookmark />
											Danh sách kết quả
										</h3>
									</div>
								}
								extra={
									<>
										{/* <Link
											href={{
												pathname: '/doing-test',
												query: {
													examID: examID,
													packageDetailID: packageDetailID
												}
											}}
										>
											<a className="btn btn-warning">
												<span className="d-flex align-items-center">
													<RedoOutlined className="mr-2" />
													Làm lại đề
												</span>
											</a>
										</Link> */}

										<button className="btn btn-secondary ml-2" onClick={() => setShowMainTest(true)}>
											<span className="d-flex align-items-center">
												<ProfileOutlined className="mr-2" />
												Xem chi tiết
											</span>
										</button>
									</>
								}
							>
								<div className="test-body done-test-card " ref={boxEl}>
									<div className="wrap-box-info mb-2">
										<div className="box-info">
											{(infoTest?.isDone || score) && (
												<div className="box-info__item box-info__score">
													Số điểm
													<span className="number">
														{loadingInfoTest ? (
															<Skeleton paragraph={false} loading={true} title={true} active />
														) : (
															infoTest?.PointTotal
														)}
													</span>
												</div>
											)}
											<div className="box-info__item box-info__correct">
												Số câu đúng
												<span className="number">
													{loadingInfoTest ? (
														<Skeleton paragraph={false} loading={true} title={true} active />
													) : infoTest ? (
														infoTest?.ReadingCorrect +
														infoTest?.ListeningCorrect +
														'/' +
														infoTest?.TotalQuestion
													) : (
														''
													)}
												</span>
											</div>
										</div>
									</div>

									{loading ? (
										<div className="text-center mt-5">
											<Spin />
										</div>
									) : detailResult?.length == 0 ? (
										<p className="text-center font-weight-bold mt-2">Không có dữ liệu</p>
									) : (
										doneTestData && (
											<>
												{detailResult.map((item, index) => {
													if (item.ExerciseGroupID !== 0) {
														return (
															<div className="wrap-group-list">
																<div className="box-detail">
																	<div className="row">
																		<div className="col-md-11">
																			{returnSpaceQuestion(item.ExerciseTopic)}
																			{item.Content && item.Content !== '' && (
																				<div className="box-content" key={index}>
																					{item.Content && ReactHtmlParser(item.Content)}
																				</div>
																			)}
																		</div>
																		<div className="col-md-1">
																			<div className="point-question text-right mt-4">
																				{item.ExerciseTopic[0].Point}
																			</div>
																		</div>
																	</div>

																	<div>
																		<ListQuestion
																			showScore={score}
																			isMarked={isMarked}
																			dataQuestion={item}
																			listQuestionID={listQuestionID}
																		/>
																	</div>
																</div>
															</div>
														);
													} else {
														return (
															<div key={index}>
																<ListQuestion
																	isMarked={isMarked}
																	dataQuestion={item}
																	listQuestionID={listQuestionID}
																/>
															</div>
														);
													}
												})}
											</>
										)
									)}
								</div>
							</Card>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default HomeworkStudentResult;
