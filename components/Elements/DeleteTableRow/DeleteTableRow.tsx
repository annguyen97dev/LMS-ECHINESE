import { Tooltip } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { AlertTriangle, X } from 'react-feather';

const DeleteTableRow = (props) => {
	const { handleDelete, text } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const checkHandleDelete = () => {
		if (!handleDelete) return;
		handleDelete();
		setIsModalVisible(false);
	};
	return (
		<>
			<Tooltip title="Đóng phòng học">
				<button
					type="button"
					className="btn btn-icon delete"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					<X />
				</button>
			</Tooltip>
			<Modal
				title={<AlertTriangle color="red" />}
				visible={isModalVisible}
				onOk={() => checkHandleDelete()}
				onCancel={() => setIsModalVisible(false)}
			>
				<p className="text-confirm">Bạn có chắc muốn xóa {text}?</p>
			</Modal>
		</>
	);
};
DeleteTableRow.propTypes = {
	handleDelete: PropTypes.func,
	text: PropTypes.string
};
DeleteTableRow.defaultProps = {
	handleDelete: null,
	text: ''
};
export default DeleteTableRow;
