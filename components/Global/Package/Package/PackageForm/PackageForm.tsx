import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Modal, Spin, Tooltip} from 'antd';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {RotateCcw} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';
import RadioField from '~/components/FormControl/RadioField';
import TextAreaField from '~/components/FormControl/TextAreaField';
import UploadAvatarField from '~/components/FormControl/UploadAvatarField';
import {numberWithCommas} from '~/utils/functions';
import {optionCommonPropTypes} from '~/utils/proptypes';

PackageForm.propTypes = {
	isUpdate: PropTypes.bool,
	updateObj: PropTypes.shape({}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	handleCreatePackage: PropTypes.func,
	handleUpdatePackage: PropTypes.func,
	paymentMethodOptionList: optionCommonPropTypes,
};
PackageForm.defaultProps = {
	isUpdate: false,
	updateObj: {},
	isLoading: {type: '', status: false},
	handleCreatePackage: null,
	handleUpdatePackage: null,
	paymentMethodOptionList: [],
};

function PackageForm(props) {
	const {
		isUpdate,
		isLoading,
		updateObj,
		handleCreatePackage,
		handleUpdatePackage,
		paymentMethodOptionList,
	} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [showMoreField, setShowMoreField] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		Name: yup.string().required('Bạn không được để trống'),
		Level: yup
			.number()
			.typeError('Bạn không được để trống')
			.min(1, 'Level thấp nhất là 1')
			.max(6, 'Level cao nhất là 6')
			.required('Bạn không được để trống'),
		Type: yup.number().required('Bạn không được để trống'),
		Description: yup.string().nullable(),
		Avatar: yup.string(),
		Price: yup
			.string()
			.notRequired()
			.when('Type', (Type, schema) => {
				if (parseInt(Type) === 2) {
					return yup.string().required('Bạn không được để trống');
				}
				return yup.string().notRequired();
			}),
	});
	const defaultValuesInit = {
		Name: '',
		Level: 1,
		Type: 1,
		Avatar: '',
		Price: '',
		Description: '',
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (isUpdate && updateObj) {
			if (updateObj.Type === 2) setShowMoreField(true);
			form.reset({
				...updateObj,
				Price: !updateObj.Price ? '' : numberWithCommas(updateObj.Price),
			});
		}
	}, [updateObj]);

	const packageListSwitchFunc = (data: {
		Name: string;
		Level: number;
		Type: number;
		Avatar: string;
		Price: string;
		Description: string;
	}) => {
		switch (isUpdate) {
			case true:
				if (!handleUpdatePackage) return;
				handleUpdatePackage(data).then((res) => {
					if (res && res.status === 200) {
						closeModal();
					}
				});
				break;
			case false:
				if (!handleCreatePackage) return;
				handleCreatePackage(data).then((res) => {
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
					Tạo gói mới
				</button>
			)}
			<Modal
				style={{top: 50}}
				title={isUpdate ? 'Cập nhật gói' : 'Tạo gói mới'}
				visible={isModalVisible}
				footer={null}
				onCancel={closeModal}
			>
				<div className="wrap-form">
					<Form
						layout="vertical"
						onFinish={form.handleSubmit(packageListSwitchFunc)}
					>
						<div className="row">
							<div className="col-md-6 col-12">
								<InputTextField
									form={form}
									name="Name"
									label="Tên gói"
									placeholder="Nhập tên gói"
								/>
							</div>
							<div className="col-md-6 col-12">
								<InputTextField
									form={form}
									name="Level"
									label="Level"
									placeholder="Nhập level"
								/>
							</div>
							<div className="col-md-6 col-12">
								<UploadAvatarField
									form={form}
									name="Avatar"
									label="Thumbnail"
								/>
							</div>
							<div className="col-md-6 col-12">
								<RadioField
									form={form}
									name="Type"
									label="Chọn loại gói"
									radioList={paymentMethodOptionList}
									handleChange={(typeID: number) => {
										typeID === 2
											? setShowMoreField(true)
											: setShowMoreField(false);
									}}
								/>
								{showMoreField && (
									<div>
										<InputTextField
											form={form}
											name="Price"
											label="Giá"
											placeholder="Nhập giá"
											handleFormatCurrency={numberWithCommas}
										/>
									</div>
								)}
							</div>

							<div className="col-md-12 col-12">
								<TextAreaField
									form={form}
									name="Description"
									label="Mô tả"
									placeholder="Nhập mô tả"
									rows={5}
								/>
							</div>
							<div
								className="col-md-12 col-12 mt-3 "
								style={{textAlign: 'center'}}
							>
								<button
									type="submit"
									className="btn btn-primary"
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									{isUpdate ? 'Cập nhật' : 'Khởi tạo'}
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
}

export default PackageForm;
