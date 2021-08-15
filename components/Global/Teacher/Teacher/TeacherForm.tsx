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
import SelectField from '~/components/FormControl/SelectField';
import {optionCommonPropTypes} from '~/utils/proptypes';

const TeacherForm = (props) => {
	const {
		handleCreateTeacher,
		isUpdate,
		handleUpdateTeacher,
		updateObj,
		isLoading,
		indexUpdateObj,
		//
		isClearForm,
		//
		optionAreaList,
		optionBranchList,
		handleFetchBranch,
		loadingFetchBranch,
	} = props;

	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => {
		setIsModalVisible(true);
		if (isUpdate && updateObj) {
			handleFetchBranch(updateObj.AreaID);
		}
	};
	const closeModal = () => setIsModalVisible(false);
	const schema = yup.object().shape({
		AreaID: yup.number().nullable().required('Bạn không được để trống'),
		Branch: yup
			.array()
			.min(1, 'Bạn phải chọn ít nhất 1 trung tâm')
			.required('Bạn không được để trống'),
		FullNameUnicode: yup.string().required('Bạn không được để trống'),
		Jobdate: yup.string().required('Bạn không được để trống'),
		Email: yup
			.string()
			.email('Email không đúng định dạng')
			.required('Bạn không được để trống'),
		Mobile: yup
			.string()
			.required('Bạn không được để trống')
			.matches(
				/^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/,
				'Sdt không đúng định dạng'
			),
		Address: yup.string(),
	});
	const defaultValuesInit = {
		AreaID: null,
		Branch: undefined,
		FullNameUnicode: '',
		Jobdate: moment().format('YYYY/MM/DD'),
		Email: '',
		Mobile: '',
		Address: '',
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (isUpdate && updateObj) {
			form.reset({
				...updateObj,
				Branch: updateObj.Branch.map((obj) => obj.ID),
			});
		}
	}, [updateObj]);

	useEffect(() => {
		isClearForm && form.reset({...defaultValuesInit});
	}, [isClearForm]);

	const checkHandleFetchBranch = (value) => {
		if (!handleFetchBranch) return;
		form.setValue('Branch', undefined);
		handleFetchBranch(value);
	};

	const dayOffSwitchFunc = (data) => {
		switch (isUpdate) {
			case true:
				if (!handleUpdateTeacher) return;
				handleUpdateTeacher(data, indexUpdateObj).then((res) => {
					if (res && res.status === 200) {
						closeModal();
					}
				});
				break;
			case false:
				if (!handleCreateTeacher) return;
				handleCreateTeacher(data).then((res) => {
					if (res && res.status === 200) {
						closeModal();
						// form.reset({...defaultValuesInit});
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
				title={isUpdate ? 'Update Teacher' : 'Create Teacher'}
				visible={isModalVisible}
				onCancel={closeModal}
				footer={null}
			>
				<div className="container-fluid">
					<Form
						layout="vertical"
						onFinish={form.handleSubmit(dayOffSwitchFunc)}
					>
						<div className="row">
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="AreaID"
									label="Tỉnh/thành phố"
									optionList={optionAreaList}
									onChangeSelect={checkHandleFetchBranch}
								/>
								<InputTextField
									form={form}
									name="FullNameUnicode"
									label="Họ và tên"
								/>
								<InputTextField form={form} name="Email" label="Email" />
							</div>
							<div className="col-md-6 col-12">
								<SelectField
									form={form}
									name="Branch"
									label="Trung tâm"
									mode="multiple"
									optionList={optionBranchList}
									isLoading={loadingFetchBranch}
								/>
								<InputTextField
									form={form}
									name="Mobile"
									label="Số điện thoại"
								/>
								<DateField form={form} name="Jobdate" label="Ngày nhận việc" />
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<InputTextField form={form} name="Address" label="Địa chỉ" />
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

TeacherForm.propTypes = {
	handleCreateTeacher: PropTypes.func,
	isUpdate: PropTypes.bool,
	handleUpdateTeacher: PropTypes.func,
	updateObj: PropTypes.shape({}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	//
	isClearForm: PropTypes.bool,
	indexUpdateObj: PropTypes.number,
	//
	optionAreaList: optionCommonPropTypes,
	optionBranchList: optionCommonPropTypes,
	handleFetchBranch: PropTypes.func,
	loadingFetchBranch: PropTypes.bool,
};
TeacherForm.defaultProps = {
	handleCreateTeacher: null,
	isUpdate: false,
	handleUpdateTeacher: null,
	updateObj: {},
	isLoading: {type: '', status: false},
	isClearForm: false,
	indexUpdateObj: -1,
	optionAreaList: [],
	optionBranchList: [],
	handleFetchBranch: null,
	loadingFetchBranch: false,
};
export default TeacherForm;
