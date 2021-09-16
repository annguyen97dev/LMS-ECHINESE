import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {AlertTriangle, Trash2} from 'react-feather';

const DeleteGroup = (props) => {
	const {handleDelete, text} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const checkHandleDelete = () => {
		if (!handleDelete) return;
		handleDelete();
		setIsModalVisible(false);
	};
	return (
		<>
			<button
				className="btn del"
				onClick={() => {
					setIsModalVisible(true);
				}}
			>
				<Trash2 />
				Xóa nhóm
			</button>
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
DeleteGroup.propTypes = {
	handleDelete: PropTypes.func,
	text: PropTypes.string,
};
DeleteGroup.defaultProps = {
	handleDelete: null,
	text: '',
};
export default DeleteGroup;
