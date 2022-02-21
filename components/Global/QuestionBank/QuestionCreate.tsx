import { DownloadOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Card, Dropdown, Select, Spin, Switch, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Bookmark } from 'react-feather';
import { curriculumApi, exerciseApi, exerciseGroupApi, programApi } from '~/apiBase';
import TitlePage from '~/components/Elements/TitlePage';
import CreateQuestionForm from '~/components/Global/QuestionBank/CreateQuestionForm';
import GroupWrap from '~/components/Global/QuestionBank/GroupWrap';
import QuestionDrag from '~/components/Global/QuestionBank/QuestionShow/QuestionDrag';
import QuestionMap from '~/components/Global/QuestionBank/QuestionShow/QuestionMap';
import QuestionMultiple from '~/components/Global/QuestionBank/QuestionShow/QuestionMultiple';
import QuestionSingle from '~/components/Global/QuestionBank/QuestionShow/QuestionSingle';
import QuestionTyping from '~/components/Global/QuestionBank/QuestionShow/QuestionTyping';
import QuestionWritting from '~/components/Global/QuestionBank/QuestionShow/QuestionWritting';
import LayoutBase from '~/components/LayoutBase';
import { useWrap } from '~/context/wrap';
import { dataTypeGroup, dataTypeSingle } from '~/lib/question-bank/dataBoxType';
import { questionObj } from '~/lib/TypeData';
import ImportExcel from './Elements/ImportExcel';
import QuestionSpeaking from './QuestionShow/QuestionSpeaking';

const { Option, OptGroup } = Select;
let isOpenTypeQuestion = false;
const listTodoApi = {
	pageSize: 10,
	pageIndex: 1,
	CurriculumID: null,
	Type: null,
	Level: null,
	SkillID: null,
	ExerciseGroupID: null,
	ExamTopicType: null
};

