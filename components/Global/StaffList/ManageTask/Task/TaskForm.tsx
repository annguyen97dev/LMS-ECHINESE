import {yupResolver} from '@hookform/resolvers/yup';
import {Checkbox, Form, Modal, Spin, Tooltip} from 'antd';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {FilePlus, RotateCcw, UserMinus, UserPlus} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import DeleteTableRow from '~/components/Elements/DeleteTableRow/DeleteTableRow';
import CheckboxField from '~/components/FormControl/CheckboxField';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import {optionCommonPropTypes} from '~/utils/proptypes';

TaskForm.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	userInformation: PropTypes.object,
	optionRoleList: optionCommonPropTypes,
	optionStaffList: optionCommonPropTypes,
	taskList: PropTypes.arrayOf(
		PropTypes.shape({
			ID: PropTypes.number,
			WorkContent: PropTypes.string,
			TaskGroupID: PropTypes.number,
			TaskGroupName: PropTypes.string,
			StaffID: PropTypes.number,
			StaffName: PropTypes.string,
			DoneTask: PropTypes.bool,
		})
	),
	handleFetchTask: PropTypes.func,
	handleSubmit: PropTypes.func,
	handleUpdateTask: PropTypes.func,
	handleDeleteTask: PropTypes.func,
	handleFetchStaffListByRole: PropTypes.func,
	handleActionOfStaff: PropTypes.func,
	checkAuthorization: PropTypes.func,
	handleFetchGroupTask: PropTypes.func,
};
TaskForm.defaultProps = {
	isLoading: {type: '', status: false},
	userInformation: {},
	optionRoleList: [],
	optionStaffList: [],
	taskList: [],
	handleFetchTask: null,
	handleSubmit: null,
	handleUpdateTask: null,
	handleDeleteTask: null,
	handleFetchStaffListByRole: null,
	handleActionOfStaff: null,
	checkAuthorization: null,
	handleFetchGroupTask: null,
};
function TaskForm(props) {
	const {
		isLoading,
		userInformation,
		//
		optionRoleList,
		optionStaffList,
		taskList,
		//
		handleFetchTask,
		handleSubmit,
		handleUpdateTask,
		handleDeleteTask,
		handleFetchStaffListByRole,
		handleActionOfStaff,
		checkAuthorization,
		handleFetchGroupTask,
	} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);
	const [isUpdateWorkContent, setIsUpdateWorkContent] = useState<{
		idx: number;
		item: ITask;
		status: boolean;
	}>({
		idx: -1,
		item: null,
		status: false,
	});
	const [showMoreField, setShowMoreField] = useState(false);

	const schema = yup.object().shape({
		WorkContent: yup.string().required('Bạn không được để trống'),
		isAddStaff: yup.bool(),
		RoleID: yup
			.number()
			.notRequired()
			.when('isAddStaff', (isAddStaff, schema) => {
				if (isAddStaff) {
					return yup.number().nullable().required(`Bạn không được để trống`);
				}
				return yup.number().nullable().notRequired();
			}),
		StaffID: yup
			.number()
			.notRequired()
			.when('isAddStaff', (isAddStaff, schema) => {
				if (isAddStaff) {
					return yup.number().nullable().required(`Bạn không được để trống`);
				}
				return yup.number().nullable().notRequired();
			}),
	});

	const defaultValuesInit = {
		WorkContent: '',
		isAddStaff: false,
		RoleID: null,
		StaffID: null,
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	const checkHandleFetchGroupTask = () => {
		if (!handleFetchGroupTask) return;
		handleFetchGroupTask();
	};

	const checkHandleFetchTask = () => {
		if (!handleFetchTask) return;
		handleFetchTask();
	};

	const checkHandleFetchStaffListByRole = (id: number) => {
		if (!handleFetchStaffListByRole) return;
		form.setValue('StaffID', null);
		handleFetchStaffListByRole(id);
	};

	const checkHandleDeleteTask = (idx: number) => {
		if (!handleDeleteTask) return;
		return handleDeleteTask(idx);
	};

	const checkHandleActionOfStaff = (
		obj: {ID: number; StaffID?: number; DoneTask?: boolean},
		idx: number
	) => {
		if (!handleActionOfStaff) return;
		return handleActionOfStaff(obj, idx);
	};

	const checkHandleUpdateTask = (
		obj: {
			ID: number;
			WorkContent: string;
			isAddStaff: boolean;
			RoleID: number;
			StaffID: number;
			OldStaffID: number;
		},
		idx: number
	) => {
		if (!handleSubmit) return;
		handleSubmit(obj, idx).then((res) => {
			if (res) {
				form.reset({...defaultValuesInit});
				setShowMoreField(false);
				setIsUpdateWorkContent({
					idx: -1,
					item: null,
					status: false,
				});
			}
		});
	};

	const checkHandleSubmit = (data: {
		WorkContent: string;
		isAddStaff: boolean;
		RoleID: number;
		StaffID: number;
	}) => {
		if (!handleSubmit) return;
		handleSubmit(data).then((res) => {
			if (res) {
				form.reset({...defaultValuesInit});
				setShowMoreField(false);
			}
		});
	};

	const taskSubmitSwitch = (data: {
		WorkContent: string;
		isAddStaff: boolean;
		RoleID: number;
		StaffID: number;
	}) => {
		if (isUpdateWorkContent.status) {
			checkHandleUpdateTask(
				{
					...data,
					ID: isUpdateWorkContent.item.ID,
					OldStaffID: isUpdateWorkContent.item.StaffID,
				},
				isUpdateWorkContent.idx
			);
		} else {
			checkHandleSubmit(data);
		}
	};

	useEffect(() => {
		form.clearErrors();
		isModalVisible && checkHandleFetchTask();
	}, [isModalVisible]);

	useEffect(() => {
		const {status, item} = isUpdateWorkContent;
		if (status && item) {
			form.setValue('WorkContent', item.WorkContent);
			if (item.StaffID) {
				setShowMoreField(true);
				checkHandleFetchStaffListByRole(item.RoleID);
				form.setValue('isAddStaff', true);
				form.setValue('RoleID', item.RoleID);
				form.setValue('StaffID', item.StaffID);
			} else {
				setShowMoreField(false);
				form.setValue('isAddStaff', false);
				form.setValue('RoleID', null);
				form.setValue('StaffID', null);
			}
		} else {
			setShowMoreField(false);
			form.reset({...defaultValuesInit});
			form.clearErrors();
		}
	}, [isUpdateWorkContent]);

	const checkStatusTask = (status: number | boolean) => {
		if (status === true) {
			return 'item-done';
		}
		if (status > 0) {
			return 'item-working';
		}
		return 'item-empty';
	};

	const isAuthorization = (StaffID?: number) => {
		if (!checkAuthorization) return;
		return checkAuthorization(StaffID);
	};

	return (
		<>
			<button className="btn btn-icon add" onClick={openModal}>
				<Tooltip title="Bảng công việc">
					<FilePlus />
				</Tooltip>
			</button>
			<Modal
				title={`Công việc`}
				visible={isModalVisible}
				onCancel={() => {
					checkHandleFetchGroupTask();
					closeModal();
				}}
				footer={null}
			>
				<div>
					<Form
						key="0"
						layout="vertical"
						onFinish={form.handleSubmit(taskSubmitSwitch)}
					>
						<div className="row">
							<div className="col-12">
								<InputTextField
									style={{marginBottom: '12px'}}
									form={form}
									name="WorkContent"
									label="Tiêu đề công việc"
									placeholder="Nhập tiêu đề công việc"
								/>
							</div>
						</div>
						{showMoreField && (
							<>
								<div className="row">
									<div className="col-6">
										<SelectField
											style={{marginBottom: '12px'}}
											form={form}
											name="RoleID"
											optionList={optionRoleList}
											label="Chức vụ"
											placeholder="Chọn chức vụ"
											onChangeSelect={checkHandleFetchStaffListByRole}
										/>
									</div>
									<div className="col-6">
										<SelectField
											style={{marginBottom: '12px'}}
											form={form}
											name="StaffID"
											optionList={optionStaffList}
											label="Nhân viên"
											placeholder="Chọn nhân viên"
											isLoading={
												isLoading.type === 'FETCH_STAFF' && isLoading.status
											}
										/>
									</div>
								</div>
							</>
						)}
						{isAuthorization() === 'Accept' && (
							<div className="row">
								<div className="col-12">
									<CheckboxField
										form={form}
										name="isAddStaff"
										text="Thêm nhân viên"
										handleChangeCheckbox={setShowMoreField}
									/>
								</div>
							</div>
						)}
						<div className="row">
							<div
								className={`col-12 list-subtask ${
									isLoading.type === 'FETCH_TASK' && isLoading.status
										? 'list-subtask-wrap'
										: ''
								}`}
							>
								<Form.Item label="Danh sách công việc">
									<div className="ant-checkbox-group">
										{taskList.map((item: ITask, idx) => (
											<div
												className={`item d-flex justify-content-between  align-items-center ${checkStatusTask(
													item.DoneTask || item.StaffID
												)}`}
												key={idx}
											>
												<div className="info">
													<Checkbox
														className="d-flex m-0"
														key={item.ID}
														value={item.ID}
														checked={item.DoneTask}
														disabled={
															item.StaffID
																? isAuthorization(item.StaffID) === 'Accept'
																	? false
																	: true
																: true
														}
														onChange={(e) =>
															checkHandleActionOfStaff(
																{
																	ID: item.ID,
																	DoneTask: !item.DoneTask,
																},
																idx
															)
														}
													>
														{item.WorkContent}
													</Checkbox>
													<span className="info-item">
														{item.DoneTask && item.StaffID
															? 'Hoàn thành'
															: 'Phụ trách'}
														: {item.StaffName || 'Trống'}
													</span>
												</div>
												{isAuthorization(item.StaffID) === 'Accept' ? (
													<div className="action d-flex align-items-center">
														<span className="action-item">
															{!item.DoneTask ? (
																<Tooltip
																	title={`${
																		item.StaffID ? 'Hủy' : 'Nhận'
																	} công việc`}
																>
																	<button
																		type="button"
																		className="btn btn-icon choice"
																		onClick={() =>
																			checkHandleActionOfStaff(
																				{
																					ID: item.ID,
																					StaffID: item.StaffID
																						? 0
																						: userInformation.UserInformationID,
																				},
																				idx
																			)
																		}
																	>
																		{item.StaffID ? (
																			<UserMinus />
																		) : (
																			<UserPlus />
																		)}
																	</button>
																</Tooltip>
															) : (
																''
															)}
															{item.DoneTask ? (
																<DeleteTableRow
																	handleDelete={checkHandleDeleteTask(idx)}
																/>
															) : isAuthorization() === 'Accept' ? (
																<Tooltip title="Cập nhật công việc">
																	<button
																		type="button"
																		className="btn btn-icon choice"
																		onClick={() => {
																			setIsUpdateWorkContent({
																				idx: idx,
																				status:
																					isUpdateWorkContent.idx === idx
																						? !isUpdateWorkContent.status
																						: true,
																				item: item,
																			});
																		}}
																	>
																		<RotateCcw />
																	</button>
																</Tooltip>
															) : (
																''
															)}
														</span>
													</div>
												) : !item.StaffID ? (
													// if empty task
													<div className="action d-flex align-items-center">
														<span className="action-item">
															<Tooltip title="Nhận công việc">
																<button
																	type="button"
																	className="btn btn-icon choice"
																	onClick={() =>
																		checkHandleActionOfStaff(
																			{
																				ID: item.ID,
																				StaffID:
																					userInformation.UserInformationID,
																			},
																			idx
																		)
																	}
																>
																	<UserPlus />
																</button>
															</Tooltip>
														</span>
													</div>
												) : (
													''
												)}
											</div>
										))}
									</div>
								</Form.Item>
								<Spin className="list-subtask-loading" />
							</div>
						</div>
						<div className="row ">
							<div className="col-12">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={
										(isLoading.type === 'ADD_DATA' && isLoading.status) ||
										(isLoading.type === 'FETCH_TASK' && isLoading.status)
									}
								>
									{isUpdateWorkContent.status ? 'Update' : 'Add'}
									{((isLoading.type === 'ADD_DATA' && isLoading.status) ||
										(isLoading.type === 'FETCH_TASK' && isLoading.status)) && (
										<Spin className="loading-base" />
									)}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
}

export default TaskForm;
