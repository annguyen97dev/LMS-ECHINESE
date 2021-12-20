import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Spin, Upload, Button, Select } from 'antd';
import { useForm } from 'react-hook-form';
import { UploadOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useWrap } from '~/context/wrap';
import { newsFeedApi } from '~/apiBase';
import EditorSimple from '~/components/Elements/EditorSimple';
import { parseToMoney } from '~/utils/functions';
import 'antd/dist/antd.css';
import { VideoCourseStoreApi } from '~/apiBase/video-course-store';
import { VideoCourseDetailApi } from '~/apiBase/video-course-details';
import { resolveSrv } from 'dns/promises';

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
	const { _onSubmitEdit, programID, rowData, isModalVisible, setIsModalVisible, dataTeacher } = props;
	const [form] = Form.useForm();
	const [videoCourseName, setVideoCourseName] = useState('');
	const [originalPrice, setOriginalPrice] = useState('');
	const [sellPrice, setSellPrice] = useState('');
	const [imageSelected, setImageSelected] = useState({ name: '' });
	const [buttonLoading, setButtonLoading] = useState(false);
	const [teacherID, setTeacherID] = useState(0);

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
				setOriginalPrice(rowData.OriginalPrice);
				setSellPrice(rowData.SellPrice);
				form.setFieldsValue({
					Name: rowData.VideoCourseName,
					OriginalPrice: rowData.OriginalPrice,
					SellPrice: rowData.SellPrice,
					Teacher: rowData.TeacherName
				});

				getCourseDetails(programID);
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
			if (res.status == 200 || res.status == 204) {
				const temp = {
					ID: rowData.ID,
					VideoCourseName: videoCourseName,
					OriginalPrice: originalPrice.toString().replace(/[^0-9\.]+/g, ''),
					SellPrice: sellPrice.toString().replace(/[^0-9\.]+/g, ''),
					ImageThumbnails: res.data.data,
					TeacherID: teacherID,
					Slogan: slogan,
					Requirements: requirements,
					Description: description,
					ResultsAchieved: resultsAchieved,
					CourseForObject: courseForObject
				};
				_onSubmitEdit(temp);
				// _onSubmitEdit({
				// 	ID: rowData.ID,
				// 	VideoCourseName: videoCourseName,
				// 	OriginalPrice: originalPrice.toString().replace(/[^0-9\.]+/g, ''),
				// 	SellPrice: sellPrice.toString().replace(/[^0-9\.]+/g, ''),
				// 	ImageThumbnails: res.data.data
				// });
				setIsModalVisible(false);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setButtonLoading(false);
		}
	};

	// Upload file audio
	const handleUploadFile = async (info) => {
		setImageSelected(info.file);
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
		}
	}, [details]);

	// CALL API DETAILS
	const getCourseDetails = async (param) => {
		try {
			const res = await VideoCourseDetailApi.getDetails(param);
			res.status == 200 && setDetails(res.data.data);
		} catch (error) {
			console.log(error);
		}
	};

	// HANDLE UPDATE
	const updateDetails = async () => {
		setButtonLoading(true);
		let temp = {
			ID: rowData.ID,
			VideoCourseName: videoCourseName,
			OriginalPrice: originalPrice.toString().replace(/[^0-9\.]+/g, ''),
			SellPrice: sellPrice.toString().replace(/[^0-9\.]+/g, ''),
			ImageThumbnails: '',
			TeacherID: teacherID,
			Slogan: slogan,
			Requirements: requirements,
			Description: description,
			ResultsAchieved: resultsAchieved,
			CourseForObject: courseForObject
		};
		try {
			if (imageSelected.name === '') {
				_onSubmitEdit(temp);
				setButtonLoading(false);
				setIsModalVisible(false);
			} else {
				uploadFile(imageSelected);
			}
		} catch (e) {
			console.log(e);
		}
		// let temp = {
		// 	VideoCourseID: programID,
		// 	Slogan: slogan,
		// 	Requirements: requirements,
		// 	Description: description,
		// 	ResultsAchieved: resultsAchieved,
		// 	CourseForObject: courseForObject,

		// };
		// try {
		// 	const res = await VideoCourseDetailApi.update(temp);
		// 	res.status == 200 && (setIsModalVisible(true), showNoti('success', 'Thành công'));
		// } catch (error) {
		// } finally {
		// 	if (imageSelected.name === '') {
		// 		_onSubmitEdit({
		// 			ID: rowData.ID,
		// 			VideoCourseName: videoCourseName,
		// 			OriginalPrice: originalPrice.toString().replace(/[^0-9\.]+/g, ''),
		// 			SellPrice: sellPrice.toString().replace(/[^0-9\.]+/g, ''),
		// 			ImageThumbnails: '',
		//             TeacherID: teacherID,
		// 		});
		// 		setButtonLoading(false);
		// 		setIsModalVisible(false);
		// 	} else {
		// 		uploadFile(imageSelected);
		// 	}
		// }
	};

	// RENDER
	return (
		<>
			<Modal
				className="m-e-vc"
				title={`Sửa thông tin khoá học`}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={() => onSubmit()}>
						<div className="row p-0 m-0">
							<div className="row p-0 m-0 custom-scroll-bar col-md-12 col-12">
								<div className="row vc-e-d" style={{ height: imageSelected.name === '' ? 390 : 390, display: 'flex' }}>
									{loading ? (
										<div
											style={{
												display: 'flex',
												width: 480,
												justifyContent: 'center',
												alignItems: 'center'
											}}
										>
											<Spin size="large" />
										</div>
									) : (
										<>
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
															<Button
																className="vc-e-upload"
																icon={<UploadOutlined style={{ marginTop: -2 }} />}
															>
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

											{/* teacher item */}
											<div className="col-md-6 col-12">
												<Form.Item
													name="Teacher"
													label="giáo viên"
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

											{/* ========= */}

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
										</>
									)}
								</div>
							</div>
						</div>
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
