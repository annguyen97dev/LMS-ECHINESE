import React, { useState } from 'react';
import { Modal, Form, Input, Spin, Tooltip, Select, Upload, Button } from 'antd';
import { RotateCcw } from 'react-feather';
import { useForm } from 'react-hook-form';
import { UploadOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useWrap } from '~/context/wrap';
import { VideoCourseCategoryApi } from '~/apiBase/video-course-store/category';
import { VideoCourseLevelApi } from '~/apiBase/video-course-store/level';
import { newsFeedApi } from '~/apiBase';

const ModalCreateVideoCourse = React.memo((props: any) => {
	const { TextArea } = Input;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { isLoading, _onSubmit, _onSubmitEdit, programID, dataLevel, dataCategory, dataCurriculum, rowData, refeshData } = props;
	const [form] = Form.useForm();
	const { Option } = Select;
	const [category, setCategory] = useState(0);
	const [level, setLevel] = useState(0);
	const [curriculumID, setCurriculumID] = useState(0);
	const [videoCourseName, setVideoCourseName] = useState('');
	const [originalPrice, setOriginalPrice] = useState('');
	const [sellPrice, setSellPrice] = useState('');
	const [tagArray, setTagArray] = useState('');
	const [imageSelected, setImageSelected] = useState({ name: '' });

	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm();

	const [loading, setLoading] = useState(false);
	const { showNoti } = useWrap();

	// HANDLE SUBMIT
	const onSubmit = handleSubmit(() => {
		if (!programID) {
			_onSubmit({
				CurriculumID: curriculumID,
				CategoryID: category,
				LevelID: level,
				VideoCourseName: videoCourseName,
				OriginalPrice: originalPrice,
				SellPrice: sellPrice,
				TagArray: tagArray
			});
			form.setFieldsValue({ Name: '', OriginalPrice: '', SellPrice: '', Type: '', Level: '', Description: '' });
			setIsModalVisible(false);
		} else {
			if (imageSelected.name === '') {
				_onSubmitEdit({
					ID: rowData.ID,
					CurriculumID: curriculumID,
					CategoryID: category,
					LevelID: level,
					VideoCourseName: videoCourseName,
					OriginalPrice: originalPrice,
					SellPrice: sellPrice,
					TagArray: tagArray,
					ImageThumbnails: ''
				});
				setIsModalVisible(false);
			} else {
				uploadFile(imageSelected);
			}
		}
	});

	// IS VISIBLE MODAL
	React.useEffect(() => {
		if (isModalVisible) {
			if (programID) {
				setVideoCourseName(rowData.VideoCourseName);
				setOriginalPrice(rowData.OriginalPrice);
				setSellPrice(rowData.SellPrice);
				form.setFieldsValue({ Name: rowData.VideoCourseName, OriginalPrice: rowData.OriginalPrice, SellPrice: rowData.SellPrice });
			}
		}
	}, [isModalVisible]);

	// on change isModalVisible
	React.useEffect(() => {
		if (!isModalVisible) {
			setVideoCourseName('');
			setOriginalPrice('');
			setSellPrice('');
			setImageSelected({ name: '' });
			form.setFieldsValue({ Name: '', OriginalPrice: '', SellPrice: '', Type: '', Level: '', Description: '', Image: '' });
		}
	}, [isModalVisible]);

	// Call api upload image
	const uploadFile = async (file) => {
		setLoading(true);
		try {
			let res = await newsFeedApi.uploadFile(file.originFileObj);
			if (res.status == 200) {
				_onSubmitEdit({
					ID: rowData.ID,
					CurriculumID: curriculumID,
					CategoryID: category,
					LevelID: level,
					VideoCourseName: videoCourseName,
					OriginalPrice: originalPrice,
					SellPrice: sellPrice,
					TagArray: tagArray,
					ImageThumbnails: res.data.data
				});
				setIsModalVisible(false);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoading(false);
		}
	};

	// Upload file audio
	const handleUploadFile = async (info) => {
		setImageSelected(info.file);
	};

	const [modalCate, setModalCate] = useState(false);
	const [modalLevel, setModalLevel] = useState(false);
	const [newType, setNewType] = useState('');
	const [newLevel, setNewLevel] = useState('');

	const createType = async () => {
		setLoading(true);
		try {
			const res = await VideoCourseCategoryApi.add({ CategoryName: newType, Enable: 'True' });
			res.status == 200 && (setModalCate(false), setIsModalVisible(true), refeshData());
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	const createLevel = async () => {
		setLoading(true);
		try {
			const res = await VideoCourseLevelApi.add({ LevelName: newLevel, Enable: 'True' });
			res.status == 200 && (setModalCate(false), setIsModalVisible(true), refeshData());
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	// RENDER
	return (
		<>
			<div className="ml-3 mr-3 mb-3 mt-1">
				{programID ? (
					<button type="button" className=" btn btn-warning" style={{ width: '100%' }} onClick={() => setIsModalVisible(true)}>
						Chỉnh sửa
					</button>
				) : (
					<button
						className="btn btn-warning add-new"
						onClick={() => {
							setIsModalVisible(true);
						}}
					>
						Thêm mới
					</button>
				)}

				<Modal
					confirmLoading={loading}
					title="Thêm loại"
					width={400}
					visible={modalCate}
					onCancel={() => (setModalCate(false), setIsModalVisible(true))}
					onOk={() => createType()}
				>
					<Form form={form} layout="vertical" onFinish={() => createType()}>
						<div className="col-md-12 col-12">
							<Form.Item name="TypeName" label="Tên loại" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
								<Input
									placeholder=""
									className="style-input"
									defaultValue={newType}
									value={newType}
									onChange={(e) => setNewType(e.target.value)}
								/>
							</Form.Item>
						</div>
					</Form>
				</Modal>
				<Modal
					confirmLoading={loading}
					title="Thêm cấp độ"
					width={400}
					visible={modalLevel}
					onCancel={() => (setModalLevel(false), setIsModalVisible(true))}
					onOk={() => createLevel()}
				>
					<Form form={form} layout="vertical" onFinish={() => createLevel()}>
						<div className="col-md-12 col-12">
							<Form.Item name="LevelName" label="Tên cấp độ" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
								<Input
									placeholder=""
									className="style-input"
									defaultValue={newType}
									value={newType}
									onChange={(e) => setNewLevel(e.target.value)}
								/>
							</Form.Item>
						</div>
					</Form>
				</Modal>

				<Modal
					title={`${programID ? 'Sửa' : 'Tạo'} khoá học`}
					visible={isModalVisible}
					onCancel={() => setIsModalVisible(false)}
					footer={null}
				>
					<div className="container-fluid">
						<Form form={form} layout="vertical" onFinish={() => onSubmit()}>
							<div className="row">
								<div className="col-md-6 col-12">
									<Form.Item
										name="Name"
										label="Tên khóa học"
										rules={[{ required: true, message: 'Bạn không được để trống' }]}
									>
										<Input
											placeholder=""
											className="style-input"
											defaultValue={videoCourseName}
											value={videoCourseName}
											onChange={(e) => setVideoCourseName(e.target.value)}
										/>
									</Form.Item>
								</div>

								{programID && (
									<div className="col-md-6 col-12">
										<Form.Item name="Image" label="Hình ảnh thu nhỏ">
											<Upload
												style={{ width: 800 }}
												className="vc-e-upload"
												onChange={(e) => handleUploadFile(e)}
												showUploadList={false}
											>
												<Button className="vc-e-upload" icon={<UploadOutlined style={{ marginTop: -2 }} />}>
													Bấm để tải hình ảnh
												</Button>
											</Upload>

											{imageSelected.name !== undefined && imageSelected.name !== '' && (
												<div className="row m-0 mt-3 vc-store-center">
													<PaperClipOutlined />
													<span>...{imageSelected.name.slice(-20, imageSelected.name.length)}</span>
												</div>
											)}
										</Form.Item>
									</div>
								)}

								{!programID && (
									<div className="col-md-6 col-12">
										<Form.Item
											label={
												<div className="row m-0">
													Loại{' '}
													<Tooltip title="Thêm loại mới">
														<button
															onClick={() => (setModalCate(true), setIsModalVisible(false))}
															className="btn btn-primary btn-vc-create ml-1"
														>
															<div style={{ marginTop: -2 }}>+</div>
														</button>
													</Tooltip>
												</div>
											}
											name="Type"
											rules={[{ required: true, message: 'Bạn không được để trống' }]}
										>
											<Select
												style={{ width: '100%' }}
												className="style-input"
												showSearch
												aria-selected
												placeholder="Chọn loại..."
												optionFilterProp="children"
												onChange={(e: number) => setCategory(e)}
											>
												{dataCategory.map((item, index) => (
													<Option key={index} value={item.ID}>
														{item.CategoryName}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
								)}

								{!programID && (
									<div className="col-md-6 col-12">
										<Form.Item
											name="Curriculum"
											label=" " // CHỔ NÀY BÙA ĐỀ HIỆN CÁI TOOLTIP. XÓA KHOẢN TRẮNG MẤT LUÔN TOOLTIP
											tooltip={{
												title: 'Chỉ hiển thị giáo trình có video',
												icon: (
													<div className="row ">
														<span className="mr-1 mt-3" style={{ color: '#000' }}>
															Giáo trình
														</span>
														<i className="fas fa-question-circle"></i>
													</div>
												)
											}}
											rules={[{ required: true, message: 'Bạn không được để trống' }]}
										>
											<Select
												style={{ width: '100%' }}
												className="style-input"
												showSearch
												aria-selected
												placeholder="Chọn loại..."
												optionFilterProp="children"
												onChange={(e: number) => setCurriculumID(e)}
											>
												{dataCurriculum.map((item, index) => (
													<Option key={index} value={item.ID}>
														{item.CurriculumName}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
								)}

								{!programID && (
									<div className="col-md-6 col-12">
										<Form.Item
											name="Level"
											label={
												<div className="row m-0">
													Cấp độ{' '}
													<Tooltip title="Thêm cấp độ mới">
														<button
															onClick={() => (setModalLevel(true), setIsModalVisible(false))}
															className="btn btn-primary btn-vc-create ml-1"
														>
															<div style={{ marginTop: -2 }}>+</div>
														</button>
													</Tooltip>
												</div>
											}
											rules={[{ required: true, message: 'Bạn không được để trống' }]}
										>
											<Select
												style={{ width: '100%' }}
												className="style-input"
												showSearch
												placeholder="Chọn cấp độ..."
												optionFilterProp="children"
												onChange={(e: number) => setLevel(e)}
											>
												{dataLevel.map((item, index) => (
													<Option key={index} value={item.ID}>
														{item.LevelName}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
								)}

								<div className="col-md-6 col-12">
									<Form.Item
										name="OriginalPrice"
										label="Giá gốc"
										rules={[{ required: true, message: 'Bạn không được để trống' }]}
									>
										<Input
											placeholder=""
											className="style-input"
											value={originalPrice}
											type="number"
											onChange={(e) => setOriginalPrice(e.target.value)}
										/>
									</Form.Item>
								</div>

								<div className="col-md-6 col-12">
									<Form.Item
										name="SellPrice"
										label="Giá bán"
										rules={[{ required: true, message: 'Bạn không được để trống' }]}
									>
										<Input
											placeholder=""
											className="style-input"
											type="number"
											value={sellPrice}
											onChange={(e) => setSellPrice(e.target.value)}
										/>
									</Form.Item>
								</div>

								{!programID && (
									<div className="col-12">
										<Form.Item
											name="Description"
											label="Tags"
											rules={[{ required: true, message: 'Bạn không được để trống' }]}
										>
											<TextArea
												rows={4}
												placeholder=""
												value={tagArray}
												onChange={(e) => setTagArray(e.target.value)}
											/>
										</Form.Item>
									</div>
								)}
							</div>
							<div className="row">
								<div className="col-12" style={{ justifyContent: 'flex-end', display: 'flex' }}>
									<button onClick={() => setIsModalVisible(false)} className="btn btn-warning mr-3">
										Huỷ
									</button>
									{loading ? (
										<div className="btn btn-primary">
											Lưu
											<Spin className="loading-base" />
										</div>
									) : (
										<button type="submit" className="btn btn-primary">
											Lưu
											{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
										</button>
									)}
								</div>
							</div>
						</Form>
					</div>
				</Modal>
			</div>
		</>
	);
});

export default ModalCreateVideoCourse;
