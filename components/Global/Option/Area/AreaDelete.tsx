import {Tooltip} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {AlertTriangle, X} from 'react-feather';

const AreaDelete = (props) => {
	const {handleDeleteArea, index} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const checkHandleDeleteArea = () => {
		if (!handleDeleteArea) return;
		if (index < 0) return;
		handleDeleteArea(index);
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
				onOk={() => checkHandleDeleteArea()}
				onCancel={() => setIsModalVisible(false)}
			>
				<p className="text-confirm">Bạn có chắc muốn xóa tỉnh/thành phố này?</p>
			</Modal>
		</>
	);
};
AreaDelete.propTypes = {
	handleDeleteArea: PropTypes.func,
	index: PropTypes.number.isRequired,
};
AreaDelete.defaultProps = {
	handleDeleteArea: null,
};
export default AreaDelete;
