import { Button } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { AlertTriangle, Power } from 'react-feather';

const CloseZoomRoom = (props) => {
	const { handleClose, isIcon } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const checkHandleClose = () => {
		if (!handleClose) return;
		handleClose();
		setIsModalVisible(false);
	};
	return (
		<>
			{isIcon ? (
				<button
					type="button"
					className="btn btn-icon delete"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					<Power />
				</button>
			) : (
				<Button
					size="middle"
					className="mt-1 btn-secondary w-100"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					Đóng phòng học
				</Button>
			)}
			<Modal
				title={<AlertTriangle color="red" />}
				visible={isModalVisible}
				onOk={() => checkHandleClose()}
				onCancel={() => setIsModalVisible(false)}
			>
				<p className="text-confirm">Bạn có chắc muốn đóng phòng học này?</p>
			</Modal>
		</>
	);
};
CloseZoomRoom.propTypes = {
	isIcon: PropTypes.bool,
	handleClose: PropTypes.func
};
CloseZoomRoom.defaultProps = {
	isIcon: true,
	handleClose: null
};
export default CloseZoomRoom;
