import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Modal, Spin, Tooltip} from 'antd';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {RotateCcw} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import {optionCommonPropTypes} from '~/utils/proptypes';

const PointColumnForm = (props) => {
	const {
		handleCreatePointColumn,
		isUpdate,
		handleUpdatePointColumn,
		updateObj,
		isLoading,
		//
		optionType,
	} = props;
	const [isDisabled, setIsDisabled] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);
	const schema = yup.object().shape({
		Name: yup.string().required('Bạn không được để trống'),
		Type: yup.number().nullable().required('Bạn không được để trống'),
		Coefficient: yup
			.number()
			.typeError('Bạn nhập sai giá trị')
			.when('Type', (type, schema) => {
				return type !== 1
					? schema
					: schema
							.min(1, 'Hệ số tối thiểu: 1')
							.max(10, 'Hệ số tối đa: 10')
							.required('Bạn không được để trống');
			}),
	});
	const defaultValuesInit = {
		Name: '',
		Type: 1,
		Coefficient: 1,
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
			if (updateObj.Type !== 1) {
				setIsDisabled(true);
			}
		}
	}, [updateObj]);

	const checkHandleChangeType = (value) => {
		if (value !== 1) {
			setIsDisabled(true);
			form.clearErrors('Coefficient');
		} else {
			setIsDisabled(false);
		}
	};

	const pointColumnSwitchFunc = (data) => {
		switch (isUpdate) {
			case true:
				if (!handleUpdatePointColumn) return;
				handleUpdatePointColumn(data).then((res) => {
					if (res && res.status === 200) {
						closeModal();
					}
				});
				break;
			case false:
				if (!handleCreatePointColumn) return;
				handleCreatePointColumn(data).then((res) => {
					if (res && res.status === 200) {
						closeModal();
						setIsDisabled(false);
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
				title={isUpdate ? 'Update Point Column' : 'Create Point Column'}
				visible={isModalVisible}
				onCancel={closeModal}
				footer={null}
			>
				<div className="container-fluid">
					<Form
						layout="vertical"
						onFinish={form.handleSubmit(pointColumnSwitchFunc)}
					>
						<div className="row">
							<div className="col-12">
								<InputTextField form={form} name="Name" label="Tên kì thi" />
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<SelectField
									form={form}
									name="Type"
									label="Loại"
									optionList={optionType}
									onChangeSelect={checkHandleChangeType}
									disabled={isUpdate && true}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<InputTextField
									form={form}
									name="Coefficient"
									label="Hệ số"
									disabled={isDisabled}
								/>
							</div>
						</div>
						<div className="row mt-3">
							<div className="col-12">
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

PointColumnForm.propTypes = {
	handleCreatePointColumn: PropTypes.func,
	isUpdate: PropTypes.bool,
	handleUpdatePointColumn: PropTypes.func,
	updateObj: PropTypes.shape({}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	optionType: optionCommonPropTypes,
};
PointColumnForm.defaultProps = {
	handleCreatePointColumn: null,
	isUpdate: false,
	handleUpdatePointColumn: null,
	updateObj: {},
	isLoading: {type: '', status: false},
	optionType: [],
};
export default PointColumnForm;
