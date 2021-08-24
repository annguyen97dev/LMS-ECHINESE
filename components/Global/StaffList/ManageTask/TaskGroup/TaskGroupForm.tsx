import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Modal, Spin, Tooltip} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {RotateCcw} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import DateField from '~/components/FormControl/DateField';
import InputTextField from '~/components/FormControl/InputTextField';

const TaskGroupForm = (props) => {
	const {
		handleCreateTaskGroup,
		isUpdate,
		handleUpdateTaskGroup,
		updateObj,
		isLoading,
		indexUpdateObj,
	} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);
	const schema = yup.object().shape({
		TaskGroupName: yup.string().required('Bạn không được để trống'),
		Note: yup.string().required('Bạn không được để trống'),
		Deadline: yup.string().required('Bạn không được để trống'),
	});
	const defaultValuesInit = {
		TaskGroupName: '',
		Note: '',
		Deadline: moment().format('YYYY/MM/DD'),
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});
	useEffect(() => {
		if (isUpdate && updateObj) {
			form.reset({
				...updateObj,
			});
		}
	}, [updateObj]);
	const taskGroupSwitchFunc = (data) => {
		switch (isUpdate) {
			case true:
				if (!handleUpdateTaskGroup) return;
				handleUpdateTaskGroup(data, indexUpdateObj).then((res) => {
					if (res && res.status === 200) {
						closeModal();
					}
				});
				break;
			case false:
				if (!handleCreateTaskGroup) return;
				handleCreateTaskGroup(data).then((res) => {
					if (res && res.status === 200) {
						closeModal();
						form.reset({...defaultValuesInit});
					}
				});
				break;
			default:
				break;
		}
	};

	return (
		<>
			{isUpdate ? (
				<button className="btn btn-icon edit" onClick={openModal}>
					<Tooltip title="Cập nhật">
						<RotateCcw />
					</Tooltip>
				</button>
			) : (
				<button className="btn btn-warning add-new" onClick={openModal}>
					Thêm mới
				</button>
			)}
			<Modal
				title={isUpdate ? 'Cập nhật nhóm công việc' : 'Tạo nhóm công việc'}
				visible={isModalVisible}
				onCancel={closeModal}
				footer={null}
			>
				<div className="container-fluid">
					<Form
						key="2"
						layout="vertical"
						onFinish={form.handleSubmit(taskGroupSwitchFunc)}
					>
						<div className="row">
							<div className="col-12">
								<InputTextField
									form={form}
									name="TaskGroupName"
									label="Tên nhóm công việc"
									placeholder="Nhập tên nhóm công việc"
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<InputTextField
									form={form}
									name="Note"
									label="Ghi chú"
									placeholder="Nhập ghi chú"
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<DateField form={form} name="Deadline" label="Thời hạn" />
							</div>
						</div>
						<div className="row ">
							<div className="col-12 mt-3">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									{isUpdate ? 'Update' : 'Create'}
									{isLoading.type == 'ADD_DATA' && isLoading.status && (
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
};
TaskGroupForm.propTypes = {
	handleCreateTaskGroup: PropTypes.func,
	isUpdate: PropTypes.bool,
	handleUpdateTaskGroup: PropTypes.func,
	updateObj: PropTypes.shape({}),
	indexUpdateObj: PropTypes.number,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
};
TaskGroupForm.defaultProps = {
	handleCreateTaskGroup: null,
	isUpdate: false,
	handleUpdateTaskGroup: null,
	updateObj: {},
	indexUpdateObj: -1,
	isLoading: {type: '', status: false},
};
export default TaskGroupForm;
