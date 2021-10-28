import React, { useEffect, useState } from 'react';
import { Modal, Button, Tooltip, Input, Form, InputNumber } from 'antd';
import { FormOutlined } from '@ant-design/icons';

const MarkingExam = (props) => {
	const { onGetPoint, dataMarking, dataRow } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [valuePoint, setValuePoint] = useState(null);
	const [form] = Form.useForm();
	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleSubmit = () => {
		if (valuePoint) {
			setIsModalVisible(false);
			onGetPoint && onGetPoint(valuePoint);
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setValuePoint(null);
	};

	const onChange_Point = (value) => {
		console.log('này là gì: ', value);
		setValuePoint(value);
	};

	useEffect(() => {
		if (dataMarking) {
			dataMarking.setPackageExerciseStudentsList.every((item) => {
				if (item.ID === dataRow.ExerciseID) {
					if (item.Point == 0) {
						setValuePoint(null);
					} else {
						setValuePoint(item.Point);
					}

					return false;
				}
				return true;
			});
		}
	}, [dataMarking]);

	return (
		<>
			<Tooltip title="Chấm bài">
				<button className="btn btn-icon edit" onClick={showModal}>
					<FormOutlined />
				</button>
			</Tooltip>
			<Modal title="Form chấm bài" visible={isModalVisible} onCancel={handleCancel} footer={null}>
				<Form layout="vertical" form={form} onFinish={handleSubmit}>
					<Form.Item
						className="mb-0"
						label="Nhập điểm"
						name="Point"
						rules={[
							{ required: true, message: 'Vui lòng nhập điểm' },
							{ type: 'number', max: dataRow.PointMax, message: 'Điểm không được lớn hơn điểm tối đa' }
						]}
					>
						<InputNumber className="style-input" value={valuePoint} onChange={(e) => onChange_Point(e)} />
					</Form.Item>
					<p className="mb-0 mt-2 font-italic">Điểm tối đa: {dataRow.PointMax}</p>
					<button type="submit" className="btn btn-primary w-100 mt-3">
						Lưu
					</button>
				</Form>
			</Modal>
		</>
	);
};

export default MarkingExam;
