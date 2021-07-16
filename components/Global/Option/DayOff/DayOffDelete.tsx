import {Tooltip} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {AlertTriangle, X} from 'react-feather';

const DayOffDelete = (props) => {
	const {handleDeleteDayOff, index} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const checkHandleDeleteDayOff = () => {
		if (!handleDeleteDayOff) return;
		if (index < 0) return;
		handleDeleteDayOff(index);
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
				<p className="text-confirm">Bạn có chắc muốn xóa ngày nghỉ này?</p>
			</Modal>
		</>
	);
};
DayOffDelete.propTypes = {
	handleDeleteDayOff: PropTypes.func,
	index: PropTypes.number.isRequired,
};
DayOffDelete.defaultProps = {
	handleDeleteDayOff: null,
};
export default DayOffDelete;
