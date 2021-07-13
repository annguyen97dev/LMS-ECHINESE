import {Tooltip} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {AlertTriangle, X} from 'react-feather';

const DayOffDelete = (props) => {
	const {handleDeleteDayOff, deleteIDObj, index} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const checkHandleDeleteDayOff = () => {
		if (!handleDeleteDayOff) return;
		if (!deleteIDObj || index < 0) return;
		handleDeleteDayOff(deleteIDObj, index);
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
				onOk={() => checkHandleDeleteDayOff()}
				onCancel={() => setIsModalVisible(false)}
			>
				Bạn có chắc muốn xóa ngày nghỉ này?
			</Modal>
		</>
	);
};
DayOffDelete.propTypes = {
	handleDeleteDayOff: PropTypes.func,
	deleteIDObj: PropTypes.number.isRequired,
	index: PropTypes.number.isRequired,
};
DayOffDelete.defaultProps = {
	handleDeleteDayOff: null,
};
export default DayOffDelete;
