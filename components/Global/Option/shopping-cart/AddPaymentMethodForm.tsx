import React, { useState, useEffect } from 'react';
import { Modal, Form, Tooltip, Select, Input } from 'antd';
import { RotateCw, X } from 'react-feather';
import EditorSimple from '~/components/Elements/EditorSimple';

const AddPaymentMethodForm = (props) => {
	// interface Method {
	//     Code: String;
	//     Name: String
	// }
	const [visible, setVisible] = useState(false);
	const [method, setMethod] = useState({ Name: null, Code: null });
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [form] = Form.useForm();
	const { Option } = Select;
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
							<EditorSimple isSimpleTool={false} height={100} isTranslate={false} handleChange={() => {}} />
						</div>
					</>
				);
			default:
				break;
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
							<Select
								onChange={handleSelectMethod}
								// value={method.Name}
								placeholder="Chọn phương thức"
								labelInValue
								size="large"
								style={{ width: '100%' }}
								className="style-input"
							>
								{renderSelectMethod()}
							</Select>
						</div>
						{renderPaymentField()}
						<div className="col-12">
							<button
								className="btn btn-primary w-100"
								type="submit"
								disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
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
