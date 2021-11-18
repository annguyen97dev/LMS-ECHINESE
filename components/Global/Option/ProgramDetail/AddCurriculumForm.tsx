import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Select, Upload, message, Input, Radio, Spin, Tooltip, Checkbox } from 'antd';
import { PlusOutlined, UndoOutlined, UploadOutlined } from '@ant-design/icons';
import { RotateCcw } from 'react-feather';
import { useWrap } from '~/context/wrap';
import { curriculumDetailApi, examTopicApi } from '~/apiBase';
import { lessonDetailApi } from '~/apiBase/options/lesson-detail';
import CurriculumDetail from './CurriculumDetail';
import { useRouter } from 'next/router';

export const AddCurriculumForm = (props) => {
	const { curriculumDetailID, dataExamTopic, dataCurriculumDetail, onFetchData, callFrom, callBack, dataRow } = props;
	const router = useRouter();

	const [visible, setVisible] = useState(false);
	const [isExamRadio, setIsExamRadio] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [modalText, setModalText] = useState('Content of the modal');
	const [status, setStatus] = useState(false);
	const [showListUploadDoc, setShowListUploadDoc] = useState(false);
	const [showListUploadHtml, setShowListUploadHtml] = useState(false);
	const [fileListDoc, setFileListDoc] = useState([]);
	const [fileListHtml, setFileListHtml] = useState([]);
	const [loadingUpload, setLoadingUpload] = useState(false);
	const [lesson, setLesson] = useState({
		Content: '',
		CurriculumDetailID: curriculumDetailID,
		LinkVideo: '',
		LinkDocument: '',
		LinkHtml: '',
		Description: '',
		ExamTopicID: 21,
		IsPreview: false
	});
	const [exam, setExam] = useState({
		ID: curriculumDetailID,
		SubjectID: 25, //int:mã môn học (Nhập 0 nếu xóa Subject)
		IsExam: true,
		ExamTopicID: 1
	});

	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [form] = Form.useForm();
	const { showNoti } = useWrap();
	const { Option } = Select;
	const { TextArea } = Input;

	const onChangeIsExamRadio = (e) => {
		setIsExamRadio(e.target.value);
	};

	const showModal = () => {
		setVisible(true);
	};

	const handleSelectStatus = (value) => {
		console.log(value);
		value === 'Kiểm tra' ? setStatus(true) : setStatus(false);
	};

	const handleOk = () => {
		setModalText('The modal will be closed after two seconds');
		setConfirmLoading(true);
		setTimeout(() => {
			setVisible(false);
			setConfirmLoading(false);
		}, 2000);
	};

	const handleCancel = () => {
		console.log('Clicked cancel button');
		setVisible(false);
	};

	const _onSubmit = async (dataSubmit: any) => {
		console.log('Data Submit: ', dataSubmit);
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});

		let res = null;

		if (status) {
			try {
				res = await curriculumDetailApi.update(exam);

				if (res.status == 200) {
					// setDataSource(newDataSource);
					// getDataSubject();
					showNoti('success', res.data.message);
					form.resetFields();
					setVisible(false);
					onFetchData && onFetchData();
				}
			} catch (error) {
				console.log('error: ', error);
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false
				});
			}
		} else {
			try {
				res = await lessonDetailApi.add(lesson);
				if (res.status == 200) {
					showNoti('success', res.data.message);
					form.resetFields();
					setVisible(false);
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false
				});
			}
		}

		if (callFrom === 'modal') {
			callBack(true);
		}

		return res;
	};

	const propsLinkDocument = {
		showUploadList: showListUploadDoc,
		async onChange(info) {
			console.log('File: ', info.file.originFileObj);
			if (info.file.status === 'uploading') {
				setLoadingUpload(true);
				return;
			}
			setLoadingUpload(true);
			try {
				let res = await lessonDetailApi.UploadDocument(info.file.originFileObj);
				if (res.status == 200) {
					console.log(res.data.data);
					setLesson({ ...lesson, LinkDocument: res.data.data });
					showNoti('success', 'Upload file thành công');
					setShowListUploadDoc(true);
				}
			} catch (error) {
				showNoti('danger', error.message);
				setShowListUploadDoc(false);
			} finally {
				setLoadingUpload(false);
			}
		}
	};

	const propsLinkHtml = {
		// showUploadList: showListUploadHtml,
		async onchange(info) {
			if (info.file.status === 'uploading') {
				setLoadingUpload(true);
				return;
			}
			setLoadingUpload(true);
			try {
				let res = await lessonDetailApi.UploadHtml(info.file.originFileObj);
				if (res.status == 200) {
					console.log(res.data.data);
					setLesson({ ...lesson, LinkHtml: res.data.data });
					showNoti('success', 'Upload file thành công');
					setShowListUploadHtml(true);
				}
			} catch (error) {
				console.log(error);
				showNoti('danger', error.message);
				setShowListUploadHtml(false);
			} finally {
				setLoadingUpload(false);
			}
		}
	};

	const onChangeUploadLinkDocument = async (info) => {
		setShowListUploadDoc(false);
		if (info.file.status === 'uploading') {
			setLoadingUpload(true);
			return;
		}
		setLoadingUpload(true);
		try {
			let res = await lessonDetailApi.UploadDocument(info.file.originFileObj);
			if (res.status == 200) {
				console.log(res.data.data);
				setLesson({ ...lesson, LinkDocument: res.data.data });
				showNoti('success', 'Upload file thành công');
				setShowListUploadDoc(true);
			}
		} catch (error) {
			console.log(error);
			showNoti('danger', error.message);
			setShowListUploadDoc(false);
		} finally {
			setLoadingUpload(false);
		}
	};

	const onChangeUploadLinkHTML = async (info) => {
		setShowListUploadHtml(false);

		if (info.file.status === 'uploading') {
			setLoadingUpload(true);
			return;
		}
		try {
			let res = await lessonDetailApi.UploadHtml(info.file.originFileObj);
			setLesson({ ...lesson, LinkHtml: res.data.data });
			showNoti('success', 'Upload file thành công');
			setShowListUploadHtml(true);
		} catch (error) {
			showNoti('danger', error.message);
			setShowListUploadHtml(false);
		} finally {
			setLoadingUpload(false);
		}
	};

	return (
		<>
			<button className="btn btn-icon edit" onClick={showModal}>
				{callFrom === 'main' ? (
					<Tooltip title="Cập nhật">
						<RotateCcw />
					</Tooltip>
				) : callFrom === 'modal' ? (
					<Tooltip title="Thêm mới">
						<button
							onClick={() => {
								callBack(false);
							}}
							className="btn btn-success"
							style={{ marginRight: -5 }}
						>
							<i className="far fa-plus-circle mr-2"></i>Thêm mới
						</button>
					</Tooltip>
				) : (
					<Tooltip title="Cập nhật">
						<RotateCcw />
					</Tooltip>
				)}
			</button>

			<Modal
				title={!status ? 'Thêm nội dung bài học' : 'Thêm nội dung kiểm tra'}
				visible={visible}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={false}
			>
				<div className="container-fluid">
					<div className="row mb-4">
						<div className="col-12">
							<Select
								disabled={false}
								style={{ width: '100%' }}
								className="style-input"
								showSearch
								optionFilterProp="children"
								defaultValue="Buổi học"
								onChange={handleSelectStatus}
							>
								<Option value={'Buổi học'}>Buổi học</Option>
								<Option value={'Kiểm tra'}>Kiểm tra</Option>
							</Select>
						</div>
					</div>
					<Form form={form} onFinish={_onSubmit} layout="vertical">
						{/* Body start */}
						{!status ? (
							<div className="lesson-adding">
								<div className="row">
									<div className="col-12">
										<Form.Item label="Giáo trình" name="CurriculumDetailID">
											<Select
												disabled={true}
												style={{ width: '100%' }}
												className="style-input"
												showSearch
												optionFilterProp="children"
												defaultValue={curriculumDetailID}
												onChange={handleSelectStatus}
											>
												{dataCurriculumDetail?.map((item, index) => (
													<Option value={item.ID} key={index}>
														{item.CurriculumName}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
									<div className="col-12">
										<Form.Item label="Nội dung" name="Content">
											<Input
												placeholder=""
												className="style-input"
												onChange={(e) => {
													setLesson({ ...lesson, Content: e.target.value });
												}}
											/>
										</Form.Item>
									</div>
									<div className="col-md-6 col-12">
										<Form.Item label="Link video" name="LinkVideo">
											<Input
												placeholder="Thêm link video"
												className="style-input"
												onChange={(e) => {
													setLesson({ ...lesson, LinkVideo: e.target.value });
												}}
											/>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item label="Link tài liệu" name="LinkDocument">
											<Upload onChange={onChangeUploadLinkDocument} showUploadList={showListUploadDoc} maxCount={1}>
												<Button icon={<UploadOutlined />}>Bấm để tải file</Button>
											</Upload>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item label="Đề thi" name="ExamTopicID">
											<Select
												disabled={false}
												style={{ width: '100%' }}
												className="style-input"
												showSearch
												placeholder="Chọn đề thi"
												optionFilterProp="children"
												onChange={handleSelectStatus}
											>
												{dataExamTopic?.map((item, index) => (
													<Option value={item.ID} key={index}>
														{item.Name}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
									<div className="col-md-6 col-12">
										<Form.Item label="Link HTML" name="LinkHtml">
											<Upload onChange={onChangeUploadLinkHTML} showUploadList={showListUploadHtml} maxCount={1}>
												<Button icon={<UploadOutlined />}>Bấm để tải file</Button>
											</Upload>
										</Form.Item>
									</div>
								</div>
								<div className="row">
									<div className="col-12">
										<Form.Item label="" name="isPreview">
											<Checkbox onChange={(e) => setLesson({ ...lesson, IsPreview: e.target.checked })}>
												Cho xem trước video
											</Checkbox>
										</Form.Item>
									</div>
								</div>
								<div className="row">
									<div className="col-12">
										<Form.Item label="Ghi chú" name="Notice">
											<TextArea
												rows={4}
												placeholder=""
												onChange={(e) => {
													setLesson({ ...lesson, Description: e.target.value });
												}}
											/>
										</Form.Item>
									</div>
								</div>
							</div>
						) : (
							<div className="exam-adding">
								<div className="row">
									<div className="col-12">
										<Form.Item label="Đề kiểm tra" name="ExamTopicID">
											<Select
												disabled={false}
												style={{ width: '100%' }}
												className="style-input"
												showSearch
												optionFilterProp="children"
												placeholder="Chọn đề kiểm tra"
												onChange={(value) => {
													console.log(value);
													setExam({ ...exam, ExamTopicID: Number(value) });
												}}
											>
												{dataExamTopic?.map((item, index) => (
													<Option value={item.ID} key={index}>
														{item.Name}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
								</div>
							</div>
						)}

						{/* Body end */}
						<div className="row ">
							<div className="col-12 mt-3">
								<button type="submit" className="btn btn-primary w-100">
									Lưu {isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};

export default AddCurriculumForm;
