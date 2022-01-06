import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Spin, Upload, Button, Select, Tooltip, Image } from 'antd';
import { useForm } from 'react-hook-form';
import { UploadOutlined } from '@ant-design/icons';
import { useWrap } from '~/context/wrap';
import { newsFeedApi } from '~/apiBase';
import EditorSimple from '~/components/Elements/EditorSimple';
import { parseToMoney } from '~/utils/functions';
import 'antd/dist/antd.css';
import { VideoCourseDetailApi } from '~/apiBase/video-course-details';
import { VideoCourseCategoryApi } from '~/apiBase/video-course-store/category';
import { VideoCourseLevelApi, VideoCuorseTag } from '~/apiBase/video-course-store/level';

const { Option } = Select;

const initDetails = {
	VideoCourseName: '',
	Slogan: '',
	Requirements: '',
	Description: '',
	ResultsAchieved: '',
	CourseForObject: '',
	TotalRating: 0,
	RatingNumber: 0,
	TotalStudent: 0,
	CreatedBy: ''
};

const ModalUpdateInfo = React.memo((props: any) => {
	const {
		_onSubmitEdit,
		programID,
		rowData,
		isModalVisible,
		setIsModalVisible,
		dataTeacher,
		refeshData,
		dataCategory,
		dataLevel,
		dataCurriculum,
		tags,
		onRefeshTags
	} = props;
	const [form] = Form.useForm();
	const [videoCourseName, setVideoCourseName] = useState('');
	const [originalPrice, setOriginalPrice] = useState('');
	const [sellPrice, setSellPrice] = useState('');
	const [imageSelected, setImageSelected] = useState({ name: '' });
	const [previewImage, setPreviewImage] = useState('');
	const [buttonLoading, setButtonLoading] = useState(false);
	const [teacherID, setTeacherID] = useState(0);

	const [modalCate, setModalCate] = useState(false);
	const [modalLevel, setModalLevel] = useState(false);
	const [modalTags, setModalTags] = useState(false);
	const [newType, setNewType] = useState('');
	const [newLevel, setNewLevel] = useState('');
	const [newTag, setNewTag] = useState('');
	const [level, setLevel] = useState(0);
	const [category, setCategory] = useState(0);
	const [curriculumID, setCurriculumID] = useState(0);
	const [tagArray, setTagArray] = useState('');
	const [chineseName, setChineseName] = useState('');

	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm();

	const [loading, setLoading] = useState(true);
	const { showNoti } = useWrap();

	// HANDLE SUBMIT
	const onSubmit = handleSubmit(() => {
		updateDetails();
	});

	useEffect(() => {
		const value = form.getFieldValue('OriginalPrice');
		if (value !== null && value !== undefined) {
			form.setFieldsValue({ OriginalPrice: parseToMoney(value.toString().replace(/[^0-9\.]+/g, '')) });
		}
	}, [form.getFieldValue('OriginalPrice')]);

	useEffect(() => {
		const value = form.getFieldValue('SellPrice');
		if (value !== null && value !== undefined) {
			form.setFieldsValue({ SellPrice: parseToMoney(value.toString().replace(/[^0-9\.]+/g, '')) });
		}
	}, [form.getFieldValue('SellPrice')]);

	// IS VISIBLE MODAL
	React.useEffect(() => {
		if (isModalVisible) {
			if (programID) {
				setVideoCourseName(rowData.VideoCourseName);
				setChineseName(rowData.ChineseName);
				setLevel(rowData.LevelID);
				setCurriculumID(rowData.CurriculumID);
				setTeacherID(rowData.TeacherID);
				setCategory(rowData.CategoryID);
				setOriginalPrice(rowData.OriginalPrice);
				setSellPrice(rowData.SellPrice);
				setChineseName(rowData.ChineseName);
				setTagArray(rowData?.TagArray);
				form.setFieldsValue({
					Name: rowData.VideoCourseName,
					SellPrice: rowData.SellPrice,
					Teacher: rowData.TeacherName,
					ChineseName: rowData.ChineseName,
					Curriculum: rowData.CurriculumID,
					Level: rowData.LevelName,
					Type: rowData.CategoryName,
					Slogan: rowData.Slogan,
					OriginalPrice: rowData.OriginalPrice,
					Requirements: rowData.Requirements,
					Description: rowData.Description,
					ResultsAchieved: rowData.ResultsAchieved,
					CourseForObject: rowData.CourseForObject
				});

				getCourseDetails(programID);
			}
		}
	}, [isModalVisible]);

	const getDefault = (data) => {
		if (data !== '') {
			const temp = data.split(',');
			let tamp = [];

			if (temp.length > 0) {
				for (let i = 0; i < temp.length; i++) {
					tamp.push(parseInt(temp[i]));
				}
			}

			return tamp;
		} else {
			return [];
		}
	};

	// on change isModalVisible
	React.useEffect(() => {
		if (!isModalVisible) {
			setVideoCourseName('');
			setOriginalPrice('');
			setSellPrice('');
			setImageSelected({ name: '' });
			form.setFieldsValue({
				Name: '',
				ChineseName: '',
				SellPrice: '',
				Type: '',
				Curriculum: '',
				Level: '',
				Teacher: '',
				Slogan: '',
				Requirements: '',
				Description: '',
				ResultsAchieved: '',
				CourseForObject: '',
				Image: ''
			});
		}
	}, [isModalVisible]);

	// Call api upload image
	const uploadFile = async (file) => {
		setLoading(true);
		try {
			let res = await newsFeedApi.uploadFile(file.originFileObj);
			if (res.status == 200 || res.status == 204) {
				const temp = {
					ID: rowData.ID,
					CategoryID: category,
					LevelID: level,
					TeacherID: teacherID,
					CurriculumID: curriculumID,
					TagArray: tagArray,
					ChineseName: chineseName,
					VideoCourseName: videoCourseName,
					OriginalPrice: originalPrice.toString().replace(/[^0-9\.]+/g, ''),
					SellPrice: sellPrice.toString().replace(/[^0-9\.]+/g, ''),
					ImageThumbnails: res.data.data,
					Slogan: slogan,
					Requirements: requirements,
					Description: description,
					ResultsAchieved: resultsAchieved,
					CourseForObject: courseForObject
				};
				_onSubmitEdit(temp);
			}
		} catch (error) {
			showNoti('danger', error.message);
		}
	};

	// Upload file audio
	const handleUploadFile = async (info) => {
		setImageSelected(info.file);
		setPreviewImage(URL.createObjectURL(info.file.originFileObj));
	};

	const [details, setDetails] = useState(initDetails);
	const [slogan, setSlogan] = useState('');
	const [requirements, setRequirements] = useState('');
	const [description, setDescription] = useState('');
	const [resultsAchieved, setResultsAchieved] = useState('');
	const [courseForObject, setCourseForObject] = useState('');

	// Init data
	React.useEffect(() => {
		if (details !== initDetails) {
			setDescription(details?.Description || '');
			setCourseForObject(details?.CourseForObject || '');
			setRequirements(details?.Requirements || '');
			setResultsAchieved(details?.ResultsAchieved || '');
			setSlogan(details?.Slogan || '');
			setLoading(false);

			form.setFieldsValue({
				Slogan: details?.Slogan,
				Requirements: details?.Requirements,
				CourseForObject: details?.CourseForObject,
				ResultsAchieved: details?.ResultsAchieved,
				Description: details?.Description
			});
		}
	}, [details]);

	// CALL API DETAILS
	const getCourseDetails = async (param) => {
		setLoading(true);
		try {
			const res = await VideoCourseDetailApi.getDetails(param);
			res.status == 200 && setDetails(res.data.data);
		} catch (error) {}
	};

	// HANDLE UPDATE
	const updateDetails = async () => {
		setButtonLoading(true);
		let temp = {
			ID: rowData.ID,
			CategoryID: category,
			LevelID: level,
			CurriculumID: curriculumID,
			TeacherID: teacherID,
			TagArray: tagArray,
			ChineseName: chineseName,
			VideoCourseName: videoCourseName,
			OriginalPrice: originalPrice.toString().replace(/[^0-9\.]+/g, ''),
			SellPrice: sellPrice.toString().replace(/[^0-9\.]+/g, ''),
			ImageThumbnails: '',
			Slogan: slogan,
			Requirements: requirements,
			Description: description,
			ResultsAchieved: resultsAchieved,
			CourseForObject: courseForObject
		};
		try {
			if (imageSelected.name === '') {
				_onSubmitEdit(temp);
			} else {
				uploadFile(imageSelected);
			}
		} catch (e) {}
	};

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

	// Handle delete image
	const handleDeleteImage = () => {
		setImageSelected({ name: '' });
		setPreviewImage('');
	};

	function handleChange(value) {
		setTagArray(`${value}`);
		form.setFieldsValue({ newTag: `${value}` });
	}

	useEffect(() => {
		// tranh tran bo nho
		return () => {
			previewImage !== '' && URL.revokeObjectURL(previewImage);
		};
	}, [imageSelected]);

	// RENDER
	return (
		<>
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
				onCancel={() => (setModalTags(false), setIsModalVisible(true))}
				onOk={() => createTag()}
			>
				<Form form={form} layout="vertical" onFinish={() => createTag()}>
					<div className="col-md-12 col-12">
						<Form.Item
							name="newTag"
							label="Từ khóa tìm kiếm mới"
							rules={[{ required: true, message: 'Bạn không được để trống' }]}
						>
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

			{/* Main modal */}
			<Modal
				className="m-create-vc"
				title={`Sửa thông tin khoá học`}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="row m-0 p-0">
					<Form form={form} layout="vertical" onFinish={() => onSubmit()}>
						<div className="row p-0 m-0">
							<div className="row p-0 m-0 custom-scroll-bar col-md-12 col-12">
								<div className="row vc-e-d" style={{ height: imageSelected.name === '' ? 390 : 390, display: 'flex' }}>
									<div className="row p-0 m-0 col-md-6 col-12">
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

										<div className="col-md-6 col-12">
											<Form.Item
												name="ChineseName"
												label="Tên tiếng Trung"
												rules={[{ required: true, message: 'Bạn không được để trống' }]}
												initialValue={rowData && rowData.ChineseName}
											>
												<Input
													placeholder=""
													className="style-input"
													defaultValue={videoCourseName}
													value={videoCourseName}
													onChange={(e) => setChineseName(e.target.value)}
												/>
											</Form.Item>
										</div>

										{/* teacher item */}
										<div className="col-md-6 col-12">
											<Form.Item
												name="Teacher"
												label="Giáo viên"
												rules={[{ required: true, message: 'Bạn không được để trống' }]}
												initialValue={rowData.TeacherName}
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
												name="Type"
												rules={[{ required: true, message: 'Bạn không được để trống' }]}
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
															<Button danger onClick={handleDeleteImage}>
																Xoá hình ảnh
															</Button>
															{/* <PaperClipOutlined /> */}
															{/* <span>...{imageSelected.name.slice(-20, imageSelected.name.length)}</span> */}
														</div>
													)}
												</Form.Item>
											</div>
										)}

										{/* preview image */}
										{previewImage !== '' && (
											<div className="col-md-6 col-12">
												<Image className="image_wrapper" src={previewImage} />
											</div>
										)}

										{!loading && (
											<div className="col-12">
												{tags.length > 0 && (
													<Form.Item
														name="TagArray"
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
																{tagArray !== '' && (
																	<div style={{ color: '#f44d4f', fontSize: 12, marginLeft: 5 }}>*</div>
																)}
															</div>
														}
														rules={[
															{ required: tagArray == '' ? true : false, message: 'Bạn không được để trống' }
														]}
													>
														<Select
															mode="tags"
															className="style-input"
															style={{ width: '100%' }}
															placeholder="Từ khóa tìm kiếm"
															defaultValue={getDefault(tagArray)}
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
										)}
									</div>

									<div className="row p-0 m-0 custom-scroll-bar col-md-6 col-12">
										{loading ? (
											<div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
												<Spin size="large" />
											</div>
										) : (
											<div className="row vc-e-d" style={{ height: imageSelected.name === '' ? 426 : 460 }}>
												<div className="col-md-12 col-12">
													<Form.Item name="Slogan" label="Slogan">
														<EditorSimple
															defaultValue={slogan}
															handleChange={(e) => setSlogan(e)}
															isTranslate={false}
															isSimpleTool={true}
															height={90}
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
															height={90}
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
															height={90}
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
															height={90}
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
															height={90}
														/>
													</Form.Item>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* footer */}
						<div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
							<div className="m-0 p-0" style={{ justifyContent: 'flex-end', display: 'flex' }}>
								<button onClick={() => setIsModalVisible(false)} className="btn btn-warning mr-3">
									Huỷ
								</button>
								<button type="submit" className="btn btn-primary">
									Lưu thay đổi
									{buttonLoading && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
});

export default ModalUpdateInfo;
