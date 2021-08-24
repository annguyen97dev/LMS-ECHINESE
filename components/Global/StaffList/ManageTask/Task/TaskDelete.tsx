import {Tooltip} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {AlertTriangle, XSquare} from 'react-feather';

const TaskDelete = (props) => {
	const {handleDeleteTask, index} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const checkHandleDeleteTask = () => {
		if (!handleDeleteTask) return;
		if (index < 0) return;
		handleDeleteTask(index);
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
					<XSquare />
				</button>
			</Tooltip>
			<Modal
				title={<AlertTriangle color="red" />}
				visible={isModalVisible}
				onOk={() => checkHandleDeleteTask()}
				onCancel={() => setIsModalVisible(false)}
			>
				<p className="text-confirm">Bạn có chắc muốn xóa?</p>
			</Modal>
		</>
	);
};
TaskDelete.propTypes = {
	handleDeleteTask: PropTypes.func,
	index: PropTypes.number.isRequired,
};
TaskDelete.defaultProps = {
	handleDeleteTask: null,
};
export default TaskDelete;
