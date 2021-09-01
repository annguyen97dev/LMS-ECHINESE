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

const DistrictForm = (props) => {
	const {
		handleCreateDistrict,
		optionAreaList,
		isUpdate,
		handleUpdateDistrict,
		updateObj,
		isLoading,
		indexUpdateObj,
	} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		AreaID: yup.number().nullable().required('Bạn không được để trống'),
		DistrictName: yup.string().required('Bạn không được để trống'),
	});

	const defaultValuesInit = {
		AreaID: null,
		DistrictName: '',
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (isUpdate && updateObj) {
			form.reset(updateObj);
		}
	}, [updateObj]);

	const districtSwitchFunc = (data) => {
		switch (isUpdate) {
			case true:
				if (!handleUpdateDistrict) return;
				handleUpdateDistrict(data, indexUpdateObj).then((res) => {
					if (res && res.status === 200) {
						closeModal();
					}
				});
				break;
			case false:
				if (!handleCreateDistrict) return;
				handleCreateDistrict(data).then((res) => {
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
				title={isUpdate ? 'Update District' : 'Create District'}
				visible={isModalVisible}
				onCancel={closeModal}
				footer={null}
			>
				<div>
					<Form
						layout="vertical"
						onFinish={form.handleSubmit(districtSwitchFunc)}
					>
						<div className="row">
							<div className="col-12">
								<SelectField
									form={form}
									name="AreaID"
									label="Tên tỉnh/thành phố"
									placeholder="Chọn tên tỉnh/thành phố"
									optionList={optionAreaList}
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<InputTextField
									form={form}
									name="DistrictName"
									label="Tên quận"
									placeholder="Nhập tên quận"
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
DistrictForm.propTypes = {
	isUpdate: PropTypes.bool,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	optionAreaList: optionCommonPropTypes,
	updateObj: PropTypes.shape({}),
	indexUpdateObj: PropTypes.number,
	handleUpdateDistrict: PropTypes.func,
	handleCreateDistrict: PropTypes.func,
};
DistrictForm.defaultProps = {
	isUpdate: false,
	isLoading: {type: '', status: false},
	optionAreaList: [],
	updateObj: {},
	indexUpdateObj: -1,
	handleUpdateDistrict: null,
	handleCreateDistrict: null,
};
export default DistrictForm;
