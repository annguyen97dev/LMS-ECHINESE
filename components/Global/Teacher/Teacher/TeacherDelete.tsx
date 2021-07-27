import {Tooltip} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {AlertTriangle, X} from 'react-feather';

const TeacherDelete = (props) => {
	const {handleDeleteTeacher, index} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const checkHandleDeleteDayOff = () => {
		if (!handleDeleteTeacher) return;
		if (index < 0) return;
		handleDeleteTeacher(index);
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
				<p className="text-confirm">Bạn có chắc muốn xóa giáo viên này?</p>
			</Modal>
		</>
	);
};
TeacherDelete.propTypes = {
	handleDeleteTeacher: PropTypes.func,
	index: PropTypes.number.isRequired,
};
TeacherDelete.defaultProps = {
	handleDeleteTeacher: null,
};
export default TeacherDelete;
