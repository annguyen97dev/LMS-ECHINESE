import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Spin, Tooltip, Select, Upload, Button, Image } from 'antd';
import { useForm } from 'react-hook-form';
import { VideoCourseCategoryApi } from '~/apiBase/video-course-store/category';
import { VideoCourseLevelApi, VideoCuorseTag } from '~/apiBase/video-course-store/level';
import { useWrap } from '~/context/wrap';

import EditorSimple from '~/components/Elements/EditorSimple';

import { UploadOutlined, PaperClipOutlined } from '@ant-design/icons';
import { newsFeedApi } from '~/apiBase';
import { parseToMoney } from '~/utils/functions';
import { videoTagApi } from '~/apiBase/video-tag';

const { Option } = Select;

const ModalCreateVideoCourse = React.memo((props: any) => {
	const { isLoading, _onSubmit, dataLevel, dataCategory, dataTeacher, dataCurriculum, refeshData, tags, onRefeshTags } = props;

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();
	const [category, setCategory] = useState(0);
	const [level, setLevel] = useState(0);
	const [teacherID, setTeacherID] = useState(0);
	const [curriculumID, setCurriculumID] = useState(0);
	const [videoCourseName, setVideoCourseName] = useState('');
	const [vietnamName, setVietnamName] = useState('');
	const [videoChinaCourseName, setVideoCourseChinaName] = useState('');
	const [originalPrice, setOriginalPrice] = useState('');
	const [sellPrice, setSellPrice] = useState('');
	const [tagArray, setTagArray] = useState('');
	const { showNoti } = useWrap();
	const [imageSelected, setImageSelected] = useState({ name: '' });
	const [previewImage, setPreviewImage] = useState('');

	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm();

	const [slogan, setSlogan] = useState('');
	const [requirements, setRequirements] = useState('');
	const [description, setDescription] = useState('');
	const [resultsAchieved, setResultsAchieved] = useState('');
	const [courseForObject, setCourseForObject] = useState('');

	const finalSubmit = (ImageThumbnails) => {
		_onSubmit({
			CurriculumID: curriculumID,
			CategoryID: category,
			LevelID: level,
			VideoCourseName: vietnamName,
			EnglishName: videoCourseName,
			ChineseName: videoChinaCourseName,
			ImageThumbnails: ImageThumbnails,
			OriginalPrice: originalPrice.replace(/[^0-9\.]+/g, ''),
			SellPrice: sellPrice.replace(/[^0-9\.]+/g, ''),
			TagArray: tagArray[0] == ',' ? tagArray.replace(',', '') : tagArray,
			Slogan: slogan,
			Requirements: requirements,
			Description: description,
			ResultsAchieved: resultsAchieved,
			CourseForObject: courseForObject,
			TeacherID: teacherID
		});
		form.setFieldsValue({ Name: '', OriginalPrice: '', SellPrice: '', Type: '', Level: '', Description: '' });
		setIsModalVisible(false);
	};

	// HANDLE SUBMIT
	const onSubmit = handleSubmit((e) => {
		if (imageSelected.name === '') {
			finalSubmit(null);
		} else {
			uploadFile(imageSelected);
		}
	});

	useEffect(() => {
		const value = form.getFieldValue('OriginalPrice');
		if (value !== null && value !== undefined) {
			form.setFieldsValue({ OriginalPrice: parseToMoney(value.replace(/[^0-9\.]+/g, '')) });
		}
	}, [form.getFieldValue('OriginalPrice')]);

	useEffect(() => {
		const value = form.getFieldValue('SellPrice');
		if (value !== null && value !== undefined) {
			form.setFieldsValue({ SellPrice: parseToMoney(value.replace(/[^0-9\.]+/g, '')) });
		}
	}, [form.getFieldValue('SellPrice')]);

	// Call api upload image
	const uploadFile = async (file) => {
		setLoading(true);
		try {
			let res = await newsFeedApi.uploadFile(file.originFileObj);
			if (res.status == 200 || res.status == 204) {
				finalSubmit(res.data.data);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoading(false);
		}
	};

	// on change isModalVisible
	React.useEffect(() => {
		if (!isModalVisible) {
			setVideoCourseName('');
			setOriginalPrice('');
			setSellPrice('');
			form.setFieldsValue({ Name: '', OriginalPrice: '', SellPrice: '', Type: '', Level: '', Description: '', Image: '' });
		}
	}, [isModalVisible]);

	const [modalCate, setModalCate] = useState(false);
	const [modalLevel, setModalLevel] = useState(false);
	const [modalTags, setModalTags] = useState(false);
	const [newType, setNewType] = useState('');
	const [newLevel, setNewLevel] = useState('');
	const [newTag, setNewTag] = useState('');

	const createType = async () => {
		setLoading(true);
		try {
			const res = await VideoCourseCategoryApi.add({ CategoryName: newType, Enable: 'True' });
			res.status == 200 &&
				(setModalCate(false),
				setIsModalVisible(true),
				refeshData(),
				showNoti('success', 'Thêm thành công'),
				setNewType(''),
				form.setFieldsValue({ TypeName: '' }));
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoading(false);
		}
	};

	const createLevel = async () => {
		setLoading(true);
		try {
			const res = await VideoCourseLevelApi.add({ LevelName: newLevel, Enable: 'True' });
			res.status == 200 &&
				(setModalLevel(false),
				setIsModalVisible(true),
				refeshData(),
				showNoti('success', 'Thêm thành công'),
				setNewLevel(''),
				form.setFieldsValue({ LevelName: '' }));
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoading(false);
		}
	};

	const createTag = async () => {
		setLoading(true);
		try {
			await VideoCuorseTag.add({ Name: newTag });
		} catch (error) {
			error?.message?.ID !== undefined
				? (showNoti('success', 'Thêm thành công'),
				  setIsModalVisible(true),
				  setModalTags(false),
				  onRefeshTags(),
				  setNewTag(''),
				  form.setFieldsValue({ newTag: '' }))
				: showNoti('danger', error.message);
		} finally {
			setLoading(false);
		}
	};

	// Upload file audio
	const handleUploadFile = async (info) => {
		setImageSelected(info.file);
		setPreviewImage(URL.createObjectURL(info.file.originFileObj));
	};

	// Handle delete image
	const handleDeleteImage = () => {
		setImageSelected({ name: '' });
		setPreviewImage('');
	};

	useEffect(() => {
		// tranh tran bo nho
		return () => {
			previewImage !== '' && URL.revokeObjectURL(previewImage);
		};
	}, [imageSelected]);

	function handleChange(value) {
		setTagArray(`${value}`);
		form.setFieldsValue({ tags: `${value}` });
	}

	// RENDER
	return (
		<>
			<div className="ml-3 mr-3 mb-3 mt-1">
				<button
					className="btn btn-warning add-new"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					Thêm mới
				</button>

				<Modal
					confirmLoading={loading}
					title="Thêm loại"
					width={400}
					visible={modalCate}
					onCancel={() => setModalCate(false)}
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
					onCancel={() => setModalLevel(false)}
					onOk={() => createLevel()}
				>
					<Form form={form} layout="vertical" onFinish={() => createLevel()}>
						<div className="col-md-12 col-12">
							<Form.Item name="LevelName" label="Tên cấp độ" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
								<Input
									placeholder=""
									className="style-input"
									defaultValue={newLevel}
									value={newLevel}
									onChange={(e) => setNewLevel(e.target.value)}
								/>
							</Form.Item>
						</div>
					</Form>
				</Modal>
				<Modal
					confirmLoading={loading}
					title="Thêm từ khóa tìm kiếm"
					width={400}
					visible={modalTags}
					onCancel={() => setModalTags(false)}
					onOk={() => createTag()}
				>
					<Form form={form} layout="vertical" onFinish={() => createTag()}>
						<div className="col-md-12 col-12">
							<Form.Item name="newTag" label="Từ khóa tìm kiếm mới">
								<Input
									placeholder=""
									className="style-input"
									defaultValue={newTag}
									value={newTag}
									onChange={(e) => setNewTag(e.target.value)}
								/>
							</Form.Item>
						</div>
					</Form>
				</Modal>

				<Modal
					className="m-create-vc"
					title={`Tạo khoá học video`}
					visible={isModalVisible}
					onCancel={() => setIsModalVisible(false)}
					footer={null}
				>
					<div className="row m-0 p-0">
						<Form className="" form={form} layout="vertical" onFinish={() => onSubmit()}>
							<div className="row p-0 m-0">
								<div className="row p-0 m-0 col-md-6 col-12">
									<div className="col-md-12 col-12">
										<Form.Item
											name="Name"
											label="Tên tiếng Anh"
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

									<div className="col-md-6 col-12">
										<Form.Item
											name="VietNamName"
											label="Tên tiếng Việt"
											rules={[{ required: true, message: 'Bạn không được để trống' }]}
										>
											<Input
												placeholder=""
												className="style-input"
												defaultValue={videoCourseName}
												value={videoCourseName}
												onChange={(e) => setVietnamName(e.target.value)}
											/>
										</Form.Item>
									</div>

									<div className="col-md-6 col-12">
										<Form.Item
											name="chineseName"
											label="Tên tiếng Trung"
											rules={[{ required: true, message: 'Bạn không được để trống' }]}
										>
											<Input
												placeholder=""
												className="style-input"
												defaultValue={videoCourseName}
												value={videoCourseName}
												onChange={(e) => setVideoCourseChinaName(e.target.value)}
											/>
										</Form.Item>
									</div>
									{/* teacher item */}
									<div className="col-md-6 col-12">
										<Form.Item
											name="Teacher"
											label="Giáo viên"
											rules={[{ required: true, message: 'Bạn không được để trống' }]}
										>
											<Select
												style={{ width: '100%' }}
												className="style-input"
												showSearch
												aria-selected
												placeholder="Chọn giáo viên.."
												optionFilterProp="children"
												onChange={(e: number) => setTeacherID(e)}
											>
												{dataTeacher.map((item, index) => (
													<Option key={index} value={item.UserInformationID}>
														{item.FullNameUnicode}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
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

									<div className="col-md-6 col-12">
										<Form.Item
											label={
												<div className="row m-0">
													Loại{' '}
													<Tooltip title="Thêm loại mới">
														<Button
															onClick={() => setModalCate(true)}
															className="btn btn-primary btn-vc-create ml-1"
														>
															<div style={{ marginTop: -2 }}>+</div>
														</Button>
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

									<div className="col-md-6 col-12">
										<Form.Item
											name="Level"
											label={
												<div className="row m-0">
													Cấp độ{' '}
													<Tooltip title="Thêm cấp độ mới">
														<Button
															onClick={() => setModalLevel(true)}
															className="btn btn-primary btn-vc-create ml-1"
														>
															<div style={{ marginTop: -2 }}>+</div>
														</Button>
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
												value={sellPrice}
												onChange={(e) => setSellPrice(e.target.value)}
											/>
										</Form.Item>
									</div>

									{/* upload image */}
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
													<Button danger onClick={handleDeleteImage}>
														Xoá hình ảnh
													</Button>
												</div>
											)}
										</Form.Item>

										{/* end preview image */}

										<div className="col-12">
											{tags.length > 0 && (
												<Form.Item
													name="Description"
													label={
														<div className="row m-0">
															Từ khóa tìm kiếm{' '}
															<Tooltip title="Thêm từ khóa tìm kiếm">
																<button
																	onClick={() => (setModalTags(true), setIsModalVisible(false))}
																	className="btn btn-primary btn-vc-create ml-1"
																>
																	<div style={{ marginTop: -2, marginLeft: 1 }}>+</div>
																</button>
															</Tooltip>
														</div>
													}
													rules={[{ required: true, message: 'Bạn không được để trống' }]}
												>
													<Select
														mode="tags"
														className="style-input"
														style={{ width: '100%' }}
														placeholder="Từ khóa tìm kiếm"
														onChange={(e) => handleChange(e)}
													>
														{tags.map((item, index) => (
															<Option key={index} value={item.ID}>
																{item.Name}
															</Option>
														))}
													</Select>
												</Form.Item>
											)}
										</div>
									</div>

									{/* end preview image */}

									<div className="col-12">
										{tags.length > 0 && (
											<Form.Item
												name="Tags"
												label={
													<div className="row m-0">
														Từ khóa tìm kiếm{' '}
														<Tooltip title="Thêm từ khóa tìm kiếm">
															<Button
																onClick={() => setModalTags(true)}
																className="btn btn-primary btn-vc-create ml-1"
															>
																<div style={{ marginTop: -2, marginLeft: 1 }}>+</div>
															</Button>
														</Tooltip>
													</div>
												}
												rules={[{ required: true, message: 'Bạn không được để trống' }]}
											>
												<Select
													mode="tags"
													className="style-input"
													style={{ width: '100%' }}
													placeholder="Từ khóa tìm kiếm"
													onChange={(e) => handleChange(e)}
												>
													{tags.map((item, index) => (
														<Option key={index} value={item.ID}>
															{item.Name}
														</Option>
													))}
												</Select>
											</Form.Item>
										)}
									</div>
								</div>

								<div className="row p-0 m-0 custom-scroll-bar col-md-6 col-12">
									<div className="row vc-e-d" style={{ height: imageSelected.name === '' ? 426 : 460 }}>
										<div className="col-md-12 col-12">
											<Form.Item name="Slogan" label="Slogan">
												<EditorSimple
													defaultValue={slogan}
													handleChange={(e) => setSlogan(e)}
													isTranslate={false}
													isSimpleTool={true}
													height={80}
												/>
											</Form.Item>
										</div>
										<div className="col-md-12 col-12">
											<Form.Item name="Requirements" label="Điều kiện học">
												<EditorSimple
													defaultValue={requirements}
													handleChange={(e) => setRequirements(e)}
													isTranslate={false}
													isSimpleTool={true}
													height={80}
												/>
											</Form.Item>
										</div>
										<div className="col-md-12 col-12">
											<Form.Item name="CourseForObject" label="Đối tượng học">
												<EditorSimple
													defaultValue={courseForObject}
													handleChange={(e) => setCourseForObject(e)}
													isTranslate={false}
													isSimpleTool={true}
													height={80}
												/>
											</Form.Item>
										</div>
										<div className="col-md-12 col-12">
											<Form.Item name="ResultsAchieved" label="Nội dung khóa học">
												<EditorSimple
													defaultValue={resultsAchieved}
													handleChange={(e) => setResultsAchieved(e)}
													isTranslate={false}
													isSimpleTool={true}
													height={80}
												/>
											</Form.Item>
										</div>
										<div className="col-md-12 col-12">
											<Form.Item name="Description" label="Mô tả">
												<EditorSimple
													defaultValue={description}
													handleChange={(e) => setDescription(e)}
													isTranslate={false}
													isSimpleTool={true}
													height={80}
												/>
											</Form.Item>
										</div>
									</div>
								</div>
							</div>
							<div className="footer">
								<div className="row">
									<div className="col-12" style={{ justifyContent: 'flex-end', display: 'flex' }}>
										<button onClick={() => setIsModalVisible(false)} className="btn btn-warning mr-3">
											Huỷ
										</button>
										<button type="submit" className="btn btn-primary">
											Tạo khóa học {loading && <Spin className="loading-base" />}
											{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
										</button>
									</div>
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
