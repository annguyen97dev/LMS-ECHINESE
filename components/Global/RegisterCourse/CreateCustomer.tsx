import React, { useEffect, useState } from 'react';
import { Modal, Form, Input } from 'antd';
import { studentApi } from '~/apiBase';

const CreateCustomer = (props) => {
	const [visible, setVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({
		status: '',
		loading: false
	});
	const [form] = Form.useForm();

	const handleCancel = () => {
		setVisible(false);
	};

	const _onSubmit = async (data) => {
		console.log(data);
		setIsLoading({ status: 'CREATE_ACC', loading: true });
		try {
			let res = await studentApi.createAccount(data);
			if (res.status == 200) {
				props.fetchDataUser();
				setVisible(false);
				form.resetFields();
			}
		} catch (error) {
		} finally {
			setIsLoading({ status: 'CREATE_ACC', loading: false });
		}
	};
	return (
		<>
			<button
				className="btn btn-warning"
				onClick={() => {
					setVisible(true);
				}}
			>
				Tạo Học Viên
			</button>
			<Modal title="Thêm Học Viên" footer={null} visible={visible} onCancel={handleCancel}>
				<Form form={form} onFinish={_onSubmit} layout="vertical">
					<div className="row">
						<div className="col-12">
							<Form.Item label="Tên Học Viên" name="FullNameUnicode">
								<Input placeholder="Nhập tên học viên" allowClear size="large" className="style-input" />
							</Form.Item>
						</div>
						<div className="col-12">
							<Form.Item label="Email" name="Email">
								<Input placeholder="Nhập Email" allowClear size="large" className="style-input" />
							</Form.Item>
						</div>
						<div className="col-12">
							<Form.Item label="Số Điện Thoại" name="Mobile">
								<Input placeholder="Số điện thoại học viên" allowClear size="large" className="style-input" />
							</Form.Item>
						</div>
						<div className="col-12">
							<button className="btn btn-primary w-100" disabled={isLoading.status == 'CREATE_ACC' && isLoading.loading}>
								Lưu
							</button>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default CreateCustomer;
