import {Form, Input, InputNumber, Modal, Select, Spin, Tooltip} from 'antd';
import React, {useEffect, useState} from 'react';
import {RotateCcw} from 'react-feather';
import {useForm} from 'react-hook-form';
import {useWrap} from '~/context/wrap';

const StaffSalaryForm = (props) => {
	const {Option} = Select;

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const [isTeacher, setIsTeacher] = useState(false);

	const {showNoti} = useWrap();

	const {
		register,
		handleSubmit,
		setValue,
		formState: {isSubmitting, errors, isSubmitted},
	} = useForm();
	// const { showNoti } = useWrap();

	const setValueStaff = (value, data) => {
		setValue('UserInformationID', value);
		if (data.role === 2) {
			setValue('Style', 1);
			setIsTeacher(true);
		} else {
			setIsTeacher(false);
		}
	};

	const onSubmit = handleSubmit((data: any) => {
		if (typeof data.Salary == 'string') {
			data.Salary = Number(data.Salary.replace(/\$\s?|(,*)/g, ''));
		}
		let res = props._onSubmit(data);
		res.then(function (rs: any) {
			rs && rs.status == 200 && setIsModalVisible(false), form.resetFields();
		});
	});

	useEffect(() => {
		if (isModalVisible) {
			if (props.rowData) {
				if (props.rowData.RoleID === 2) {
					setIsTeacher(true);
				}
				Object.keys(props.rowData).forEach(function (key) {
					setValue(key, props.rowData[key]);
				});
			}
		}
	}, [isModalVisible]);

	useEffect(() => {
		if (props.dataIDStaff && props.dataStaff.length === 1) {
			form.setFieldsValue({
				Staff: props.dataIDStaff,
			});
			setValue('UserInformationID', props.dataIDStaff);
		}
	}, [props.dataIDStaff]);
	return (
		<>
			{props.showIcon && (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					<Tooltip title="Cập nhật">
						<RotateCcw />
					</Tooltip>
				</button>
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
					<>
						{props.showAdd
							? 'Thêm Lương Nhân Viên'
							: 'Cập Nhật Lương Nhân Viên'}
					</>
				}
				visible={
					props.isOpenModalFromOutSide
						? props.isOpenModalFromOutSide
						: isModalVisible
				}
				onCancel={() =>
					props.openModalFromOutSide
						? props.openModalFromOutSide()
						: setIsModalVisible(false)
				}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								{props.showAdd || props.showInTeacherView ? (
									<Form.Item
										label="Nhân viên"
										name="Staff"
										rules={[
											{required: true, message: 'Bạn không được để trống'},
										]}
									>
										<Select
											className="style-input"
											placeholder="Chọn nhân viên"
											allowClear={true}
											onChange={(value, role) => setValueStaff(value, role)}
										>
											{props.dataStaff &&
												props.dataStaff.map((row) => (
													<Option
														key={row.UserInformationID}
														value={row.UserInformationID}
														role={row.RoleID}
													>
														{row.FullNameUnicode}
													</Option>
												))}
										</Select>
									</Form.Item>
								) : (
									<Form.Item label="Ghi chú" name="Note">
										<Input
											placeholder="Note"
											className="style-input"
											allowClear={true}
										/>
									</Form.Item>
								)}
							</div>
						</div>
						{/*  */}
						<div className="row">
							<div className="col-12">
								{isTeacher || props.showInTeacherView ? (
									<Form.Item
										label="Loại"
										name="Salary Type"
										rules={[
											{required: true, message: 'Bạn không được để trống'},
										]}
										initialValue={props.rowData?.StyleName}
									>
										<Select
											className="style-input"
											placeholder="Salary Type"
											allowClear={true}
											onChange={(value) => setValue('Style', value)}
										>
											<Option value="1">Tính lương theo tháng</Option>
											<Option value="2">Tính lương theo giờ</Option>
										</Select>
									</Form.Item>
								) : (
									<Form.Item
										label="Loại"
										name="Salary Type default"
										rules={[
											{required: true, message: 'Bạn không được để trống'},
										]}
										initialValue="Tính lương theo tháng"
									>
										<Select
											className="style-input"
											placeholder="Salary Type"
											allowClear={true}
											disabled
										>
											<Option value="1">Tính lương theo tháng</Option>
										</Select>
									</Form.Item>
								)}
							</div>
						</div>
						{/*  */}
						{/*  */}
						<div className="row">
							<div className="col-12">
								<Form.Item
									label="Mức Lương"
									name="Salary Const"
									rules={[{required: true, message: 'Bạn không được để trống'}]}
									initialValue={props.rowData?.Salary}
								>
									<InputNumber
										className="ant-input style-input w-100"
										formatter={(value) =>
											`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
										}
										parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
										onChange={(value) => setValue('Salary', value)}
									/>
								</Form.Item>
							</div>
						</div>
						{/*  */}
						<div className="row ">
							<div className="col-12">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={
										props.isLoading.type == 'ADD_DATA' && props.isLoading.status
									}
								>
									Lưu
									{props.isLoading.type == 'ADD_DATA' &&
										props.isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};

export default StaffSalaryForm;
