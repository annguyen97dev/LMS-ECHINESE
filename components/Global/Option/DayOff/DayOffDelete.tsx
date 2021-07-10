import {Tooltip} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, {useState} from 'react';
import {AlertTriangle, X} from 'react-feather';

const DayOffDelete = (props) => {
	const {handleDeleteDayOff, deleteObj, index} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const checkHandleDeleteDayOff = () => {
		if (!handleDeleteDayOff) return;
		if (!deleteObj?.ID || index < 0) return;
		console.log(deleteObj, index);
		handleDeleteDayOff(deleteObj.ID, index);
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

export default DayOffDelete;
