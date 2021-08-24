import {Tooltip} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {AlertTriangle, X} from 'react-feather';

const TaskGroupDelete = (props) => {
	const {handleDeleteTaskGroup, index} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const checkHandleDeleteTaskGroup = () => {
		if (!handleDeleteTaskGroup) return;
		if (index < 0) return;
		handleDeleteTaskGroup(index);
		setIsModalVisible(false);
	};
	return (
		<>
			<Tooltip title="Xóa">
				<button
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
				onOk={() => checkHandleDeleteTaskGroup()}
				onCancel={() => setIsModalVisible(false)}
			>
				<p className="text-confirm">Bạn có chắc muốn xóa?</p>
			</Modal>
		</>
	);
};
TaskGroupDelete.propTypes = {
	handleDeleteTaskGroup: PropTypes.func,
	index: PropTypes.number.isRequired,
};
TaskGroupDelete.defaultProps = {
	handleDeleteTaskGroup: null,
};
export default TaskGroupDelete;