const listAlphabet = ['A', 'B', 'C', 'D', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'];

const QuestionCreate = (props) => {
	const { dataExam, isOpenModal } = props;
	const { showNoti, userInformation } = useWrap();
	const [isLoading, setIsLoading] = useState(false);
	const [dataProgram, setDataProgram] = useState<IProgram[]>(null);
	const [dataCurriculum, setDataCurriculum] = useState<ICurriculum[]>(null);
	const [loadingSelect, setLoadingSelect] = useState(false);
	const [questionData, setQuestionData] = useState(questionObj);
	const [dropDownVisible, setDropDownVisible] = useState(false);
	const [showListQuestion, setShowListQuestion] = useState(false);
	const [showTypeQuetion, setShowTypeQuestion] = useState({
		type: null,
		status: false
	});
	const [todoApi, setTodoApi] = useState(listTodoApi);
	const [dataSource, setDataSource] = useState([]);
	const boxEl = useRef(null);
	const [totalPageIndex, setTotalPageIndex] = useState(0);
	const [loadingQuestion, setLoadingQuestion] = useState(false);
	const [isGroup, setIsGroup] = useState({
		id: null,
		status: null
	});
	const [valueCurriculum, setValueCurriculum] = useState(null);
	const [valueProgram, setValueProgram] = useState(null);
	const [valueType, setValueType] = useState(null);
	const [valueLevel, setValueLevel] = useState(null);
	const [valueSkill, setValueSkill] = useState(null);
	const [dataGroup, setDataGroup] = useState([]);
	const [dataExercise, setDataExercise] = useState();
	const [isTest, setIsTest] = useState(false);
	const [loadingProgram, setLoadingProgram] = useState(false);

	// Phân loại dạng câu hỏi để trả ra danh sách
	const returnQuestionType = () => {
		switch (todoApi.Type) {
			/** Quesion Single */
			case 1:
				return (
					<GroupWrap
						dataExam={dataExam}
						isGroup={isGroup}
						listQuestion={dataGroup}
						onFetchData={onFetchData}
						onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
						getGroupID={(groupID) => setIsGroup({ ...isGroup, id: groupID })}
						onEditData={(data) => onEditData(data)}
						onAddData={(data) => onAddData(data)}
					>
						<QuestionSingle
							dataExam={dataExam}
							listAlphabet={listAlphabet}
							isGroup={isGroup}
							loadingQuestion={loadingQuestion}
							listQuestion={dataSource}
							onFetchData={onFetchData}
							onEditData={(data) => onEditData(data)}
							onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
						/>
					</GroupWrap>
				);

				break;
			/** Quesion Drag */
			case 2:
				return (
					<GroupWrap
						dataExam={dataExam}
						isGroup={isGroup}
						listQuestion={dataGroup}
						onFetchData={onFetchData}
						onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
						getGroupID={(groupID) => setIsGroup({ ...isGroup, id: groupID })}
						onEditData={(data) => onEditData(data)}
						onAddData={(data) => onAddData(data)}
					>
						<QuestionDrag
							listAlphabet={listAlphabet}
							isGroup={isGroup}
							loadingQuestion={loadingQuestion}
							listQuestion={dataExercise}
							onFetchData={onFetchData}
							onEditData={(data) => onEditData(data)}
							onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
						/>
					</GroupWrap>
				);
				break;
			/** Quesion Typing */
			case 3:
				return (
					<GroupWrap
						dataExam={dataExam}
						isGroup={isGroup}
						listQuestion={dataGroup}
						onFetchData={onFetchData}
						onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
						getGroupID={(groupID) => setIsGroup({ ...isGroup, id: groupID })}
						onEditData={(data) => onEditData(data)}
						onAddData={(data) => onAddData(data)}
					>
						<QuestionTyping
							listAlphabet={listAlphabet}
							isGroup={isGroup}
							loadingQuestion={loadingQuestion}
							listQuestion={dataExercise}
							onFetchData={onFetchData}
							onEditData={(data) => onEditData(data)}
							onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
						/>
					</GroupWrap>
				);
				break;
			/** Quesion Multiple */
			case 4:
				return (
					<GroupWrap
						dataExam={dataExam}
						isGroup={isGroup}
						listQuestion={dataGroup}
						onFetchData={onFetchData}
						onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
						getGroupID={(groupID) => setIsGroup({ ...isGroup, id: groupID })}
						onEditData={(data) => onEditData(data)}
						onAddData={(data) => onAddData(data)}
					>
						<QuestionMultiple
							dataExam={dataExam}
							listAlphabet={listAlphabet}
							isGroup={isGroup}
							loadingQuestion={loadingQuestion}
							listQuestion={dataSource}
							onFetchData={onFetchData}
							onEditData={(data) => onEditData(data)}
							onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
						/>
					</GroupWrap>
				);

				break;
			/** Quesion Map */
			case 5:
				return (
					<GroupWrap
						dataExam={dataExam}
						isGroup={isGroup}
						listQuestion={dataGroup}
						onFetchData={onFetchData}
						onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
						getGroupID={(groupID) => setIsGroup({ ...isGroup, id: groupID })}
						onEditData={(data) => onEditData(data)}
						onAddData={(data) => onAddData(data)}
					>
						<QuestionMap
							listAlphabet={listAlphabet}
							isGroup={isGroup}
							loadingQuestion={loadingQuestion}
							listQuestion={dataSource}
							onFetchData={onFetchData}
							onEditData={(data) => onEditData(data)}
							onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
						/>
					</GroupWrap>
				);
				break;
			/** Quesion Writting */
			case 6:
				return (
					<QuestionWritting
						dataExam={dataExam}
						listAlphabet={listAlphabet}
						isGroup={isGroup}
						loadingQuestion={loadingQuestion}
						listQuestion={dataSource}
						onFetchData={onFetchData}
						onEditData={(data) => onEditData(data)}
						onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
					/>
				);
				break;
			/** Quesion Speaking */
			case 7:
				return (
					<QuestionSpeaking
						dataExam={dataExam}
						listAlphabet={listAlphabet}
						isGroup={isGroup}
						loadingQuestion={loadingQuestion}
						listQuestion={dataSource}
						onFetchData={onFetchData}
						onEditData={(data) => onEditData(data)}
						onRemoveData={(dataRemove) => onRemoveData(dataRemove)}
					/>
				);
				break;
			default:
				return (
					<p className="text-center">
						<b>Danh sách còn trống</b>
					</p>
				);
				break;
		}
	};

	// GET DATA SOURCE - DATA EXERCISE
	const getDataSource = async () => {
		console.log('Chạy data source');
		let res = null;
		try {
			if (!isGroup.status) {
				res = await exerciseApi.getAll({ ...todoApi, ExerciseGroupID: 0 });
			} else {
				res = await exerciseGroupApi.getAll(todoApi);
			}

			if (res.status == 200) {
				// Xét coi này câu hỏi nhóm hay đơn
				if (!isGroup.status) {
					let cloneData = [...dataSource];
					res.data.data.forEach((item, index) => {
						cloneData.push(item);
					});

					setDataSource([...cloneData]);
				} else {
					let cloneData = [...dataGroup];
					res.data.data.forEach((item, index) => {
						cloneData.push(item);
					});

					setDataGroup([...cloneData]);
				}

				// todoApi.pageIndex == 1 && showNoti("success", "Thành công");
				// !showListQuestion && setShowListQuestion(true);

				// Caculator pageindex
				let totalPage = Math.ceil(res.data.totalRow / 10);
				setTotalPageIndex(totalPage);
			}

			if (res.status == 204) {
				// showNoti("danger", "Không có dữ liệu");
				if (!isGroup.status) {
					if (todoApi.Type == 3) {
						setShowListQuestion(false);
					}
				} else {
					setShowListQuestion(true);
				}
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading(false);
			loadingQuestion && setLoadingQuestion(false);
		}
	};

	// GET DATA PROGRAM
	const getDataProgram = async () => {
		setLoadingProgram(true);
		try {
			let res = await programApi.getAll({ pageIndex: 1, pageSize: 999999 });
			res.status == 200 && setDataProgram(res.data.data);
			res.status == 204 && showNoti('danger', 'Chương trình không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoadingProgram(false);
		}
	};

	// GET DATA Curriculum
	const getDataCurriculum = async (id) => {
		setLoadingSelect(true);
		try {
			let res = await curriculumApi.getAll({
				pageIndex: 1,
				pageSize: 999999,
				ProgramID: id
			});
			res.status == 200 && setDataCurriculum(res.data.data);
			res.status == 204 && showNoti('danger', 'Giáo trình không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoadingSelect(false);
		}
	};

	// CHỌN DẠNG CÂU HỎI (CHOICE, MULTIPLE,...)
	const changeBoxType = (e: any, Type: number, TypeName: string) => {
		console.log('Chạy vô box type');

		e?.preventDefault();

		questionData.Type = Type;
		questionData.TypeName = TypeName;

		// Kiểm dạng câu hỏi gì để thay đổi list answer
		switch (Type) {
			case 4:
				questionData.ExerciseAnswer = [];
				// setQuestionData({ ...questionData });
				break;
			case 1:
				questionData.ExerciseAnswer = questionObj.ExerciseAnswer;
				break;
			// case 3:
			//   questionData.ExerciseList = [];
			default:
				break;
		}

		// Add value vào data chung
		setQuestionData({ ...questionData });

		// Active
		setShowTypeQuestion({
			...showTypeQuetion,
			type: Type
		});

		// Show danh sách câu hỏi bên cạnh
		setIsLoading(true);
		!showListQuestion && setShowListQuestion(true);
		setDataSource([]);
		setDataGroup([]);
		setTodoApi({
			...todoApi,
			Type: Type,
			CurriculumID: questionData.CurriculumID,
			Level: questionData.Level,
			SkillID: questionData.SkillID,
			pageIndex: 1
		});
	};

	// PICK IS TEST
	const pickIsTest = (checked) => {
		if (!dataExam) {
			setIsTest(checked);
			if (checked) {
				setQuestionData({
					...questionData,
					CurriculumID: 0
				});
				setValueProgram(null);
				setValueCurriculum(null);
				if (showListQuestion) {
					setIsLoading(true);
					setTodoApi({
						...todoApi,
						pageIndex: 1,
						CurriculumID: 0
					});
					setDataSource([]);
					setDataGroup([]);
				}
			} else {
				setShowListQuestion(false);
				setShowTypeQuestion({
					status: false,
					type: null
				});
			}
		}
	};

	// HANDLE CHANGE SELECT - THAO TÁC VỚI CÁC SELECT
	const handleChange_select = (selectName, option) => {
		setDataSource([]);
		setDataGroup([]);

		switch (selectName) {
			// -- Chọn chương trình
			case 'program':
				getDataCurriculum(option.value);
				setDataCurriculum(null);
				setValueCurriculum(null);
				showListQuestion &&
					(setIsLoading(true),
					setTodoApi({
						...todoApi,
						pageIndex: 1,
						CurriculumID: null
					}));
				setShowTypeQuestion({
					type: null,
					status: false
				});
				setShowListQuestion(false);
				setValueProgram(option.value);
				break;

			// -- Chọn loại câu hỏi đơn hay nhóm
			case 'type-question-group':
				// questionData.ExerciseGroupID = option.value;
				isOpenTypeQuestion = true;
				if (option.value == 0) {
					setIsGroup({
						id: null,
						status: false
					});
				} else {
					setIsGroup({
						...isGroup,
						status: true
					});
				}

				if (questionData.Type == 2 || questionData.Type == 3 || questionData.Type == 5) {
					setShowListQuestion(false);
					setShowTypeQuestion({
						...showTypeQuetion,
						type: null
					});
				} else {
					showListQuestion &&
						(setIsLoading(true),
						setTodoApi({
							...todoApi,
							pageIndex: 1
						}));
				}

				setValueType(option.value);
				break;

			// -- Chọn môn học
			case 'curriculum':
				questionData.CurriculumID = option.value;
				questionData.CurriculumName = option.children;

				showListQuestion &&
					(setIsLoading(true),
					setTodoApi({
						...todoApi,
						CurriculumID: option.value,
						pageIndex: 1
					}));
				setValueCurriculum(option.value);
				break;

			// -- Chọn level (Dễ, trung bình, khó)
			case 'level':
				questionData.Level = option.value;
				questionData.LevelName = option.children;
				showListQuestion &&
					(setIsLoading(true),
					setTodoApi({
						...todoApi,
						Level: option.value
					}));
				setValueLevel(option.value);
				break;

			// -- Chọn kĩ năng
			case 'skill':
				questionData.SkillID = option.value;

				// Xét trường hợp kĩ năng "Nói" hoặc "Viết"
				if (option.value == 2 || option.value == 4) {
					questionData.Type = 0;
					setShowListQuestion(false);
					// Nếu loại "Nói" hoặc "Viết" thì mặc định không phải câu hỏi nhóm
					setIsGroup({
						id: null,
						status: false
					});
					setValueType(0);
				} else {
					!valueType && setValueType(0);

					if (valueSkill == 1 || valueSkill == 3) {
						setIsLoading(true);
						setTodoApi({
							...todoApi,
							SkillID: option.value
						});
					} else {
						setShowListQuestion(false);
						setShowTypeQuestion({
							...showTypeQuetion,
							type: null
						});
					}
				}
				setValueSkill(option.value);
				isOpenTypeQuestion = true;
			default:
				break;
		}
		setQuestionData({ ...questionData });

		// kiểm tra mới vào đã chọn đầy đủ 4 trường hay chưa rồi mới show danh sách dạng câu hỏi
		if (!showTypeQuetion.status) {
			if (
				questionData.ExerciseGroupID !== null &&
				questionData.SkillID !== null &&
				questionData.Level !== null &&
				isOpenTypeQuestion == true
			) {
				if (isTest) {
					setShowTypeQuestion({
						...showTypeQuetion,
						status: true
					});
				} else {
					if (questionData.CurriculumID !== null && questionData.CurriculumID !== 0) {
						setShowTypeQuestion({
							...showTypeQuetion,
							status: true
						});
					}
				}
			}
		}
	};

	// ON ADD NEW DATA
	const addDataGroup = (dataAdd) => {
		dataGroup.splice(0, 0, dataAdd);
		setDataGroup([...dataGroup]);
	};

	const addDataSingle = (dataAdd) => {
		dataSource.splice(0, 0, dataAdd);
		setDataSource([...dataSource]);
	};

	const onAddData = (dataAdd) => {
		if (!isGroup.status) {
			addDataSingle(dataAdd);
		} else {
			if (dataAdd.ExerciseGroupID) {
				addDataSingle(dataAdd);
			} else {
				addDataGroup(dataAdd);
			}
		}
		questionData.Content = '';
		setQuestionData({ ...questionData });
	};

	const editDataGroup = (dataEdit) => {
		let index = dataGroup.findIndex((item) => item.ID == dataEdit.ID);
		dataGroup.splice(index, 1, dataEdit);

		// let exerciseList = [...dataEdit.ExerciseList];

		setDataExercise(dataEdit);
		setDataGroup([...dataGroup]);
	};

	const editDataSingle = (dataEdit) => {
		if (dataEdit.Type == 4) {
			let newAnswerList = dataEdit.ExerciseAnswer.filter((item) => item.Enable !== false);
			dataEdit.ExerciseAnswer = newAnswerList;
		}

		let index = dataSource.findIndex((item) => item.ID == dataEdit.ID);
		dataSource.splice(index, 1, dataEdit);

		setDataSource([...dataSource]);
	};

	const onEditData = (dataEdit) => {
		if (!isGroup.status) {
			// Nếu là dạng câu hỏi nhiều đáp án thì phải xóa nó đi
			editDataSingle(dataEdit);
		} else {
			if (dataEdit.ExerciseGroupID) {
				editDataSingle(dataEdit);
			} else {
				editDataGroup(dataEdit);
			}
		}

		questionData.Content = '';
		setQuestionData({ ...questionData });
	};

	// ON REMOVE DATA
	const removeDataSingle = (dataRemove) => {
		let quesIndex = dataSource.findIndex((item) => item.ID == dataRemove.ID);
		dataSource.splice(quesIndex, 1);
		setDataSource([...dataSource]);
	};

	const removeDataGroup = (dataRemove) => {
		if (dataRemove.isDeleteExercise) {
			setDataExercise(dataRemove);
		} else {
			let quesIndex = dataGroup.findIndex((item) => item.ID == dataRemove);
			dataGroup.splice(quesIndex, 1);
			setDataGroup([...dataGroup]);
		}
	};

	const onRemoveData = (dataRemove) => {
		if (!isGroup.status) {
			removeDataSingle(dataRemove);
		} else {
			if (dataRemove.ExerciseGroupID) {
				removeDataSingle(dataRemove);
			} else {
				removeDataGroup(dataRemove);
			}
		}
	};

	// ON FETCH DATA
	const onFetchData = () => {
		scrollToTop(), setIsLoading(true), setDataSource([]), setDataGroup([]);
		setTodoApi({ ...todoApi, pageIndex: 1, pageSize: 10 });
	};

	// SCROLL TO TOP
	const scrollToTop = () => {
		boxEl.current.scrollTo(0, 0);
	};

	// ON SCROLL
	const onScroll = () => {
		console.log('Chạy vào on scroll');
		const scrollHeight = boxEl.current.scrollHeight;
		const offsetHeight = boxEl.current.offsetHeight;
		const scrollTop = boxEl.current.scrollTop;

		if (scrollTop > scrollHeight - offsetHeight - 40) {
			if (todoApi.pageIndex < totalPageIndex) {
				setLoadingQuestion(true);

				if (scrollTop > 0 && loadingQuestion == false) {
					setTodoApi({
						...todoApi,
						pageIndex: todoApi.pageIndex + 1
					});
				}
			}
		}
	};

	useEffect(() => {
		getDataProgram(); // Lấy data chương trình
	}, []);

	useEffect(() => {
		if (todoApi.Type && todoApi.Type !== 0) {
			getDataSource();
		}
		questionData.Content = '';
		switch (questionData.Type) {
			case 4:
				questionData.ExerciseAnswer = [];
				break;

			default:
				break;
		}
		setQuestionData({ ...questionData });
	}, [todoApi]);

	useEffect(() => {
		console.log('chạy dô');
		if (dataExam) {
			if (dataExam.Type == 1) {
				setIsTest(true);
				questionData.CurriculumID = 0;
			} else {
				setValueProgram(dataExam.ProgramID);
				getDataCurriculum(dataExam.ProgramID);
				setValueCurriculum(dataExam.CurriculumID);
				questionData.CurriculumID = dataExam.CurriculumID;
			}

			questionData.Level = 1;
			questionData.SkillID = 3;
			setQuestionData({ ...questionData });
			setValueSkill(3);
			setValueLevel(1);
			setValueType(0);
			changeBoxType(null, 1, 'Lựa chọn một');
			isOpenTypeQuestion = true;
		} else {
			// setValueProgram(31);
			// getDataCurriculum(31);
			// setValueCurriculum(23);
			// questionData.CurriculumID = 23;
			// questionData.Level = 1;
			// questionData.SkillID = 3;
			// setQuestionData({ ...questionData });
			// setValueSkill(3);
			// setValueLevel(1);
			// setValueType(0);
			// changeBoxType(null, 1, 'Lựa chọn một');
			// isOpenTypeQuestion = true;
		}
		setShowTypeQuestion({
			type: 1,
			status: true
		});
	}, [dataExam]);

	console.log('Data Source: ', dataSource);

	useEffect(() => {
		if (!isOpenModal) {
			console.log('Chạy dô đây');
			setDataSource([]);
		}
	}, [isOpenModal]);

	const menuDropdown = () => {
		return (
			<>
				<div className="menu__dropdown d-inline-block d-xl-none" style={{ width: 170 }}>
					{/* <div className="d-inline-block d-lg-none ">
												</div> */}
					<div className="mb-4 w-100">
						<Tooltip title="Tải file excel mẫu">
							<a className="btn btn-light mr-2 btn-have-icon" href="https://lmsv2.monamedia.net/Upload/Exercise/Excel.xlsx">
								<span className="d-flex align-items-center text-center">
									<DownloadOutlined className="mr-2" />
									File mẫu
								</span>
							</a>
						</Tooltip>
					</div>
					<div className="mb-4">
						<ImportExcel onFetchData={onFetchData} />
					</div>
					<div className="mb-4">
						<CreateQuestionForm
							questionData={questionData}
							onFetchData={onFetchData}
							isGroup={isGroup}
							onAddData={(data) => onAddData(data)}
						/>
					</div>
				</div>
			</>
		);
	};

	return (
		<div className="question-create">
			<TitlePage title="Tạo câu hỏi" />
			<div className="row">
				<div className="col-md-12"></div>
			</div>
			<div className="row">
				<div className="col-xl-8 col-12">
					<Card
						className="card-detail-question"
						title={
							<div className="title-question-bank">
								<h3 className="title-big">
									<Bookmark /> {!isGroup.status ? 'Danh sách câu hỏi' : 'Danh sách nhóm câu hỏi'}
								</h3>
								<p
									style={{
										paddingLeft: '30px',
										fontSize: '13px',
										marginBottom: '0',
										fontWeight: 500,
										color: '#777777'
									}}
								>
									{showTypeQuetion.type && questionData.TypeName}
								</p>
							</div>
						}
						extra={
							userInformation?.RoleID !== 2 && (
								<>
									<div className="d-none d-lg-flex justify-content-between" style={{ width: 410 }}>
										<Tooltip title="Tải file excel mẫu">
											<a
												className="btn btn-light mr-1 btn-have-icon"
												href="https://lmsv2.monamedia.net/Upload/Exercise/Excel.lgsx"
											>
												<span className="d-flex align-items-center">
													<DownloadOutlined className="mr-2" />
													File mẫu
												</span>
											</a>
										</Tooltip>
										<ImportExcel className="mr-1" onFetchData={onFetchData} />
										<CreateQuestionForm
											className="ml-1"
											questionData={questionData}
											onFetchData={onFetchData}
											isGroup={isGroup}
											onAddData={(data) => onAddData(data)}
										/>
									</div>
									<div className="d-lg-none">
										<Dropdown overlay={menuDropdown} trigger={['click']} visible={dropDownVisible}>
											<a
												className="ant-dropdown-link"
												onClick={(e) => {
													e.preventDefault();
													setDropDownVisible(!dropDownVisible);
												}}
											>
												<EllipsisOutlined />
											</a>
										</Dropdown>
									</div>
								</>
							)
						}
					>
						{!showListQuestion ? (
							<>
								<p className="font-weight-primary text-center">
									{dataExam ? 'Vui lòng chọn dạng câu hỏi' : 'Vui lòng chọn giáo trình và dạng câu hỏi'}
								</p>
								<div className="img-load">
									<img src="/images/study-min.jpg" alt="" />
								</div>
							</>
						) : isLoading ? (
							<div className="text-center p-2">
								<Spin />
							</div>
						) : (
							<div className={`question-list active`} ref={boxEl} onScroll={onScroll}>
								{returnQuestionType()}
							</div>
						)}
					</Card>
				</div>

				{/** Menu Question */}
				<div className="col-xl-4 col-12">
					<Card className="card-box-type">
						<div className={`row ${showTypeQuetion ? 'mb-2' : ''}`}>
							{/** CHỌN LOẠI ĐỀ */}
							<div className="col-12 mb-4">
								<Switch
									className="pick-test"
									checkedChildren="Đề hẹn test"
									unCheckedChildren="Đề hẹn test"
									checked={isTest}
									onChange={pickIsTest}
								/>
							</div>
							{/** CHỌN CHƯƠNG TRÌNH */}
							<div className="col-md-6 col-12 ">
								<div className="item-select">
									<Tooltip title="Chương trình" placement="topLeft">
										<Select
											loading={loadingProgram}
											disabled={isTest ? true : dataExam ? true : false}
											placeholder="Chọn chương trình"
											className="style-input"
											value={valueProgram}
											style={{ width: '100%' }}
											onChange={(value, option) => handleChange_select('program', option)}
										>
											{dataProgram?.map((item, index) => (
												<Option key={index} value={item.ID}>
													{item.ProgramName}
												</Option>
											))}
										</Select>
									</Tooltip>
								</div>
							</div>
							{/** CHỌN MÔN HỌC */}
							<div className="col-md-6 col-12 ">
								<div className="item-select">
									<Tooltip title="Giáo trình" placement="topLeft">
										<Select
											disabled={isTest ? true : dataExam ? true : false}
											loading={loadingSelect}
											className="style-input"
											placeholder="Chọn giáo trình"
											value={valueCurriculum}
											style={{ width: '100%' }}
											onChange={(value, option) => handleChange_select('curriculum', option)}
										>
											{dataCurriculum?.map((item, index) => (
												<Option key={index} value={item.ID}>
													{item.CurriculumName}
												</Option>
											))}
										</Select>
									</Tooltip>
								</div>
							</div>

							{/** KĨ NĂNG  */}
							<div className="col-md-6 col-12 mt-3">
								<div className="item-select">
									<Tooltip title="Kĩ năng" placement="topLeft">
										<Select
											value={valueSkill}
											className="style-input"
											placeholder="Chọn kĩ năng"
											style={{ width: '100%' }}
											onChange={(value, option) => handleChange_select('skill', option)}
										>
											<Option value={1}>Nghe </Option>
											<Option value={2}>Nói</Option>
											<Option value={3}>Đọc</Option>
											<Option value={4}>Viết</Option>
										</Select>
									</Tooltip>
								</div>
							</div>

							{/** MỨC ĐỘ  */}
							<div className="col-md-6 col-12 mt-3">
								<div className="item-select">
									<Tooltip title="Mức độ" placement="topLeft">
										<Select
											value={valueLevel}
											className="style-input"
											// defaultValue="Chọn mức độ"
											placeholder="Chọn mức độ"
											style={{ width: '100%' }}
											onChange={(value, option) => handleChange_select('level', option)}
										>
											<Option value={1}>Dễ</Option>
											<Option value={2}>Trung bình</Option>
											<Option value={3}>Khó</Option>
										</Select>
									</Tooltip>
								</div>
							</div>

							{/** LOẠI CÂU HỎI (SINGLE HOẶC GROUP)  */}
							<div className="col-md-12 col-12 mt-3">
								<div className="item-select">
									<Tooltip title=" Loại câu hỏi" placement="topLeft">
										<Select
											value={valueType}
											className="style-input"
											placeholder="Chọn loại câu hỏi"
											style={{ width: '100%' }}
											onChange={(value, option) => handleChange_select('type-question-group', option)}
										>
											<Option value={0}>Câu hỏi đơn</Option>
											<Option value={1}>Câu hỏi nhóm</Option>
										</Select>
									</Tooltip>
								</div>
							</div>
						</div>
						<div className="row">
							<div className={`wrap-type-question w-100 ${showTypeQuetion.status ? 'active' : 'nun-active'}`}>
								<div className="col-md-12">
									<p style={{ fontWeight: 500 }}>Chọn dạng câu hỏi dưới đây</p>
								</div>
								{isGroup.status
									? dataTypeGroup?.map(
											(item, index) =>
												item.Skill.includes(valueSkill) && (
													<div className="col-md-12" key={index}>
														<div className="box-type-question">
															<a
																href="#"
																onClick={(e) => changeBoxType(e, item.Type, item.TypeName)}
																className={item.Type === showTypeQuetion.type ? 'active' : ''}
															>
																<div className="type-img">
																	<img src={item.Images} alt="" className="img-inner" />
																</div>
																<div className="type-detail">
																	{/* <h5 className="number">{item.Number}</h5> */}
																	<div className="p text">{item.TypeName}</div>
																</div>
															</a>
														</div>
													</div>
												)
									  )
									: dataTypeSingle?.map(
											(item, index) =>
												item.Skill.includes(valueSkill) && (
													<div className="col-md-12" key={index}>
														<div className="box-type-question">
															<a
																href="#"
																onClick={(e) => changeBoxType(e, item.Type, item.TypeName)}
																className={item.Type === showTypeQuetion.type ? 'active' : ''}
															>
																<div className="type-img">
																	<img src={item.Images} alt="" className="img-inner" />
																</div>
																<div className="type-detail">
																	{/* <h5 className="number">{item.Number}</h5> */}
																	<div className="p text">{item.TypeName}</div>
																</div>
															</a>
														</div>
													</div>
												)
									  )}
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
};

QuestionCreate.layout = LayoutBase;
export default QuestionCreate;
