import React, { useState } from 'react';
import { Modal, Form, Input, Spin, Upload, Button } from 'antd';
import { useForm } from 'react-hook-form';
import { UploadOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useWrap } from '~/context/wrap';
import { newsFeedApi } from '~/apiBase';

const ModalUpdateInfo = React.memo((props: any) => {
	const { _onSubmitEdit, programID, rowData, isModalVisible, setIsModalVisible } = props;
	const [form] = Form.useForm();
	const [videoCourseName, setVideoCourseName] = useState('');
	const [originalPrice, setOriginalPrice] = useState('');
	const [sellPrice, setSellPrice] = useState('');
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
		if (imageSelected.name === '') {
			_onSubmitEdit({
				ID: rowData.ID,
				VideoCourseName: videoCourseName,
				OriginalPrice: originalPrice,
				SellPrice: sellPrice,
				ImageThumbnails: ''
			});
			setIsModalVisible(false);
		} else {
			uploadFile(imageSelected);
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
			if (res.status == 200 || res.status == 204) {
				_onSubmitEdit({
					ID: rowData.ID,
					VideoCourseName: videoCourseName,
					OriginalPrice: originalPrice,
					SellPrice: sellPrice,
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
			<Modal title={`Sửa thông tin khoá học`} visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="container-fluid custom-scroll-bar">
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
						</div>

						<div className="col-12 m-0 p-0" style={{ justifyContent: 'flex-end', display: 'flex' }}>
							<button onClick={() => setIsModalVisible(false)} className="btn btn-warning mr-3">
								Huỷ
							</button>
							<button type="submit" className="btn btn-primary">
								Lưu
								{loading && <Spin className="loading-base" />}
							</button>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
});

export default ModalUpdateInfo;
