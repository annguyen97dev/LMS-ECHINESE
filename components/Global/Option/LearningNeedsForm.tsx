import React, { useEffect, useState } from 'react';
import { Modal, Form } from 'antd';

const LearningNeedsForm = () => {
	const [visible, setVisible] = useState(false);
	const [form] = Form.useForm();

	const handleCancel = () => {
		setVisible(false);
	};

	const _onSubmit = () => {};

	return (
		<>
			<button
				className="btn btn-warning"
				onClick={() => {
					setVisible(true);
				}}
			>
				Thêm nhu cầu học
			</button>
			<Modal visible={visible} onCancel={handleCancel}>
				<Form form={form} onFinish={_onSubmit}></Form>
			</Modal>
		</>
	);
};

export default LearningNeedsForm;
