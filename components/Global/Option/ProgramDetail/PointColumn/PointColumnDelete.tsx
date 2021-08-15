import {Tooltip} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {AlertTriangle, X} from 'react-feather';

const PointColumnDelete = (props) => {
	const {handleDeletePointColumn, index} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const checkHandleDeletePointColumn = () => {
		if (!handleDeletePointColumn) return;
		if (index < 0) return;
		handleDeletePointColumn(index);
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
				onOk={() => checkHandleDeletePointColumn()}
				onCancel={() => setIsModalVisible(false)}
			>
				<p className="text-confirm">Bạn có chắc muốn xóa?</p>
			</Modal>
		</>
	);
};
PointColumnDelete.propTypes = {
	handleDeletePointColumn: PropTypes.func,
	index: PropTypes.number.isRequired,
};
PointColumnDelete.defaultProps = {
	handleDeletePointColumn: null,
};
export default PointColumnDelete;
