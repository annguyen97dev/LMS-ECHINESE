import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

const DecideModal = (props: any) => {
	const { isOk, isCancel, content, isOpen, addClass } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const handleOk = () => {
		setIsModalVisible(false);
		isOk();
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		isCancel();
	};

	useEffect(() => {
		setIsModalVisible(isOpen);
	}, [isOpen]);

	return (
		<>
			<Modal
				title="Chú ý"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				className="modal-decide"
				footer={
					<div className="text-center">
						<button className="btn btn-light mr-2" onClick={handleCancel}>
							Hủy
						</button>
						<button className="btn btn-primary" onClick={handleOk}>
							Nộp ngay
						</button>
					</div>
				}
			>
				<p className={`modal-decide__text ${addClass && addClass}`} style={{ fontWeight: 500 }}>
					{content ? content : ''}
				</p>
			</Modal>
		</>
	);
};

export default DecideModal;
