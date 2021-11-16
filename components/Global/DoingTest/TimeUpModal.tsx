import { QuestionCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';

const TimeUpModal = (props) => {
	const { isVisible } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	useEffect(() => {}, [isVisible]);

	return (
		<>
			<Modal
				title={
					<button className="btn btn-icon delete">
						<QuestionCircleOutlined />
					</button>
				}
				visible={isModalVisible}
				footer={null}
			>
				<div className="text-center">
					<h5 className="mb-2">Hết giờ!</h5>
					<p className="font-weight-black">Hệ thống sẽ tự nộp bài ngay bây giờ</p>
				</div>
			</Modal>
			;
		</>
	);
};

export default TimeUpModal;
