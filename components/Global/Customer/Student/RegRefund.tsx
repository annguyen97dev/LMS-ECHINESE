import React, { useState } from 'react';
import { Modal, Button, Form, Input, Select, Divider, Tooltip } from 'antd';
import { RotateCcw } from 'react-feather';

const RegRefund = () => {
	const { TextArea } = Input;
	const { Option } = Select;
	const [isModalVisible, setIsModalVisible] = useState(false);

	return (
		<>
			<Tooltip title="Hoàn trả phí">
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16 }}></i>
				</button>
			</Tooltip>

			<Modal
				title="Hoàn tiền"
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={
					<div className="row">
						<div className="col-12 d-flex justify-content-end">
							<div style={{ paddingRight: 5 }}>
								<Button type="primary" size="large">
									Xác nhận
								</Button>
							</div>
							<div>
								<Button onClick={() => setIsModalVisible(false)} type="default" size="large">
									Cancel
								</Button>
							</div>
						</div>
					</div>
				}
			>
				<div className="wrap-form">
					<Form layout="vertical">
						{/*  */}
						<div className="row">
							<div className="col-6">
								<Form.Item label="Học viên">
									<Input className="style-input" placeholder="" />
								</Form.Item>
							</div>
							<div className="col-6">
								<Form.Item label="Đã đóng">
									<Input className="style-input" placeholder="" />
								</Form.Item>
							</div>
						</div>
						<div className="row">
							<div className="col-6">
								<Form.Item label="Hoàn trả">
									<Input className="style-input" placeholder="" />
								</Form.Item>
							</div>
							<div className="col-6">
								<Form.Item label="Trung tâm hoàn trả">
									<Select defaultValue="lucy" className="w-100 style-input">
										<Option value="jack">Jack</Option>
									</Select>
								</Form.Item>
							</div>
						</div>

						{/*  */}
						<div className="row">
							<div className="col-12">
								<Form.Item label="Ghi chú">
									<TextArea />
								</Form.Item>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};

export default RegRefund;
