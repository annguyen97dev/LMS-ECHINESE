import React, { useState } from 'react';
import { Modal, Form, Input, Button, Divider, Tooltip, Select } from 'antd';
import { RotateCcw } from 'react-feather';
const TeacherSalaryForm = (props) => {
	const { Option } = Select;

	const [isModalVisible, setIsModalVisible] = useState(false);
	return (
		<>
			{props.showIcon && (
				<Tooltip title="Cập nhật">
					<button
						className="btn btn-icon edit"
						onClick={() => {
							setIsModalVisible(true);
						}}
					>
						<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16 }}></i>
					</button>
				</Tooltip>
			)}
			{props.showAdd && (
				<button
					className="btn btn-warning add-new"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					Thêm mới
				</button>
			)}

			{/*  */}
			<Modal
				title={<>{props.showAdd ? 'Create Teacher Salary' : 'Update Teacher Salary'}</>}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form layout="vertical">
						{/*  */}
						<div className="row">
							<div className="col-12">
								<Form.Item label="Full Name">
									<Input className="style-input" />
								</Form.Item>
							</div>
						</div>
						{/*  */}
						<div className="row">
							<div className="col-12">
								<Form.Item label="Salary">
									<Input className="style-input" />
								</Form.Item>
							</div>
						</div>
						{/*  */}
						<div className="row ">
							<div className="col-12">
								{props.showAdd == true ? (
									<Button className="w-100" type="primary" size="large">
										Create
									</Button>
								) : (
									<Button className="w-100" type="primary" size="large">
										Update
									</Button>
								)}
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};

export default TeacherSalaryForm;
