import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Button, Divider, Tooltip, Select, Skeleton} from 'antd';
import {RotateCcw} from 'react-feather';
import { staffSalaryApi } from '~/apiBase';
import { useWrap } from "~/context/wrap";
import { useForm } from "react-hook-form";
import Cleave from 'cleave.js/react';
const StaffSalaryForm = (props) => {
	const {Option} = Select;

	const [isModalVisible, setIsModalVisible] = useState(false);

	const [isLoading, setIsLoading] = useState({
		type: "",
		status: false,
	  });
	const { showNoti } = useWrap();
	

	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, isSubmitted },
	} = useForm();
	  // const { showNoti } = useWrap();
	
	const onSubmit = handleSubmit((data: any) => {
		let res = props._onSubmit(data);

		res.then(function (rs: any) {
			console.log("Res in form: ", rs);
			rs
			? res.status == 200 && setIsModalVisible(false)
			: showNoti("danger", "Server lỗi")
		});
	});

	useEffect(() => {
		if (props.rowData) {
			Object.keys(props.rowData).forEach(function (key) {
				setValue(key, props.rowData[key]);
			});
			// console.log(props.rowData?.Salaryconst);
		}
	}, [props.rowData]);

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
					<Form layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								{props.showAdd ? (
									<Form.Item label="Staff">
										<Select 
											className="style-input" 
											defaultValue="Chọn nhân viên"
											onChange={(value) => setValue("UserInformationID", value)}>
											{props.dataStaff && props.dataStaff .map(row => (
												<Option key={row.UserInformationID} value={row.UserInformationID}>{row.FullNameUnicode}</Option>
											))
											}
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
									<Select 
										className="style-input" 
										defaultValue={props.rowData?.StyleName || "Type Salary"}
										onChange={(value) => setValue("Style", value)}>
										<Option value="1">Tính lương theo tháng</Option>
										<Option value="2">Tính lương theo giờ</Option>
										<Option value="disabled" disabled>
											Disabled
										</Option>
									</Select>
								</Form.Item>
							</div>
						</div>
						{/*  */}
						{/*  */}
						<div className="row">
							<div className="col-12">
								<Form.Item label="Salary Const">
									<Cleave
										className='ant-input'
										placeholder={props.rowData?.Salary}
										options={{numeral: true, numeralThousandsGroupStyle: 'thousand'}}
										onChange={(e) => setValue("Salary", parseFloat(e.target.value.replace(/,/g, '')))}
									/>
								</Form.Item>
							</div>
						</div>
						{/*  */}
						<div className="row ">
							<div className="col-12">
								{props.showAdd == true ? (
									<Button className="w-100" type="primary" size="large" onClick={onSubmit}>
										Create
									</Button>
								) : (
									<Button className="w-100" type="primary" size="large" onClick={onSubmit}>
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
