import React, { useState, useEffect } from 'react';
import { Modal, Form, Tooltip, Select, Input, Upload, message, Spin } from 'antd';
import { RotateCw, X } from 'react-feather';
import EditorSimple from '~/components/Elements/EditorSimple';
import { useWrap } from '~/context/wrap';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { paymentConfig } from '~/apiBase/shopping-cart/payment-config';

const AddPaymentMethodForm = (props) => {
	const [visible, setVisible] = useState(false);
	const [method, setMethod] = useState({ Name: null, Code: null });
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
		setMethod({ Name: info.label, Code: info.value });
	};

	const renderSelectMethod = () => {
		return (
			props.paymentMethod &&
			props.paymentMethod.map((item, index) => {
				return (
					<>
						<Option key={index} value={item.PaymentCode} val="valentino">
							{item.PaymentName}
						</Option>
					</>
				);
			})
		);
	};

	const renderPaymentField = () => {
		switch (method.Code) {
			case 'momo':
				return (
					<>
						<div className="col-12 mb-3">
							<Form.Item name="accessKey" label="Access Key" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
								<Input placeholder="Nhập Access Key" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item name="secretKey" label="Secret Key" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
								<Input placeholder="Nhập Secret Key" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="partnerCode"
								label="Partner Code"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Input placeholder="Nhập Partner Code" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="partnerName"
								label="Partner Name"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Input placeholder="Nhập Partner Name" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item name="endPoint" label="End Point" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
								<Input placeholder="Nhập End Point" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
					</>
				);
			case 'momo_test':
				return (
					<>
						<div className="col-12 mb-3">
							<Form.Item name="accessKey" label="Access Key" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
								<Input placeholder="Nhập Access Key" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item name="secretKey" label="Secret Key" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
								<Input placeholder="Nhập Secret Key" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="partnerCode"
								label="Partner Code"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Input placeholder="Nhập Partner Code" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="partnerName"
								label="Partner Name"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Input placeholder="Nhập Partner Name" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item name="endPoint" label="End Point" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
								<Input placeholder="Nhập End Point" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
					</>
				);
			case 'paypal':
				return (
					<>
						{' '}
						<div className="col-12 mb-3">
							<Form.Item name="clientId" label="Client ID" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
								<Input placeholder="Nhập Client ID" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="clientSecret"
								label="Client Secrect"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Input placeholder="Nhập Client Secrect" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
					</>
				);
			case 'paypal_test':
				return (
					<>
						{' '}
						<div className="col-12 mb-3">
							<Form.Item name="clientId" label="Client ID" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
								<Input placeholder="Nhập Client ID" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="clientSecret"
								label="Client Secrect"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
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
							>
								<Input placeholder="Nhập Secure Secrect" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="accessCode"
								label="Access Code"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Input placeholder="Nhập Access Code" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="merchantID"
								label="Merchant ID"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Input placeholder="Nhập Merchant ID" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item name="endPoint" label="End Point" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
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
							>
								<Input placeholder="Nhập Secure Secrect" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="accessCode"
								label="Access Code"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Input placeholder="Nhập Access Code" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="merchantID"
								label="Merchant ID"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Input placeholder="Nhập Merchant ID" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item name="endPoint" label="End Point" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
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
							>
								<Input placeholder="Nhập Secure Secrect" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="accessCode"
								label="Access Code"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Input placeholder="Nhập Access Code" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="merchantID"
								label="Merchant ID"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Input placeholder="Nhập Merchant ID" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item name="endPoint" label="End Point" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
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
							>
								<Input placeholder="Nhập Secure Secrect" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="accessCode"
								label="Access Code"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Input placeholder="Nhập Access Code" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item
								name="merchantID"
								label="Merchant ID"
								rules={[{ required: true, message: 'Bạn không được để trống' }]}
							>
								<Input placeholder="Nhập Merchant ID" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
						<div className="col-12 mb-3">
							<Form.Item name="endPoint" label="End Point" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
								<Input placeholder="Nhập End Point" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
					</>
				);
			case 'cashpayment':
				return (
					<>
						<div className="col-12 mb-3">
							<Form.Item name="endPoint" label="Địa Chỉ" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
								<Input placeholder="Nhập Địa Chỉ" className="style-input" allowClear={true} />
							</Form.Item>
						</div>
					</>
				);
			case 'transferpayment':
				return (
					<>
						<div className="col-12 mb-3">
							<EditorSimple isSimpleTool={false} height={300} isTranslate={false} handleChange={() => {}} />
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
		console.log(file.file.originFileObj);
		try {
			if (file.file.status === 'uploading') {
				setLoadingImage(true);
				return;
			}
			if (file.file.status === 'done') {
				const res = await paymentConfig.uploadLogo(file.originFileObj);
				if (res.status === 200) {
					setImageUrl(res.data.data);
					showNoti('success', 'success');
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

	const handleChange = (info) => {
		if (info.file.status === 'uploading') {
			setIsLoading({ type: 'UPLOAD_IMG', status: true });
			return;
		}
		if (info.file.status === 'done') {
			// Get this url from response in real world.
			getBase64(
				info.file.originFileObj,
				(imageUrl) =>
					// this.setState({
					// 	imageUrl,
					// 	loading: false,
					// }),
					setIsLoading({ type: 'UPLOAD_IMG', status: true })
				// setImageUrl(imageUrl)
			);
		}
	};

	const _onFinish = (data) => {
		console.log(data);
	};

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
						form.resetFields();
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
					<Tooltip title="Xóa nhu cầu học">
						<X />
					</Tooltip>
				</button>
			)}
			<Modal
				visible={visible}
				footer={null}
				title={
					(props.type == 'add' && 'Thêm phương thức') ||
					(props.type == 'edit' && 'Xóa phương thức') ||
					(props.type == 'delete' && 'Xóa phương thức')
				}
				onCancel={() => {
					setVisible(false);
				}}
			>
				<Form form={form} onFinish={_onFinish} layout="vertical">
					<div className="row">
						<div className="col-12 mb-3">
							<Form.Item>
								<Select
									onChange={handleSelectMethod}
									placeholder="Chọn phương thức"
									labelInValue
									size="large"
									style={{ width: '100%' }}
									className="style-input"
								>
									{renderSelectMethod()}
								</Select>
							</Form.Item>
						</div>
						{renderPaymentField()}
						<div className="col-12 mb-3">
							<Form.Item name="PaymentLogo">
								{' '}
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
									) : (
										<img
											src={imageUrl}
											alt="avatar"
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
												display: imageUrl && imageUrl.length > 0 ? 'block' : 'none'
											}}
										/>
									)}
									<UploadButton />
								</Upload>
							</Form.Item>
						</div>
						<div className="col-12">
							<button
								className="btn btn-primary w-100"
								type="submit"
								disabled={(isLoading.type == 'ADD_DATA' && isLoading.status) || !method.Code}
							>
								Lưu
							</button>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default AddPaymentMethodForm;
