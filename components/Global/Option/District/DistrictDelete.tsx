import {Tooltip} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {AlertTriangle, X} from 'react-feather';

const DistrictDelete = (props) => {
	const {handleDeleteDistrict, index} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const checkHandleDeleteArea = () => {
		if (!handleDeleteDistrict) return;
		if (index < 0) return;
		handleDeleteDistrict(index);
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
				<p className="text-confirm">Bạn có chắc muốn xóa quận này?</p>
			</Modal>
		</>
	);
};
DistrictDelete.propTypes = {
	handleDeleteDistrict: PropTypes.func,
	index: PropTypes.number.isRequired,
};
DistrictDelete.defaultProps = {
	handleDeleteDistrict: null,
};
export default DistrictDelete;
