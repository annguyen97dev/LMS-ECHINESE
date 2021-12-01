import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const PopupConfirm = (props) => {
	const { children, okText = 'Ok', cancelText = 'Cancel', isOpen, onCancel, onOk } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
		onOk && onOk();
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		onCancel && onCancel();
	};

	useEffect(() => {
		isOpen && setIsModalVisible(true);
	}, [isOpen]);

	return (
		<Modal
			title={
				<button className="btn btn-icon">
					<InfoCircleOutlined />
				</button>
			}
			visible={isModalVisible}
			onOk={handleOk}
			onCancel={handleCancel}
			okText={okText}
			cancelText={cancelText}
		>
			{children}
		</Modal>
	);
};

export default PopupConfirm;
