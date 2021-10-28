import { ExclamationCircleOutlined, FormOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { packageResultDetailApi } from '~/apiBase/package/package-result-detail';
import { useDoneTest } from '~/context/useDoneTest';
import { useWrap } from '~/context/wrap';
import { Modal, Input, Spin } from 'antd';

const { TextArea } = Input;

const DoneMarkingExam = (props) => {
	const { onDoneMarking } = props;
	const { dataMarking, getDataMarking } = useDoneTest();
	const { showNoti } = useWrap();
	const [loading, setLoading] = useState(false);

	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		handleMarkingExam();
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleMarkingExam = async () => {
		setLoading(true);
		try {
			let res = await packageResultDetailApi.updatePoint(dataMarking);
			if (res.status === 200) {
				showNoti('success', 'Hoàn tất chấm bài');
				onDoneMarking && onDoneMarking();
				setIsModalVisible(false);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoading(false);
		}
	};

	const onChange_note = (value) => {
		getDataMarking({
			...dataMarking,
			Note: value
		});
	};

	return (
		<>
			<button className="btn btn-warning ml-2" onClick={showModal}>
				<span className="d-flex align-items-center">
					<FormOutlined className="mr-2" />
					Hoàn tất chấm bài
				</span>
			</button>
			<Modal
				title="Xác nhận hoàn tất chấm bài"
				footer={null}
				visible={isModalVisible}
				// onOk={handleOk}
				onCancel={handleCancel}
				// confirmLoading={loading}
			>
				<p style={{ fontWeight: 500 }}>Ghi chú</p>
				<TextArea onChange={(e) => onChange_note(e.target.value)}></TextArea>
				<button className="btn btn-primary w-100 mt-3" onClick={handleMarkingExam}>
					Lưu
					{loading && <Spin className="loading-base" />}
				</button>
			</Modal>
		</>
	);
};

export default DoneMarkingExam;
