import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Modal, Input, Tooltip, List, Form, Upload, Button, Spin, Select } from 'antd';
import { Info } from 'react-feather';
import { LessonDetail } from '~/apiBase/curriculum-detais';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { lessonDetailApi } from '~/apiBase/options/lesson-detail';
import { useWrap } from '~/context/wrap';
import AddCurriculumForm from './AddCurriculumForm';
import { useRouter } from 'next/router';

const { Option } = Select;
let currentItem: string = '';
const { confirm } = Modal;

export const DetailsModal = (props) => {
	const router = useRouter();
	const { curriculumDetailID, courseID, dataExamTopic, dataCurriculumDetail, dataRow } = props;

	const { showNoti, isAdmin } = useWrap();
	const { TextArea } = Input;

	const [visible, setVisible] = useState(false);
	const [data, setData] = useState([]);
	const [enableEdit, setEdit] = useState(false);
	const [showListUploadHtml, setShowListUploadHtml] = useState(false);
	const [showListUploadDoc, setShowListUploadDoc] = useState(false);

	const [showList, setShowList] = useState(true);
	const [size, setSize] = useState([0, 0]);

	const [isLoading, setLoading] = useState(true);

	// DATA OF SELECTED LIST ITEM
	const [selected, dispatch] = React.useReducer(
		(prevState, action) => {
			switch (action.type) {
				case 'ID':
					return {
						...prevState,
						ID: action.data
					};
				case 'LinkVideo':
					return {
						...prevState,
						LinkVideo: action.data
					};
				case 'LinkDocument':
					return {
						...prevState,
						LinkDocument: action.data
					};
				case 'LinkHtml':
					return {
						...prevState,
						LinkHtml: action.data
					};
				case 'SecondVideo':
					return {
						...prevState,
						SecondVideo: action.data
					};
				case 'Content':
					return {
						...prevState,
						Content: action.data
					};
				case 'MinuteVideo':
					return {
						...prevState,
						MinuteVideo: action.data
					};
				case 'ExamTopicID':
					return {
						...prevState,
						ExamTopicID: action.data
					};
				case 'ExamTopicName':
					return {
						...prevState,
						ExamTopicName: action.data
					};
				case 'Description':
					return {
						...prevState,
						Description: action.data
					};
				case 'CurriculumDetailID':
					return {
						...prevState,
						CurriculumDetailID: action.data
					};
			}
		},
		{
			ID: '',
			LinkVideo: '',
			LinkDocument: '',
			LinkHtml: '',
			SecondVideo: '',
			Content: '',
			MinuteVideo: 0,
			ExamTopicID: 0,
			ExamTopicName: '',
			Description: '',
			CurriculumDetailID: null
		}
	);

	useEffect(() => {
		console.log('selected: ', selected);
	}, [selected]);

	// INIT DATA AFTER GET FROM API
	useEffect(() => {
		if (data && data.length !== 0) {
			setSelectItem(data[0]);
		}
	}, [data]);

	useLayoutEffect(() => {
		function updateSize() {
			setSize([window.innerWidth, window.innerHeight]);
		}
		window.addEventListener('resize', updateSize);
		updateSize();
		return () => window.removeEventListener('resize', updateSize);
	}, []);

	const [marginTop, setMarginTop] = useState(15);

	useEffect(() => {
		if (size[0] > 800) {
			setShowList(false);
		} else {
			setShowList(true);
			if (size[0] > 470) {
				setMarginTop(8);
			} else {
				setMarginTop(15);
			}
		}
	}, [size]);

	//GET DATA
	const getDetails = async () => {
		setLoading(true);
		try {
			const res = await LessonDetail.getAll(curriculumDetailID);
			//@ts-ignore
			res.status == 200 && setData(res.data.data);
		} catch (err) {
			console.log(err);
		}
		setLoading(false);
	};

	//POST EDIT DATA
	const postUpdate = async (data: {}) => {
		setLoading(true);
		try {
			await LessonDetail.update(data);
			getDetails();
		} catch (err) {
			console.log(err);
			getDetails();
		}
	};

	const showConfirm = (param, ID) => {
		confirm({
			title: 'Xóa dữ liệu',
			icon: <ExclamationCircleOutlined />,
			content: `Bạn thật sự muốn xóa "${param}"?`,
			onOk() {
				handleDelete(ID);
			},
			onCancel() {
				console.log('Cancel');
			}
		});
	};

	const handleUpdate = async () => {
		setLoading(true);
		let temp = {
			ID: selected.ID,
			Content: selected.Content,
			LinkVideo: selected.LinkVideo,
			MinuteVideo: selected.MinuteVideo,
			LinkDocument: selected.LinkDocument,
			LinkHtml: selected.LinkHtml,
			Description: selected.Description,
			ExamTopicID: selected.ExamTopicID,
			Enable: true
		};
		await postUpdate(temp);
	};

	const handleDelete = async (ID) => {
		setLoading(true);
		let temp = await {
			ID: ID,
			Enable: false
		};
		await postUpdate(temp);
	};

	// SHOW MODAL
	const showModal = () => {
		getDetails();
		setVisible(true);
	};

	// CLOSE MODAL
	const handleCancel = () => {
		setVisible(false);
	};

	const setSelectItem = (param) => {
		currentItem = param.ID;
		dispatch({ type: 'ID', data: param.ID });
		dispatch({ type: 'LinkVideo', data: param.LinkVideo });
		dispatch({ type: 'LinkDocument', data: param.LinkDocument });
		dispatch({ type: 'LinkHtml', data: param.LinkHtml });
		dispatch({ type: 'SecondVideo', data: param.SecondVideo });
		dispatch({ type: 'Content', data: param.Content });
		dispatch({ type: 'MinuteVideo', data: param.MinuteVideo });
		dispatch({ type: 'ExamTopicID', data: param.ExamTopicID });
		dispatch({ type: 'ExamTopicName', data: param.ExamTopicName });
		dispatch({ type: 'Description', data: param.Description });
		dispatch({ type: 'CurriculumDetailID', data: param.CurriculumDetailID });
	};

	const onChangeUploadLinkDocument = async (info) => {
		setShowListUploadDoc(false);

		if (info.file.status === 'uploading') {
			return;
		}

		try {
			let res = await lessonDetailApi.UploadDocument(info.file.originFileObj);
			if (res.status == 200) {
				dispatch({
					type: 'LinkDocument',
					data: res.data.data
				});
				showNoti('success', 'Upload file thành công');
				setShowListUploadDoc(true);
			}
		} catch (error) {
			console.log(error);
			showNoti('danger', error.message);
			setShowListUploadDoc(false);
		}
	};

	const onChangeUploadLinkHTML = async (info) => {
		setShowListUploadHtml(false);

		if (info.file.status === 'uploading') {
			return;
		}

		try {
			let res = await lessonDetailApi.UploadHtml(info.file.originFileObj);
			dispatch({
				type: 'LinkHtml',
				data: res.data.data
			});
			showNoti('success', 'Upload file thành công');
			setShowListUploadHtml(true);
		} catch (error) {
			showNoti('danger', error.message);
			setShowListUploadHtml(false);
		}
	};

	// ITEM LIST
	const RenderItem = ({ item }) => {
		return (
			<div
				onClick={() => {
					setSelectItem(item);
				}}
				className="pr-3 pl-3 pt-3 pb-3 row m-0 modal-curriculum-item none-selection"
				style={{
					background: item.ID === currentItem ? '#ffc105  ' : data.indexOf(item) % 2 !== 0 ? '#fff' : '#e1f6e1'
				}}
			>
				<div className="row m-0">{item.Content !== '' ? item.Content : 'Không có tiêu đề'}</div>

				<i onClick={() => showConfirm(item.Content, item.ID)} className="far fa-trash-alt mr-2 ic-trash"></i>
			</div>
		);
	};

	const moveToTest = (data) => {
		router.push({
			pathname: '/exam/exam-review',
			query: {
				examID: data.ExamTopicID,
				packageDetailID: courseID,
				type: 'check', // Kiểm tra,
				CurriculumDetailID: data.CurriculumDetailID
			}
		});
	};

	useEffect(() => {
		console.log('dataExam: ', dataExamTopic);
	}, [dataExamTopic]);

	// RENDER
	return (
		<>
			<button className="btn btn-icon" onClick={showModal}>
				<Tooltip title="Xem thông tin">
					<Info />
				</Tooltip>
			</button>
			<Modal title="Thông tin chương trình dạy" visible={visible} onCancel={handleCancel} footer={false} width={1200}>
				<div className="wrap-modal-curriculum ">
					<div className="row container">
						{/* {isLoading && (
							<div style={{ padding: '20px' }}>
								<Skeleton />
							</div>
						)} */}
						<div className="list">
							<List
								loading={isLoading}
								itemLayout="horizontal"
								dataSource={data}
								renderItem={(item) => <RenderItem item={item} />}
							/>
						</div>

						{showList && (
							<div onClick={() => setShowList(false)} className="list-2">
								<List itemLayout="horizontal" dataSource={data} renderItem={(item) => <RenderItem item={item} />} />
							</div>
						)}

						{
							<div className="p-4 details">
								{isAdmin && !enableEdit && (
									<div className="group-button">
										<div className="group-button_btn-add">
											<AddCurriculumForm
												callBack={(e) => {
													setVisible(e);

													if (e) {
														getDetails();
													}
												}}
												callFrom="modal"
												curriculumDetailID={curriculumDetailID}
												dataExamTopic={dataExamTopic}
												dataCurriculumDetail={dataCurriculumDetail}
												dataRow={dataRow}
											/>
										</div>
									</div>
								)}
								{!showList && (
									<Spin spinning={isLoading}>
										{/* <Skeleton loading={isLoading}> */}
										{/* {data.length !== 0 && (
											<div className="row p-0 m-0 mt-2 mb-3 edit-details">
												{enableEdit && (
													<Tooltip className="group-button_btn-add mt-1" title="Hủy bỏ">
														<button
															onClick={() => {
																setEdit(false);
															}}
															className="btn mb-2 btn-primary"
														>
															<i className="far fa-times-circle mr-2"></i>Hủy
														</button>
													</Tooltip>
												)}
											</div>
										)} */}
										{data.length !== 0 ? (
											<div className="mt-2">
												<div className="row p-0 m-0  hide-if-800">
													<Tooltip title="Hiển thị danh sách">
														<button
															onClick={() => {
																setShowList(true);
															}}
															className="btn mb-3 btn-light"
														>
															<i className="far fa-list-alt mr-2"></i>Danh sách
														</button>
													</Tooltip>
												</div>

												<Input
													className="item-info"
													prefix="Nội dung:"
													value={selected.Content}
													disabled={!enableEdit}
													onChange={(p) => {
														dispatch({ type: 'Content', data: p.target.value });
													}}
												/>

												<Input
													className="item-info"
													prefix="Link video:"
													value={selected.LinkVideo}
													disabled={!enableEdit}
													onChange={(p) => {
														dispatch({ type: 'LinkVideo', data: p.target.value });
													}}
												/>

												<div className="row m-0 group-row">
													{!enableEdit ? (
														<Input
															className="item-info"
															prefix="Link document:"
															value={selected.LinkDocument}
															disabled={!enableEdit}
															onChange={(p) => {
																dispatch({
																	type: 'LinkDocument',
																	data: p.target.value
																});
															}}
														/>
													) : (
														<Form.Item className="mr-3">
															<Upload
																onChange={onChangeUploadLinkDocument}
																showUploadList={showListUploadDoc}
																maxCount={1}
															>
																<Button className="item-info item-info__Upload" icon={<UploadOutlined />}>
																	Bấm để tải lên tài liệu
																</Button>
															</Upload>
														</Form.Item>
													)}

													{!enableEdit ? (
														<Input
															className="item-info"
															prefix="Link html:"
															value={selected.LinkHtml}
															disabled={!enableEdit}
															onChange={(p) => {
																dispatch({
																	type: 'LinkHtml',
																	data: p.target.value
																});
															}}
														/>
													) : (
														<Form.Item>
															<Upload
																onChange={onChangeUploadLinkHTML}
																showUploadList={showListUploadHtml}
																maxCount={1}
															>
																<Button className="item-info item-info__Upload" icon={<UploadOutlined />}>
																	Bấm để tải lên file html
																</Button>
															</Upload>
														</Form.Item>
													)}

													{/* 81361 123761278361826371783127   1783 17823 7812 78 78 72 71637812683617817 78132 73781267317 */}

													{!enableEdit ? (
														<Input
															className="item-info"
															prefix="Đề kiểm tra:"
															value={selected.ExamTopicName}
															disabled={!enableEdit}
														/>
													) : (
														<Select
															defaultValue={
																selected.ExamTopicID !== null
																	? `${selected.ExamTopicName}`
																	: 'Chọn đề kiểm tra'
															}
															//@ts-ignore
															onChange={(e, a) => dispatch({ type: 'ExamTopicID', data: a.key })}
															className="ml-3 select"
														>
															{dataExamTopic.map((item, index) => {
																return (
																	<Option value={item.Name} key={item.ID}>
																		{item.Name}
																	</Option>
																);
															})}
														</Select>
													)}
												</div>

												<Form.Item>
													<p style={{ color: !enableEdit ? 'rgba(0, 0, 0, 0.7)' : '#000' }}>Ghi chú</p>
													<TextArea
														rows={4}
														placeholder=""
														value={selected.Description}
														onChange={(p) => {
															dispatch({
																type: 'Description',
																data: p.target.value
															});
														}}
														disabled={!enableEdit}
													/>
												</Form.Item>

												<Input
													className="item-info"
													prefix="Tổng thời lượng:"
													value={
														selected.SecondVideo === '' || selected.SecondVideo === undefined
															? 'Không rõ'
															: selected.SecondVideo
													}
													disabled
												/>

												<div className="text-right mt-3">
													<button className="btn btn-secondary" onClick={() => moveToTest(selected)}>
														Làm bài tập
													</button>
													{isAdmin && (
														<Tooltip title="Chỉnh sửa thông tin">
															{size[0] > 470 ? (
																data?.length > 0 &&
																(enableEdit ? (
																	<Tooltip className="group-button_btn-add" title="Hủy bỏ">
																		<button
																			onClick={() => {
																				setEdit(false);
																			}}
																			className="btn ml-2 btn-primary"
																		>
																			<i className="far fa-times-circle mr-2"></i>Hủy
																		</button>
																	</Tooltip>
																) : (
																	<button
																		onClick={() => {
																			setEdit(true);
																		}}
																		className="btn btn-warning"
																		style={{ marginLeft: 11, color: '#fff' }}
																	>
																		<i className="far fa-edit mr-2"></i>Chỉnh sửa
																	</button>
																))
															) : (
																<button
																	onClick={() => {
																		setEdit(true);
																	}}
																	className="btn btn-info"
																	style={{ marginLeft: 11, marginTop: marginTop }}
																>
																	<i className="far fa-edit mr-2"></i>Chỉnh sửa
																</button>
															)}
														</Tooltip>
													)}
													{isAdmin && enableEdit && (
														<Tooltip className="group-button_btn-add" title="Lưu thông tin">
															<button
																onClick={() => {
																	setEdit(false);
																	handleUpdate();
																}}
																className="btn ml-2 btn-success"
															>
																<i className="far fa-save mr-2"></i>Lưu
															</button>
														</Tooltip>
													)}
												</div>
											</div>
										) : (
											<div>{/* <Empty description={false} /> */}</div>
										)}
									</Spin>
								)}
							</div>
						}
					</div>
				</div>
			</Modal>
		</>
	);
};

export default DetailsModal;
