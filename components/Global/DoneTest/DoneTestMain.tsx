import Reac, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doneTestApi } from '~/apiBase/done-test/dont-test';
import { useWrap } from '~/context/wrap';
import { useDoneTest } from '~/context/useDoneTest';
import { Card, Skeleton, Table } from 'antd';
import PowerTable from '~/components/PowerTable';
import TitlePage from '~/components/TitlePage';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { doingTestApi } from '~/apiBase';
import { ProfileOutlined } from '@ant-design/icons';
import MainTest from '../DoingTest/MainTest';

type convertData = {
	key: number;

	yourAnswer: Array<string>;
	correctAnswer: Array<string>;
	question: string;
	isResult: boolean;
};

const DoneTestMain = () => {
	const router = useRouter();
	const { showNoti } = useWrap();
	const SetPackageResultID = router.query.SetPackageResultID as string;
	const { getDoneTestData } = useDoneTest();
	const [dataResultTest, setDataResultTest] = useState<convertData[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [listQuestionID, setListQuestionID] = useState([]); // Lấy tất cả ID đã có
	const [listGroupID, setListGroupID] = useState([]); // Lấy tất cả group ID đã có
	const [state, setState] = useState({ selectedRowKeys: [] });
	const [infoTest, setInfoTest] = useState(null);
	const [loadingInfoTest, setLoadingInfoTest] = useState(false);
	const [dataDoneTest, setDataDoneTest] = useState([]);
	const [showMainTest, setShowMainTest] = useState(false);

	// console.log("Data Result Test: ", dataResultTest);
	// console.log("List question ID: ", listQuestionID);
	// console.log("Get info test: ", infoTest);
	// console.log("Data Done Test: ", dataDoneTest);

	const columns = [
		{
			title: '',
			dataIndex: '',
			key: 'number',
			width: '5%',
			render: (text, data, index) => <p className="font-weight-black">{index + 1 + '/'}</p>
		},
		{
			title: 'Câu hỏi',
			dataIndex: 'question',
			key: 'number',
			width: '30%',
			render: (text) => <p className="font-weight-black">{ReactHtmlParser(text)}</p>
		},
		{
			title: 'Câu trả lời của bạn',
			dataIndex: 'yourAnswer',
			key: 'yourAnswer',
			render: (text, data) => {
				return text.map((item) => (
					<p
						style={{
							fontWeight: 500,
							color: data.isResult ? '#005c25' : '#b20027'
						}}
					>
						{item}
					</p>
				));
			}
		},
		{
			title: 'Đáp án',
			dataIndex: 'correctAnswer',
			key: 'correctAnswer',
			render: (text, data, index) => {
				return (
					<>
						{text.map((item) => (
							<p className="d-block mb-0 font-weight-black">{item}</p>
						))}
					</>
				);
			}
		}
	];

	const getInfoTest = async () => {
		setLoadingInfoTest(true);
		try {
			let res = await doingTestApi.getByID(SetPackageResultID);
			if (res.status === 200) {
				setInfoTest(res.data.data);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoadingInfoTest(false);
		}
	};

	const getDataResultTest = async () => {
		let cloneListQuestionID = [...listQuestionID];
		let cloneListGroupID = [...listGroupID];
		setIsLoading(true);
		try {
			let res = await doneTestApi.getAll({
				selectAll: true,
				SetPackageResultID: parseInt(SetPackageResultID)
			});
			if (res.status === 200) {
				convertDataDoneTest(res.data.data); // Convert data thích hợp với view show chi tiết shot câu hỏi & đáp án
				convertDataResult(res.data.data); // Convert data thích hợp với table
				setDataDoneTest(res.data.data);
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
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading(false);
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

		setDataDoneTest([...cloneData]);
	};

	const convertDataResult = (data) => {
		// Retung correct answer
		const returnCorrectAnswer = (dataReturn) => {
			let listAns = [];

			dataReturn.SetPackageExerciseAnswerStudent.forEach((item) => {
				if (item.isTrue) {
					listAns.push(item.ExerciseAnswerContent);
				}
			});

			return listAns;
		};

		// return your answer
		const returnYourAnswer = (dataReturn) => {
			let listAns = [];

			dataReturn.SetPackageExerciseAnswerStudent.forEach((item) => {
				if (item.AnswerID !== 0) {
					listAns.push(item.AnswerContent);
				}
			});

			return listAns;
		};

		data.forEach((item) => {
			item.SetPackageExerciseStudent.forEach((ques) => {
				dataResultTest.push({
					key: ques.ID,
					question: ques.Content,
					yourAnswer: returnYourAnswer(ques),
					correctAnswer: returnCorrectAnswer(ques),
					isResult: ques.isTrue
				});
			});
		});

		setDataResultTest([...dataResultTest]);
	};

	// ---- TABLE ----
	const onSelectedRowKeysChange = (selectedRowKeys) => {
		setState({ selectedRowKeys });
	};

	const rowSelection = {
		selectedRowKeys: state.selectedRowKeys,
		onChange: onSelectedRowKeysChange,
		hideSelectAll: true
	};

	useEffect(() => {
		getDataResultTest();
		getInfoTest();
	}, []);

	return (
		<div className="done-test-card">
			{showMainTest && (
				<MainTest
					dataDoneTest={dataDoneTest}
					isDone={true}
					listIDFromDoneTest={listQuestionID}
					listGroupIDFromDoneTest={listGroupID}
					closeMainTest={() => setShowMainTest(false)}
				/>
			)}
			<TitlePage title="Kết quả làm bài" />
			<Card
				title="Kết quả làm bài"
				extra={
					<>
						<button className="btn btn-warning with-icon" onClick={() => setShowMainTest(true)}>
							<ProfileOutlined />
							Xem chi tiết
						</button>
					</>
				}
			>
				<div className="wrap-box-info">
					<div className="box-info">
						<div className="box-info__item box-info__score">
							Số điểm
							<span className="number">
								{loadingInfoTest ? <Skeleton paragraph={false} loading={true} title={true} active /> : infoTest?.PointTotal}
							</span>
						</div>
						<div className="box-info__item box-info__correct">
							Số câu đúng
							<span className="number">
								{loadingInfoTest ? (
									<Skeleton paragraph={false} loading={true} title={true} active />
								) : (
									infoTest?.ReadingCorrect + infoTest?.ListeningCorrect
								)}
							</span>
						</div>
					</div>
				</div>
				<div className="done-test-table">
					<div className="wrap-table">
						<Card>
							<Table
								loading={isLoading}
								pagination={{ pageSize: 200 }}
								rowSelection={rowSelection}
								dataSource={dataResultTest}
								columns={columns}
								size="middle"
								scroll={{ x: 'max-content' }}
							/>
						</Card>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default DoneTestMain;
