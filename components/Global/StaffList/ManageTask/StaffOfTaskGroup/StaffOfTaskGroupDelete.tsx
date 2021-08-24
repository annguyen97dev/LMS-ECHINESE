import {Tooltip} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {AlertTriangle, X} from 'react-feather';

const StaffOfTaskGroupDelete = (props) => {
	const {handleDeleteStaffOfTaskGroup, index} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const checkHandleDeleteStaffOfTaskGroup = () => {
		if (!handleDeleteStaffOfTaskGroup) return;
		if (index < 0) return;
		handleDeleteStaffOfTaskGroup(index);
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
					<X />
				</button>
			</Tooltip>
			<Modal
				title={<AlertTriangle color="red" />}
				visible={isModalVisible}
				onOk={() => checkHandleDeleteStaffOfTaskGroup()}
				onCancel={() => setIsModalVisible(false)}
			>
				<p className="text-confirm">Bạn có chắc muốn xóa?</p>
			</Modal>
		</>
	);
};
StaffOfTaskGroupDelete.propTypes = {
	handleDeleteStaffOfTaskGroup: PropTypes.func,
	index: PropTypes.number.isRequired,
};
StaffOfTaskGroupDelete.defaultProps = {
	handleDeleteStaffOfTaskGroup: null,
};
export default StaffOfTaskGroupDelete;
