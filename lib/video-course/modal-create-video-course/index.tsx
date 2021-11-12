import React, { useState } from 'react';
import { Modal, Form, Input, Spin, Tooltip, Select, Upload, Button } from 'antd';
import { RotateCcw } from 'react-feather';
import { useForm } from 'react-hook-form';
import { UploadOutlined, PaperClipOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useWrap } from '~/context/wrap';
import { newsFeedApi } from '~/apiBase';

const ModalCreateVideoCourse = React.memo((props: any) => {
	const { TextArea } = Input;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { isLoading, _onSubmit, _onSubmitEdit, programID, dataLevel, dataCategory, dataCurriculum, rowData } = props;
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

	React.useEffect(() => {
		if (!isModalVisible) {
			setVideoCourseName('');
			setOriginalPrice('');
			setSellPrice('');
			setImageSelected({ name: '' });
			form.setFieldsValue({ Name: '', OriginalPrice: '', SellPrice: '', Type: '', Level: '', Description: '', Image: '' });
		}
	}, [isModalVisible]);

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

	// RENDER
	return (
		<>
			<div className="container-fluid">
				{programID ? (
					<button
						className="btn btn-icon edit"
						onClick={() => {
							setIsModalVisible(true);
						}}
					>
						<Tooltip title="Cập nhật">
							<RotateCcw />
						</Tooltip>
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
											label="Loại"
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
											label=" "
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
											label="Cấp độ"
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
