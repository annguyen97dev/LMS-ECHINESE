import { Form, Input, InputNumber, Modal, Select, Spin, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useWrap } from '~/context/wrap';
import { userInformationApi } from '~/apiBase';

const StaffSalaryForm = (props) => {
	const { Option } = Select;

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const [isTeacher, setIsTeacher] = useState(false);
	const [roles, setRoles] = useState([]);
	const [dataStaff, setDataStaff] = useState([]);
	const [paramsDataStaff, setParamsDataStaff] = useState(null);
	const { pageSize, showNoti } = useWrap();
	const [paramsSearchStaff, setParamsSearchStaff] = useState({ pageIndex: 1, pageSize: pageSize, FullNameUnicode: '' });

	const [isLoading, setIsLoading] = useState({
		status: '',
		loading: false
	});

	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm();

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
		if (props.dataStaff && props.dataStaff.length > 0) {
			let res = props._onSubmit(data);
			res.then(function (rs: any) {
				rs && rs.status == 200 && setIsModalVisible(false), form.resetFields(), setParamsDataStaff(null);
			});
		} else {
			let res = props._onSubmitStaff(data);
			res.then(function (rs: any) {
				rs && rs.status == 200 && setIsModalVisible(false), form.resetFields(), setParamsDataStaff(null);
			});
		}
	});

	// GET DATA USERINFORMATION
	const getDataStaff = () => {
		setIsLoading({
			status: 'GET_ALL',
			loading: true
		});
		(async () => {
			try {
				let res = await userInformationApi.getAllRole(paramsDataStaff);
				res.status == 200 && setDataStaff(res.data.data);
				if (res.status == 204) {
					setDataStaff([]);
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					status: 'GET_ALL',
					loading: false
				});
			}
		})();
	};

	const getSearchDataStaff = (name) => {
		setIsLoading({
			status: 'GET_ALL',
			loading: true
		});
		(async () => {
			try {
				let res = await userInformationApi.getName({ pageIndex: 1, pageSize: pageSize, FullNameUnicode: name });
				res.status == 200 && setDataStaff(res.data.data);
				if (res.status == 204) {
					setDataStaff([]);
				}
				if (res.status == 204) {
					setDataStaff([]);
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					status: 'GET_ALL',
					loading: false
				});
			}
		})();
	};

	const getRoles = async (roleType) => {
		setIsLoading({
			status: 'GET_ALL',
			loading: true
		});
		try {
			let res = await userInformationApi.getRole(roleType);
			if (res.status == 200) {
				setRoles(res.data.data);
			}
			if (res.status == 204) {
				setRoles([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({
				status: 'GET_ALL',
				loading: false
			});
		}
	};

	useEffect(() => {
		getDataStaff();
	}, [paramsDataStaff]);

	useEffect(() => {
		if (isModalVisible) {
			form.setFieldsValue({ Style: 1 });
			setValue('Style', 1);
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
		getRoles(1);
	}, []);

	// Select search
	function onSearch(val) {
		if (val.length == 0) {
			getDataStaff();
		} else {
			getSearchDataStaff(val);
		}
	}

	useEffect(() => {
		if (props.dataIDStaff && props.dataStaff.length === 1) {
			form.setFieldsValue({
				Staff: props.dataStaff[0].FullNameUnicode
			});
			setValue('UserInformationID', props.dataIDStaff);
			form.setFieldsValue({ Style: 1 });
			setValue('Style', 1);
		}
	}, [props.dataIDStaff]);
	return (
		<>
			{props.showIcon && (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true);
						props.setUpdateSalary({ type: 'update', SalaryID: props.rowData.SalaryID });
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
						props.setUpdateSalary({ type: 'add', SalaryID: null });
					}}
				>
					Thêm mới
				</button>
			)}
			{/*  */}
			<Modal
				title={<>{props.showAdd ? 'Thêm Lương Nhân Viên' : 'Cập Nhật Lương Nhân Viên'}</>}
				visible={props.isOpenModalFromOutSide ? props.isOpenModalFromOutSide : isModalVisible}
				onCancel={() => (props.openModalFromOutSide ? props.openModalFromOutSide() : setIsModalVisible(false))}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								{props.showAdd || props.showInTeacherView ? (
									<>
										{props.isOpenModalFromOutSide ? (
											<></>
										) : (
											<Form.Item
												label="Chọn chức vụ"
												name="Role"
												// rules={[{ required: true, message: 'Bạn không được để trống' }]}
											>
												<Select
													className="style-input"
													placeholder="Chọn chức vụ"
													allowClear={true}
													onChange={(value, role) => {
														setParamsDataStaff(value);
													}}
												>
													{roles &&
														roles.map((role, index) => (
															<Option key={index} value={role.ID} role={role.ID}>
																{role.name}
															</Option>
														))}
												</Select>
											</Form.Item>
										)}
										<Form.Item
											label="Nhân viên"
											name="Staff"
											rules={[{ required: true, message: 'Bạn không được để trống' }]}
											initialValue={
												props.dataStaff && props.dataStaff.length > 0 && props.dataStaff[0].FullNameUnicode
											}
										>
											<Select
												showSearch
												className="style-input"
												placeholder="Chọn nhân viên"
												optionFilterProp="children"
												onChange={(value, role) => setValueStaff(value, role)}
												onSearch={onSearch}
												filterOption={(input, option) =>
													!isLoading.loading && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
												}
											>
												{props.dataStaff && props.dataStaff.length > 0 ? (
													props.dataStaff && (
														<Option value={props.dataStaff[0].UserInformationID}>
															{props.dataStaff[0].FullNameUnicode}
														</Option>
													)
												) : isLoading.loading ? (
													<Option value="" className="spin-center">
														<Spin />
													</Option>
												) : (
													dataStaff &&
													dataStaff.map((row) => (
														<Option key={row.UserInformationID} value={row.UserInformationID} role={row.RoleID}>
															{row.FullNameUnicode}
														</Option>
													))
												)}
											</Select>
										</Form.Item>
									</>
								) : (
									<Form.Item label="Ghi chú" name="Note">
										<Input placeholder="Note" className="style-input" allowClear={true} />
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
										name="Style"
										rules={[{ required: true, message: 'Bạn không được để trống' }]}
										initialValue={props.rowData?.StyleName}
									>
										<Select
											className="style-input"
											placeholder="Style"
											allowClear={true}
											onChange={(value) => setValue('Style', value)}
											disabled
										>
											<Option value={1}>Tính lương theo tháng</Option>
										</Select>
									</Form.Item>
								) : (
									<Form.Item
										label="Loại"
										name="Style"
										rules={[{ required: true, message: 'Bạn không được để trống' }]}
										initialValue="Tính lương theo tháng"
									>
										<Select className="style-input" placeholder="Salary Type" allowClear={true} disabled>
											<Option value={1}>Tính lương theo tháng</Option>
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
									rules={[{ required: true, message: 'Bạn không được để trống' }]}
									initialValue={props.rowData?.Salary}
								>
									<InputNumber
										className="ant-input style-input w-100"
										formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
									disabled={props.isLoading.type == 'ADD_DATA' && props.isLoading.status}
								>
									Lưu
									{props.isLoading.type == 'ADD_DATA' && props.isLoading.status && <Spin className="loading-base" />}
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
