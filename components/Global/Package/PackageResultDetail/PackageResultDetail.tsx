import { Card, Radio, Spin, Tooltip } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Bookmark } from 'react-feather';
import { packageResultDetailApi } from '~/apiBase/package/package-result-detail';
import LayoutBase from '~/components/LayoutBase';
import { useWrap } from '~/context/wrap';
import TitlePage from '~/components/Elements/TitlePage';
import router from 'next/router';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import ListQuestion from '~/components/Global/DoingTest/ListQuestion';
import { useDoneTest } from '~/context/useDoneTest';
import { ProfileOutlined } from '@ant-design/icons';
import MainTest from '../../DoingTest/MainTest';

const PackageResultDetail = () => {
	const [detailResult, setDetailResult] = useState([]);
	const boxEl = useRef(null);

	console.log('Data Result: ', detailResult);

	const paramsDefault = {
		pageSize: 999,
		pageIndex: 1,
		SetPackageResultID: parseInt(router.query.slug as string)
	};
	const [params, setParams] = useState(paramsDefault);

	const [totalPageIndex, setTotalPageIndex] = useState(0);
	const [loading, setLoading] = useState(false);
	const [listQuestionID, setListQuestionID] = useState([]); // Lấy tất cả ID đã có
	const [listGroupID, setListGroupID] = useState([]); // Lấy tất cả group ID đã có
	const { getDoneTestData, doneTestData } = useDoneTest();
	const [showMainTest, setShowMainTest] = useState(false);

	const { showNoti } = useWrap();

	const onScroll = () => {
		// const scrollHeight = boxEl.current.scrollHeight;
		// const offsetHeight = boxEl.current.offsetHeight;
		// const scrollTop = boxEl.current.scrollTop;
		// if (scrollTop > scrollHeight - offsetHeight - 40) {
		// 	if (paramsDefault.pageIndex < totalPageIndex) {
		// 		setLoading(true);
		// 		if (scrollTop > 0 && loading == false) {
		// 			setParams({
		// 				...params,
		// 				pageIndex: params.pageIndex + 1
		// 			});
		// 		}
		// 	}
		// }
	};

	const getDataSetPackageResult = async () => {
		let cloneListQuestionID = [...listQuestionID];
		let cloneListGroupID = [...listGroupID];
		setLoading(true);

		try {
			let res = await packageResultDetailApi.getAll(params);
			//@ts-ignore
			if (res.status == 200) {
				convertDataDoneTest(res.data.data);

				// Add questionid to list
				res.data.data.forEach((item, index) => {
					if (item.Enable) {
						item.ExerciseGroupID !== 0 && cloneListGroupID.push(item.ExerciseGroupID);
						item.SetPackageExerciseStudent.forEach((ques) => {
							cloneListQuestionID.push(ques.ExerciseID);
						});
					}
				});

				// ----- //

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
			item.ExerciseTopic = [...item.SetPackageExerciseStudent];
			item.ExerciseTopic.forEach((ques) => {
				ques.ExerciseAnswer = [...ques.SetPackageExerciseAnswerStudent];
			});
		});

		setDetailResult([...cloneData]);
	};

	const returnSpaceQuestion = (data) => {
		let indexStart = listQuestionID.indexOf(data[0].ExerciseID);
		let indexEnd = listQuestionID.indexOf(data[data.length - 1].ExerciseID);

		let text = 'Câu ' + (indexStart + 1).toString() + ' - ' + (indexEnd + 1).toString();
		return <p className="space-question">{text}</p>;
	};

	useEffect(() => {
		getDataSetPackageResult();
	}, []);

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
								className="table-medium"
								title={
									<div className="title-question-bank">
										<h3 className="title-big">
											<Bookmark />
											Danh sách câu hỏi
										</h3>
									</div>
								}
								extra={
									<Tooltip title="Xem view rút gọn">
										<button className="btn btn-icon" onClick={() => setShowMainTest(true)}>
											<ProfileOutlined />
										</button>
									</Tooltip>
								}
							>
								<div className="test-body" ref={boxEl} onScroll={onScroll}>
									{loading ? (
										<div className="text-center mt-3">
											<Spin />
										</div>
									) : detailResult?.length == 0 ? (
										<p className="text-center font-weight-bold">Không có dữ liệu</p>
									) : (
										doneTestData &&
										detailResult.map((item, index) => {
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
																<ListQuestion dataQuestion={item} listQuestionID={listQuestionID} />
															</div>
														</div>
													</div>
												);
											} else {
												return (
													<div key={index}>
														<ListQuestion dataQuestion={item} listQuestionID={listQuestionID} />
													</div>
												);
											}
										})
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

export default PackageResultDetail;
