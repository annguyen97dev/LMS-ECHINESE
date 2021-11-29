import React, { useEffect, useState } from 'react';
import { Tooltip, Modal, Checkbox, Input } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { useExamDetail } from '~/pages/question-bank/exam-list/exam-detail/[slug]';

const ChangePosition = (props) => {
	const { questionID } = props;
	const { getDataChange, dataChange, isChangePosition } = useExamDetail();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isConfirmChangePosition, setIsConfirmChangePosition] = useState(false);

	// ACTION SHOW MODAL
	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	// ON CHANGE POSITION FROM
	// const onChange_PositionFrom = () => {
	// 	!isConfirmChangePosition && showModal();
	// 	getDataChange({
	// 		IDChangeOne: questionID,
	// 		IDChangeTwo: null
	// 	});

	// 	if (dataChange.IDChangeOne === questionID) {
	// 		getDataChange({
	// 			IDChangeOne: null,
	// 			IDChangeTwo: null
	// 		});
	// 	}
	// };

	// ON CHANGE POSITION TO
	const onChange_PositionTo = (e) => {
		let value = parseInt(e.target.value);
		let cloneData = [...dataChange];
		console.log('VALUE: ', value);

		if (Number.isNaN(value)) {
			value = null;
		}

		let index = dataChange.findIndex((item) => item.ID === questionID);
		cloneData[index].Index = value;
		getDataChange(cloneData);
	};

	// ON CHANGE CONFRIM UNDERSTAND
	const onChange_ConfirmUnderstand = (checked) => {
		if (checked) {
			window.localStorage.setItem('confirmChangePosition', 'true');
			setIsConfirmChangePosition(true);
		}
	};

	useEffect(() => {
		let checkConfirm = JSON.parse(window.localStorage.getItem('confirmChangePosition'));

		if (checkConfirm) {
			setIsConfirmChangePosition(true);
		}
	}, []);

	return (
		<>
			{/* {dataChange.IDChangeOne == questionID || dataChange.IDChangeOne == null ? (
				<Tooltip title="Đổi vị trí">
					<button className="btn btn-icon exchange" onClick={onChange_PositionFrom}>
						<SyncOutlined />
					</button>
				</Tooltip>
			) : (
				<Checkbox
				  className="checkbox-addquestion"
				  onChange={(e) => onChange_PositionTo(e.target.checked)}
				/>
				
			)} */}

			{isChangePosition && (
				<Tooltip title="Nhập vị trí vào đây">
					<Input type="number" className="input-position" onChange={onChange_PositionTo} />
				</Tooltip>
			)}

			<Modal
				title="Chú ý!"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
				okText="Đã hiểu"
				cancelText="Đóng"
				footer={
					<div className="d-flex align-items-center justify-content-between">
						<Checkbox onChange={onChange_ConfirmUnderstand}>Không hiện thông báo này nữa</Checkbox>
						<button className="btn btn-primary" onClick={handleCancel}>
							Đã hiểu
						</button>
					</div>
				}
			>
				<p style={{ fontWeight: 500 }}>Tích vào ô checkbox(cạnh nút xóa) để đổi vị trí.</p>
			</Modal>
		</>
	);
};

export default ChangePosition;
