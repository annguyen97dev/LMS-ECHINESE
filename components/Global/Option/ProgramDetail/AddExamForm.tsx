import React, { useEffect, useState } from 'react';
import { Modal, Tooltip, Divider, Button } from 'antd';
import { curriculumDetailApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import { Select } from 'antd';
import { Info } from 'react-feather';

const { Option } = Select;

const AddExamForm = (props) => {
	const { dataRow, dataExamTopic, onFetchData, currentCheckID, disable } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [ExamID, setExamID] = useState(dataRow.ExamTopicID && dataRow.ExamTopicID !== 0 ? dataRow.ExamTopicID : null);
	const { showNoti } = useWrap();

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = async () => {
		if (disable) {
			setIsModalVisible(false);
		} else {
			setIsLoading(true);
			try {
				let res = await curriculumDetailApi.update({ ID: dataRow.ID, ExamTopicID: ExamID, IsExam: true });
				if (res.status == 200) {
					showNoti('success', 'Cập nhật đề kiểm tra thành công');
					setIsModalVisible(false);
					onFetchData && onFetchData();
				} else {
					showNoti('danger', 'Đường truyền mạng đang không ổn định');
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading(false);
			}
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleChange_SelectExam = (value) => {
		setExamID(value);
	};

	useEffect(() => {
		if (currentCheckID == dataRow.ID) {
			showModal();
		}
	}, [currentCheckID]);

	return (
		<>
			<button className="btn btn-icon" onClick={showModal}>
				<Tooltip title="Xem thông tin">
					<Info />
				</Tooltip>
			</button>
			<Modal
				title="Thêm đề kiểm tra"
				visible={isModalVisible}
				okText={disable ? 'OK' : 'LƯU'}
				cancelText="Hủy"
				cancelButtonProps={null}
				okButtonProps={{ loading: isLoading }}
				onOk={handleOk}
				footer={null}
				onCancel={handleCancel}
			>
				<p className="font-weight-black mb-2">Chọn đề kiểm tra</p>
				<Select value={ExamID} className="style-input" onChange={handleChange_SelectExam} disabled={disable == true ? true : false}>
					{dataExamTopic?.map((item) => (
						<Option key={item.ID} value={item.ID}>
							{item.Name}
						</Option>
					))}
				</Select>
				<Divider style={{ width: 550, marginLeft: -25, marginRight: -25, marginBottom: 0 }} />
				<div style={{ display: 'flex', width: '100%', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
					<Button onClick={handleOk} className="btn btn-primary" style={{ marginTop: 15, marginBottom: -7 }}>
						OK
					</Button>
				</div>
			</Modal>
		</>
	);
};

export default AddExamForm;
