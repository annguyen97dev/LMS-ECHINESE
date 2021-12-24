import React, { useState, useEffect } from 'react';
import { Modal, Form, Tooltip, Select, Input, Upload, message, Spin } from 'antd';
import { RotateCw, X } from 'react-feather';
import EditorSimple from '~/components/Elements/EditorSimple';
import { useWrap } from '~/context/wrap';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { paymentConfig } from '~/apiBase/shopping-cart/payment-config';
import { studentApi } from '~/apiBase';

const AddPaymentMethodForm = (props) => {
	const [visible, setVisible] = useState(false);
	const [method, setMethod] = useState({ Name: null, Code: null, ID: null });
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [form] = Form.useForm();
	const { Option } = Select;
	const [loadingImage, setLoadingImage] = useState(false);
	const [imageUrl, setImageUrl] = useState('');
	const { showNoti } = useWrap();
	const handleSelectMethod = (info) => {
		setMethod({ Name: info.label, Code: info.value, ID: info.key });
	};

	const renderSelectMethod = () => {
		if (props.dataPayment) {
			return (
				<>
					<Option value={props.dataPayment.PaymentCode} key={props.dataPayment.ID}>
						{props.dataPayment.PaymentName}
					</Option>
				</>
			);
		} else {
			return (
				props.paymentMethod &&
				props.paymentMethod.map((item, index) => {
					return (
						<>
							<Option value={item.PaymentCode} key={item.PaymentCode}>
								{item.PaymentName}
							</Option>
						</>
					);
				})
			);
		}
	};

	const renderPaymentField = () => {
		switch (method.Code) {
			case 'momo':
				return (
					<>
						<div className="col-12 mb-3">
							<Form.Item
								name="accessKey"
								label="Access Key"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.accessKey}
							>
								<Input placeholder="Nhập Access Key" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="secretKey"
								label="Secret Key"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.secretKey}
							>
								<Input placeholder="Nhập Secret Key" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="partnerCode"
								label="Partner Code"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.partnerCode}
							>
								<Input placeholder="Nhập Partner Code" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="partnerName"
								label="Partner Name"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.partnerName}
							>
								<Input placeholder="Nhập Partner Name" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="endPoint"
								label="End Point"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.endPoint}
							>
								<Input placeholder="Nhập End Point" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
					</>
				);
			case 'momo_test':
				return (
					<>
						<div className="col-12 mb-3">
							<Form.Item
								name="accessKey"
								label="Access Key"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.accessKey}
							>
								<Input placeholder="Nhập Access Key" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="secretKey"
								label="Secret Key"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.secretKey}
							>
								<Input placeholder="Nhập Secret Key" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="partnerCode"
								label="Partner Code"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.partnerCode}
							>
								<Input placeholder="Nhập Partner Code" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="partnerName"
								label="Partner Name"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.partnerName}
							>
								<Input placeholder="Nhập Partner Name" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="endPoint"
								label="End Point"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.endPoint}
							>
								<Input placeholder="Nhập End Point" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
					</>
				);
			case 'paypal':
				return (
					<>
						<div className="col-12 mb-3">
							<Form.Item
								name="clientId"
								label="Client ID"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.clientId}
							>
								<Input placeholder="Nhập Client ID" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="clientSecret"
								label="Client Secrect"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.clientSecret}
							>
								<Input placeholder="Nhập Client Secrect" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
					</>
				);
			case 'paypal_test':
				return (
					<>
						<div className="col-12 mb-3">
							<Form.Item
								name="clientId"
								label="Client ID"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.clientId}
							>
								<Input placeholder="Nhập Client ID" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="clientSecret"
								label="Client Secrect"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.clientSecret}
							>
								<Input placeholder="Nhập Client Secrect" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
					</>
				);
			case 'onepaydomestic':
				return (
					<>
						<div className="col-12 mb-3">
							<Form.Item
								name="secureSecrect"
								label="Secure Secrect"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.secureSecrect}
							>
								<Input placeholder="Nhập Secure Secrect" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="accessCode"
								label="Access Code"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.accessCode}
							>
								<Input placeholder="Nhập Access Code" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="merchantID"
								label="Merchant ID"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.merchantID}
							>
								<Input placeholder="Nhập Merchant ID" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="endPoint"
								label="End Point"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.endPoint}
							>
								<Input placeholder="Nhập End Point" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
					</>
				);
			case 'onepaydomestic_test':
				return (
					<>
						<div className="col-12 mb-3">
							<Form.Item
								name="secureSecrect"
								label="Secure Secrect"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.secureSecrect}
							>
								<Input placeholder="Nhập Secure Secrect" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="accessCode"
								label="Access Code"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.accessCode}
							>
								<Input placeholder="Nhập Access Code" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="merchantID"
								label="Merchant ID"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.merchantID}
							>
								<Input placeholder="Nhập Merchant ID" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="endPoint"
								label="End Point"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.endPoint}
							>
								<Input placeholder="Nhập End Point" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
					</>
				);
			case 'onepayinternational':
				return (
					<>
						<div className="col-12 mb-3">
							<Form.Item
								name="secureSecrect"
								label="Secure Secrect"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.secureSecrect}
							>
								<Input placeholder="Nhập Secure Secrect" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="accessCode"
								label="Access Code"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.accessCode}
							>
								<Input placeholder="Nhập Access Code" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="merchantID"
								label="Merchant ID"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.merchantID}
							>
								<Input placeholder="Nhập Merchant ID" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="endPoint"
								label="End Point"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.endPoint}
							>
								<Input placeholder="Nhập End Point" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
					</>
				);
			case 'onepayinternational_test':
				return (
					<>
						<div className="col-12 mb-3">
							<Form.Item
								name="secureSecrect"
								label="Secure Secrect"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.secureSecrect}
							>
								<Input placeholder="Nhập Secure Secrect" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="accessCode"
								label="Access Code"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.accessCode}
							>
								<Input placeholder="Nhập Access Code" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="merchantID"
								label="Merchant ID"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.merchantID}
							>
								<Input placeholder="Nhập Merchant ID" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="endPoint"
								label="End Point"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.endPoint}
							>
								<Input placeholder="Nhập End Point" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
					</>
				);
			case 'cashpayment':
				return (
					<>
						<div className="col-12 mb-3">
							<Form.Item
								name="endPoint"
								label="Địa Chỉ"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.endPoint}
							>
								<Input placeholder="Nhập Địa Chỉ" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
					</>
				);
			case 'transferpayment':
				return (
					<>
						<div className="col-12 mb-3">
							<Form.Item
								name="transferpayment"
								label="Thông tin chuyển tiền"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
								initialValue={props.dataPayment && props.dataPayment.transferpayment}
							>
								<EditorSimple
									isSimpleTool={false}
									height={300}
									name="transferpayment"
									defaultValue={props.dataPayment && props.dataPayment.transferpayment}
									isTranslate={false}
									handleChange={(value) => {
										form.setFieldsValue({ transferpayment: value.toString() });
									}}
								/>
							</Form.Item>
						</div>
					</>
				);
			default:
				break;
		}
	};

	const beforeUpload = (file) => {
		const validTypeList = ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp'];
		const isValidType = validTypeList.includes(file.type);
		if (!isValidType) {
			showNoti('danger', `${file.name} không đúng định dạng (jpg | jpeg | png | bmp).`);
		}
		return isValidType;
	};

	const handleUploadAvatar = async (file) => {
		try {
			if (file.file.status === 'uploading') {
				setLoadingImage(true);
				return;
			}
			if (file.file.status === 'done') {
				setLoadingImage(true);
				const res = await paymentConfig.uploadLogo(file.file.originFileObj);
				// const res = await studentApi.uploadImage(file.file.originFileObj);
				if (res.status === 200) {
					setImageUrl(res.data.data);
					showNoti('success', 'Tải ảnh thành công!');
					form.setFieldsValue({ PaymentLogo: res.data.data });
					return res;
				}
			}
		} catch (err) {
			console.log('UploadAvatarField-handleUploadAvatar', err);
		} finally {
			setLoadingImage(false);
		}
	};

	function getBase64(img, callback) {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		reader.readAsDataURL(img);
	}

	const UploadButton = (props) => {
		return (
			<>
				<div className={`bg-upload  ${loadingImage && 'loading'}`}>{loadingImage ? <LoadingOutlined /> : <PlusOutlined />}</div>
			</>
		);
	};

	const _onFinish = async (data) => {
		setIsLoading({
			type: 'UPLOADING',
			status: true
		});
		try {
			if (props.type === 'delete') {
				let res = await paymentConfig.update({ ID: method.ID, Enable: false });
				if (res.status === 200) {
					showNoti('success', res.data.message);
					setVisible(false);
					props.fetchData();
				}
			} else if (props.type === 'add') {
				let res = await paymentConfig.add({ ...data, PaymentName: method.Name, PaymentCode: method.Code });
				if (res.status === 200) {
					showNoti('success', res.data.message);
					setVisible(false);
					!props.dataPayment && form.resetFields();
					props.fetchData();
				}
			} else {
				let res = await paymentConfig.update({ ...data, PaymentName: method.Name, ID: method.ID, Enable: true });
				if (res.status === 200) {
					showNoti('success', res.data.message);
					setVisible(false);
					props.fetchData();
				}
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'UPLOADING',
				status: false
			});
		}
	};

	useEffect(() => {
		if (props.dataPayment) {
			form.setFieldsValue({
				PaymentName: {
					key: props.dataPayment.PaymentCode,
					label: props.dataPayment.PaymentName,
					value: props.dataPayment.PaymentCode
				},
				PaymentLogo: props.dataPayment.PaymentLogo
			});
		}
		props.dataPayment &&
			setMethod({ Name: props.dataPayment.PaymentName, Code: props.dataPayment.PaymentCode, ID: props.dataPayment.ID });
		renderPaymentField();
	}, [props.dataPayment]);

	return (
		<>
			{props.type == 'add' && (
				<button
					className="btn btn-warning"
					onClick={() => {
						setVisible(true);
					}}
					type="button"
				>
					Thêm phương thức
				</button>
			)}

			{props.type == 'edit' && (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setVisible(true);
					}}
					type="button"
				>
					<Tooltip title="Sửa phương thức thanh toán">
						<RotateCw />
					</Tooltip>
				</button>
			)}
			{props.type == 'delete' && (
				<button
					className="btn  btn-icon delete"
					onClick={() => {
						setVisible(true);
					}}
					type="button"
				>
					<Tooltip title="Ẩn phương thức thành toán">
						<X />
					</Tooltip>
				</button>
			)}
			<Modal
				visible={visible}
				footer={null}
				title={
					(props.type == 'add' && 'Thêm phương thức') ||
					(props.type == 'edit' && 'Sửa phương thức') ||
					(props.type == 'delete' && 'Ẩn phương thức')
				}
				onCancel={() => {
					setVisible(false);
				}}
			>
				<Form form={form} onFinish={_onFinish} layout="vertical">
					<div className="row">
						{props.type && props.type === 'delete' ? (
							<div className="col-12 mb-3">
								<h5>Bạn xác nhận ẩn phương thức này?</h5>
							</div>
						) : (
							<>
								<div className="col-12 mb-3">
									<Form.Item
										label="Tên phương thức "
										name="PaymentName"
										initialValue={props.dataPayment && props.dataPayment.PaymentName}
										rules={[{ required: true, message: 'Bạn không được để trống' }]}
									>
										<Select
											onChange={handleSelectMethod}
											placeholder="Chọn phương thức"
											labelInValue
											size="large"
											style={{ width: '100%' }}
											className="style-input"
											disabled={props.dataPayment && props.dataPayment}
											optionFilterProp="children"
											showSearch
										>
											{renderSelectMethod()}
										</Select>
									</Form.Item>
								</div>
								{renderPaymentField()}
								<div className="col-12 mb-3">
									<Form.Item name="PaymentLogo" label="Ảnh Logo">
										<Upload
											name="PaymentLogo"
											listType="picture-card"
											className="avatar-uploader"
											showUploadList={false}
											beforeUpload={beforeUpload}
											onChange={handleUploadAvatar}
										>
											{loadingImage ? (
												<Spin size="large" />
											) : imageUrl && imageUrl.length > 0 ? (
												<img
													src={imageUrl}
													alt="avatar"
													style={{
														width: '100%',
														height: '100%',
														objectFit: 'cover',
														display: (imageUrl && imageUrl.length > 0) || props.dataPayment ? 'block' : 'none'
													}}
												/>
											) : (
												<img
													src={props.dataPayment && props.dataPayment.PaymentLogo}
													alt="avatar"
													style={{
														width: '100%',
														height: '100%',
														objectFit: 'cover',
														display: (imageUrl && imageUrl.length > 0) || props.dataPayment ? 'block' : 'none'
													}}
												/>
											)}
											<UploadButton />
										</Upload>
									</Form.Item>
								</div>
							</>
						)}
						<div className="col-12">
							{props.type && props.type === 'delete' ? (
								<button
									className="btn btn-primary w-100"
									type="submit"
									disabled={isLoading.type == 'UPLOADING' && isLoading.status}
								>
									{isLoading.type == 'UPLOADING' && isLoading.status ? <Spin /> : 'Xóa'}
								</button>
							) : (
								<button
									className="btn btn-primary w-100"
									type="submit"
									disabled={(isLoading.type == 'UPLOADING' && isLoading.status) || !method.Code || loadingImage}
								>
									{isLoading.type == 'UPLOADING' && isLoading.status ? <Spin /> : 'Lưu'}
								</button>
							)}
						</div>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default AddPaymentMethodForm;
