import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

const NotiModal = (props: any) => {
	const { isOk, isCancel, content, isOpen, addClass } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const handleOk = () => {
		setIsModalVisible(false);
		isOk && isOk();
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		isCancel && isCancel();
	};

	useEffect(() => {
		setIsModalVisible(isOpen);
	}, [isOpen]);

	return (
		<>
			<Modal
				title={
					<button className="btn btn-icon delete">
						<WarningOutlined />
					</button>
				}
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				className=""
				// footer={
				// 	<div className="text-center">
				// 		<button className="btn btn-light mr-2" onClick={handleCancel}>
				// 			Hủy
				// 		</button>
				// 		<button className="btn btn-primary" onClick={handleOk}>
				// 			Nộp ngay
				// 		</button>
				// 	</div>
				// }
			>
				<p className={`modal-decide__text ${addClass && addClass}`} style={{ fontWeight: 500 }}>
					{content ? content : ''}
				</p>
			</Modal>
		</>
	);
};

export default NotiModal;
