import React, { useRef, useState, useEffect } from 'react';

import { Popover, Card, Spin, Skeleton, Select, Modal, Tooltip } from 'antd';
import TitlePage from '~/components/Elements/TitlePage';
import { Bookmark, Trash2 } from 'react-feather';
import { SyncOutlined } from '@ant-design/icons';
import CreateExamForm from '~/components/Global/QuestionBank/CreateExamForm';
import LayoutBase from '~/components/LayoutBase';
import Link from 'next/link';
import { examTopicApi, programApi, curriculumApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import SearchBox from '~/components/Elements/SearchBox';
import Loading from '~/components/Loading';

const { Option, OptGroup } = Select;

type dataOject = {
	title: string;
	value: number;
};

const DeleteExam = (props) => {
	const { examID, onFetchData } = props;
	const { showNoti } = useWrap();
	const [isLoading, setIsLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			let res = await examTopicApi.update({ ID: examID, Enable: false });
			if (res.status == 200) {
				onFetchData && onFetchData();
				showNoti('success', 'Xóa thành công');
				setIsModalVisible(false);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<>
			<button className="btn btn-icon delete" onClick={showModal}>
				<Trash2 />
			</button>
			<Modal
				title="Chú ý!"
				visible={isModalVisible}
				onCancel={handleCancel}
				footer={
					<div className="text-center">
						<button className="btn btn-light mr-2" onClick={handleCancel}>
							Hủy
						</button>
						<button className="btn btn-primary" onClick={handleSubmit}>
							Xóa
							{isLoading && <Spin className="loading-base" />}
						</button>
					</div>
				}
			>
				<p style={{ fontWeight: 500 }}>Bạn có chắc muốn xóa đề thi này?</p>
			</Modal>
		</>
	);
};

const ExamList = (props) => {
	const { showNoti } = useWrap();
	const [dataExam, setDataExam] = useState<IExamTopic[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const listTodoApi = {
		pageIndex: 1,
		pageSize: 10,
		CurriculumID: null,
		Type: null,
		Code: null
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);
	const [dataProgram, setDataProgram] = useState<dataOject[]>([]);
	const [dataCurriculum, setDataCurriculum] = useState<dataOject[]>([]);
	const [loadingSelect, setLoadingSelect] = useState(false);
	const [loadingQuestion, setLoadingQuestion] = useState(false);
	const [totalPageIndex, setTotalPageIndex] = useState(0);
	const boxEl = useRef(null);
	const [valueCurriculum, setValueCurriculum] = useState(null);
	const [valueProgram, setValueProgram] = useState(null);
	const [valueTypeExam, setValueTypeExam] = useState(null);
	const [valueFilter, setValueFilter] = useState(null);
	const [showFilter, setShowFilter] = useState(false);

	const getAllExam = async () => {
		try {
			let res = await examTopicApi.getAll(todoApi);
			if (res.status == 200) {
				let cloneData = [...dataExam];
				res.data.data.forEach((item, index) => {
					cloneData.push(item);
				});

				setDataExam([...cloneData]);

				// Caculator pageindex
				let totalPage = Math.ceil(res.data.totalRow / 10);
				setTotalPageIndex(totalPage);
			}
			if (res.status == 204) {
				setDataExam([]);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
			loadingQuestion && setLoadingQuestion(false);
		}
	};

	// GET DATA PROGRAM
	const getDataProgram = async () => {
		try {
			let res = await programApi.getAll({ pageIndex: 1, pageSize: 999999 });
			if (res.status == 200) {
				let newData = res.data.data.map((item) => ({
					title: item.ProgramName,
					value: item.ID
				}));
				setDataProgram(newData);
			}

			res.status == 204 && showNoti('danger', 'Chương trình không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
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
			if (res.status == 200) {
				let newData = res.data.data.map((item) => ({
					title: item.CurriculumName,
					value: item.ID
				}));
				setDataCurriculum(newData);
			}

			res.status == 204 && showNoti('danger', 'Giáo trình không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoadingSelect(false);
		}
	};

	// SELECT PROGRAM
	const handleSelect_Program = (value) => {
		setValueProgram(value);
		setValueCurriculum(null);
		setDataExam([]);
		getDataCurriculum(value);
	};

	// SELECT Curriculum
	const handleSelect_Curriculum = (value) => {
		setValueCurriculum(value);

		reloadData();
		setTodoApi({ ...todoApi, pageIndex: 1, pageSize: 10, CurriculumID: value });
	};

	// SELECT TYPE
	const handleSelect_Type = (value) => {
		setValueTypeExam(value);
		reloadData();
		setTodoApi({ ...todoApi, pageIndex: 1, pageSize: 10, Type: value });
	};

	// SELECT FILTER
	const handleSelect_Filter = (value) => {
		setValueFilter(value);
		switch (value) {
			case 0:
				reloadData();
				resetFilter();
				break;
			case 1:
				reloadData();
				setTodoApi({
					...todoApi,
					Type: value,
					CurriculumID: null
				});
				setShowFilter(false);
				break;
			// case 2:
			// 	setDataExam([]);
			// 	setShowFilter(true);
			// 	break;
			default:
				reloadData();
				setTodoApi({
					...todoApi,
					Type: value
				});
				setShowFilter(true);
				break;
		}
	};

	// ON FETCH DATA
	const onFetchData = () => {
		reloadData();
		setTodoApi({ ...todoApi, pageIndex: 1, pageSize: 10 });
	};

	// RELOAD DATA
	const reloadData = () => {
		scrollToTop(), setIsLoading(true), setDataExam([]);
	};

	// RESET FILTER
	const resetFilter = () => {
		setValueFilter(0);
		setShowFilter(false);
		setValueCurriculum(null);
		setValueProgram(null);
		setValueTypeExam(null);
		reloadData();
		setTodoApi({
			...listTodoApi
		});
	};

	// ON SEARCH
	const handleSearch = (value) => {
		reloadData();
		setTodoApi({
			...listTodoApi,
			Code: value
		});
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

		// console.log("Height: ", scrollHeight - offsetHeight);
		// console.log("Scroll: ", scrollTop);

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
		getDataProgram();
		getAllExam();
	}, [todoApi]);

	useEffect(() => {
		setValueFilter(0);
		setIsLoading(true);
	}, []);

	return (
		<div className="question-create exam-create">
			<TitlePage title="Tạo đề thi" />

			<div className="row">
				<div className="col-md-8 col-12">
					<Card
						className="card-detail-exam card-detail-question"
						title={
							<div className="title-question-bank">
								<h3 className="title-big">
									<Bookmark /> Danh sách đề thi
								</h3>
							</div>
						}
						extra={<CreateExamForm onFetchData={onFetchData} />}
					>
						<div className="question-list" ref={boxEl} onScroll={onScroll}>
							<div className="row mb-3">
								<div className="col-12">
									<SearchBox placeholder={'Tìm theo mã đề thi'} handleSearch={(value) => handleSearch(value)} />
								</div>
							</div>
							{isLoading ? (
								<div className="text-center p-2">
									<Spin />
								</div>
							) : dataExam?.length == 0 ? (
								<p className="text-center">
									<b>Danh sách còn trống</b>
								</p>
							) : (
								<div className="row">
									{dataExam?.map((item, index) => (
										<div className="col-md-6 col-12" key={index}>
											<div className="package-set">
												<div className="edit-exam">
													<CreateExamForm onFetchData={() => onFetchData()} dataItem={item} />
													<DeleteExam examID={item.ID} onFetchData={onFetchData} />
												</div>
												<div className="wrap-set">
													<div className="wrap-set-content">
														<div className="box-title">
															<h6 className="set-title">
																<Link
																	href={{
																		pathname: '/question-bank/exam-list/exam-detail/[slug]',
																		query: { slug: item.ID }
																	}}
																>
																	<a href="">{item.Name}</a>
																</Link>
															</h6>
															<p className="code">
																<span>Mã: </span> {item.Code}
															</p>
														</div>
														<ul className="set-list">
															<li className="status">
																Giáo trình: <span>{item.CurriculumName}</span>
															</li>
															<li className="price">
																Dạng: <span>{item.TypeName}</span>
															</li>
															<li className="time">
																Thời gian: <span>{item.Time} phút</span>
															</li>
														</ul>

														{/* <p className="set-des">{item.Description}</p> */}
														<div className="set-btn">
															<Link
																href={{
																	pathname: '/question-bank/exam-list/exam-detail/[slug]',
																	query: { slug: item.ID }
																}}
															>
																<a className="btn btn-warning">Xem chi tiết</a>
															</Link>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
									{loadingQuestion && (
										<>
											<div className="col-md-6 col-12">
												<Skeleton />
											</div>
											<div className="col-md-6 col-12">
												<Skeleton />
											</div>
										</>
									)}
								</div>
							)}
						</div>
					</Card>
				</div>
				<div className="col-md-4 col-12">
					<Card
						className="card-box-type"
						title="Lọc nhanh"
						extra={
							<Tooltip title="Reset">
								<button className="btn btn-icon edit" onClick={resetFilter}>
									<SyncOutlined />
								</button>
							</Tooltip>
						}
					>
						<div className="row mb-3">
							{/**  PHÂN LOẠI  */}
							<div className="col-md-12 col-12 mt-3">
								<div className="item-select">
									<Select
										className="style-input"
										placeholder="Phân loại"
										value={valueFilter}
										style={{ width: '100%' }}
										onChange={(value, option) => handleSelect_Filter(value)}
									>
										<Option value={0}>Tất cả</Option>
										<Option value={1}>Đề hẹn test</Option>
										<Option value={2}>Đề bán</Option>
										<Option value={3}>Đề Kiểm tra</Option>
									</Select>
								</div>
							</div>
						</div>
						{showFilter && (
							<div className="row">
								{/** CHỌN CHƯƠNG TRÌNH */}
								<div className="col-md-6 col-12 ">
									<div className="item-select">
										<Select
											className="style-input"
											placeholder="Chọn chương trình"
											value={valueProgram}
											style={{ width: '100%' }}
											onChange={(value, option) => handleSelect_Program(value)}
										>
											{dataProgram?.map((item, index) => (
												<Option key={index} value={item.value}>
													{item.title}
												</Option>
											))}
										</Select>
									</div>
								</div>
								{/** CHỌN Giáo trình */}
								<div className="col-md-6 col-12 ">
									<div className="item-select">
										<Select
											loading={loadingSelect}
											className="style-input"
											placeholder="Chọn giáo trình"
											value={valueCurriculum}
											style={{ width: '100%' }}
											onChange={(value, option) => handleSelect_Curriculum(value)}
										>
											{dataCurriculum?.map((item, index) => (
												<Option key={index} value={item.value}>
													{item.title}
												</Option>
											))}
										</Select>
									</div>
								</div>

								{/** CHỌN DẠNG ĐỀ  */}
								{/* <div className="col-md-10 col-10 mt-3">
									<div className="item-select">
										<Select
											className="style-input"
											placeholder="Chọn dạng đề"
											value={valueTypeExam}
											style={{ width: '100%' }}
											onChange={(value, option) => handleSelect_Type(value)}
										>
											<Option value={2}>Đề bán</Option>
											<Option value={3}>Đề kiểm tra</Option>
										</Select>
									</div>
								</div> */}
								{/* <div className="col-md-2 col-2 mt-3 d-flex align-items-center">
									<Tooltip title="Reset">
										<button className="btn btn-icon edit" onClick={resetFilter}>
											<SyncOutlined />
										</button>
									</Tooltip>
								</div> */}
							</div>
						)}
					</Card>
				</div>
			</div>
		</div>
	);
};
ExamList.layout = LayoutBase;
export default ExamList;
