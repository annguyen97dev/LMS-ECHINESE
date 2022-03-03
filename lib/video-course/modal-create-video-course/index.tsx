import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Spin, Tooltip, Upload, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { newsFeedApi } from '~/apiBase';
import { VideoCourseCategoryApi } from '~/apiBase/video-course-store/category';
import { VideoCourseLevelApi, VideoCuorseTag } from '~/apiBase/video-course-store/level';
import EditorSimple from '~/components/Elements/EditorSimple';
import { useWrap } from '~/context/wrap';
import { parseToMoney } from '~/utils/functions';

const { Option } = Select;

const ModalCreateVideoCourse = React.memo((props: any) => {
	const listTypeID = [
		{ title: 'Hàng 1', value: 1 },
		{ title: 'Hàng Ebook', value: 2 }
	];
	const { isLoading, _onSubmit, dataLevel, dataCategory, dataTeacher, dataCurriculum, refeshData, tags, onRefeshTags } = props;

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();
	const [category, setCategory] = useState(0);
	const [level, setLevel] = useState(0);
	const [teacherID, setTeacherID] = useState(0);
	const [curriculumID, setCurriculumID] = useState(0);
	const [expiryDays, setExpiryDays] = useState(0);
	const [videoCourseName, setVideoCourseName] = useState('');
	const [vietnamName, setVietnamName] = useState('');
	const [typeID, setTypeID] = useState(null);
	const [number, setNumber] = useState(null);
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
			TeacherID: teacherID,
			ExpiryDays: expiryDays,
			TypeID: typeID,
			Number: number,
			Website_ImageThumbnails: localStorage.getItem('webImageCourseID') === null ? null : localStorage.getItem('webImageCourseID')
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
			form.setFieldsValue({ SellPrice: parseToMoney(value.toString().replace(/[^0-9\.]+/g, '')) });
		}
	}, [form.getFieldValue('SellPrice')]);

	useEffect(() => {
		let value = form.getFieldValue('ExpiryDays');

		if (value !== null && value !== undefined) {
			form.setFieldsValue({ ExpiryDays: value.replace(/[^0-9\.]+/g, '') });
		}
	}, [form.getFieldValue('ExpiryDays')]);

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
			let res = await VideoCuorseTag.add({ Name: newTag });
			res.status == 200 &&
				(setModalTags(false),
				setIsModalVisible(true),
				refeshData(),
				showNoti('success', 'Thêm thành công'),
				setNewTag(''),
				form.setFieldsValue({ Name: '' }));
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

		var axios = require('axios');

		var config = {
			method: 'post',
			url: 'https://echineseweb.monamedia.net/wp-json/wp/v2/media',
			headers: {
				'Content-Disposition': 'attachment;filename=img-group1.jpg',
				Authorization: 'Basic bW9uYW1lZGlhOmlhQmEgQUI4NiA5OUhnIG9ZN3Qgd3MzaiBUaHhx',
				'Content-Type': 'image/jpeg'
			},
			data: info.file.originFileObj
		};

		axios(config)
			.then(function (res) {
				console.log('🚀 ~ file: index.tsx ~ line 225 ~ webImageCourseID', res.data.id);
				localStorage.setItem('webImageCourseID', res.data.id);
			})
			.catch(function (error) {
				console.log(error);
			});
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
					onCancel={() => {
						setIsModalVisible(false);
						form.resetFields();
					}}
					footer={null}
				>
					<div className="row m-0 p-0">
						<Form className="" form={form} layout="vertical" onFinish={() => onSubmit()}>
							<div className="row p-0 m-0">
								<div className="row p-0 m-0 col-md-6 col-12">
									<div className="col-md-6 col-12">
										<Form.Item
											name="ExpiryDays"
											label=" " // CHỔ NÀY BÙA ĐỀ HIỆN CÁI TOOLTIP. XÓA KHOẢN TRẮNG MẤT LUÔN TOOLTIP
											tooltip={{
												title: 'Nhập 0 hoặc bỏ trống thì không có hạn sử dụng',
												icon: (
													<div className="row ">
														<span className="mr-1 mt-3" style={{ color: '#000' }}>
															Số ngày sử dụng
														</span>
														<i className="fas fa-question-circle"></i>
													</div>
												)
											}}
											rules={[{ required: false, message: 'Bạn không được để trống' }]}
										>
											<Input
												placeholder=""
												className="style-input"
												value={expiryDays}
												// @ts-ignore
												onChange={(e) => setExpiryDays(e.target.value)}
											/>
											{/* <InputNumber min={1} max={99999} defaultValue={3} onChange={(e: number) => setExpiryDays(e)} /> */}
										</Form.Item>
									</div>
									<div className="col-md-6 col-12">
										<Form.Item name="Name" label="Tên tiếng Anh">
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
										<Form.Item name="chineseName" label="Tên tiếng Trung">
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
									{/* TypeID / number */}
									<div className="col-md-6 col-12">
										<Form.Item
											name="TypeID"
											label="Loại hàng"
											rules={[{ required: true, message: 'Bạn không được để trống' }]}
										>
											<Select
												style={{ width: '100%' }}
												className="style-input"
												aria-selected
												placeholder="Chọn loại hàng"
												optionFilterProp="children"
												onChange={(e: number) => setTypeID(e)}
											>
												{listTypeID.map((item, index) => (
													<Option key={index} value={item.value}>
														{item.title}
													</Option>
												))}
											</Select>
										</Form.Item>
									</div>
									<div className="col-md-6 col-12">
										<Form.Item
											name="Number"
											label="Số thứ tự"
											rules={[{ required: true, message: 'Bạn không được để trống' }]}
										>
											<Input
												placeholder="Nhập số thứ tự"
												className="style-input"
												value={number}
												onChange={(e) => setNumber(e.target.value)}
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

										<div className="col-12"></div>
									</div>
									{/* end preview image */}
									{previewImage !== '' && (
										<div className="col-md-6 col-12">
											<Image className="image_wrapper" src={previewImage} />
										</div>
									)}

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
													searchValue=""
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
