import React, { useEffect, useState } from 'react';
import { Modal, Select, Tooltip } from 'antd';
import { DiffOutlined } from '@ant-design/icons';
import { testCustomerApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';

const { Option } = Select;

const TestAddExam = (props) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { dataExam, dataRow, onFetchData } = props;
	const [loading, setLoading] = useState(false);
	const { showNoti } = useWrap();
	const [valueExam, setValueExam] = useState(null);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = async () => {
		const data = {
			ID: dataRow.ID,
			ExamTopicID: valueExam,
			Enable: true
		};
		setLoading(true);
		try {
			let res = await testCustomerApi.update(data);
			if (res.status === 200) {
				setIsModalVisible(false);
				onFetchData && onFetchData();
				showNoti('success', 'Gán đề thành công');
			} else {
				showNoti('danger', 'Mạng đang kết nối không ổn định');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	function handleChange_exam(value) {
		setValueExam(value);
	}

	useEffect(() => {
		if (isModalVisible) {
			setValueExam(dataRow.ExamTopicnName);
		}
	}, [isModalVisible]);

	return (
		<>
			<Tooltip title="Thêm đề hẹn test">
				<button className="btn btn-icon view ml-2" onClick={showModal}>
					<DiffOutlined />
				</button>
			</Tooltip>
			<Modal
				title="Gán đề hẹn test"
				visible={isModalVisible}
				onOk={handleOk}
				confirmLoading={loading}
				okText="Thêm"
				onCancel={handleCancel}
			>
				<h6>Chọn đề</h6>
				<Select value={valueExam} className="style-input" onChange={handleChange_exam}>
					{dataExam?.map((item, index) => (
						<Option value={item.ID} key={index}>
							{item.Name}
						</Option>
					))}
				</Select>
			</Modal>
		</>
	);
};

export default TestAddExam;
