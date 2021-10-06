import {Tooltip} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {AlertTriangle, Power} from 'react-feather';

const CloseZoomRoom = (props) => {
	const {handleClose} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const checkHandleClose = () => {
		if (!handleClose) return;
		handleClose();
		setIsModalVisible(false);
	};
	return (
		<>
			<Tooltip title="Xóa">
				<button
					type="button"
					className="btn btn-icon delete"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					<Power />
				</button>
			</Tooltip>
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
	handleClose: PropTypes.func,
};
CloseZoomRoom.defaultProps = {
	handleClose: null,
};
export default CloseZoomRoom;
