import React, { useState } from 'react';
import { Modal, Button, Tooltip } from 'antd';
import { ExclamationCircleOutlined, PayCircleOutlined } from '@ant-design/icons';

const AcceptPaid = (props) => {
	const { handleAccept } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
		handleAccept();
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	return (
		<>
			<Tooltip title="Duyệt thanh toán">
				<button className="btn btn-icon" onClick={showModal}>
					<PayCircleOutlined />
				</button>
			</Tooltip>
			<Modal
				title={
					<button className="btn btn-icon" onClick={showModal}>
						<ExclamationCircleOutlined />
					</button>
				}
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<p style={{ fontWeight: 500 }}>Xác nhận đã thanh toán?</p>
			</Modal>
		</>
	);
};

export default AcceptPaid;
