import React, {useState} from 'react';
import {Modal, Form, Input, Button, Divider, Tooltip, Select} from 'antd';
import {RotateCcw} from 'react-feather';
const StaffSalaryForm = (props) => {
	const {Option} = Select;

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
						<RotateCcw />
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
				title={
					<>{props.showAdd ? 'Create Staff Salary' : 'Update Staff Salary'}</>
				}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form layout="vertical">
						<div className="row">
							<div className="col-12">
								{props.showAdd ? (
									<Form.Item label="Staff">
										<Select className="style-input" defaultValue="jack">
											<Option value="jack">Nhân viên 1</Option>
											<Option value="lucy">Nhân viên 2</Option>
											<Option value="lucy">Nhân viên 3</Option>
											<Option value="disabled" disabled>
												Disabled
											</Option>
										</Select>
									</Form.Item>
								) : (
									<Form.Item label="Note">
										<Input placeholder="Note" className="style-input" />
									</Form.Item>
								)}
							</div>
						</div>
						{/*  */}
						<div className="row">
							<div className="col-12">
								<Form.Item label="Salary">
									<Select className="style-input" defaultValue="jack">
										<Option value="jack">Tính lương theo tháng</Option>
										<Option value="lucy">Tính lương theo giờ</Option>
										<Option value="disabled" disabled>
											Disabled
										</Option>
									</Select>
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

export default StaffSalaryForm;
