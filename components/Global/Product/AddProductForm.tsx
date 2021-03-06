import React, { useState, useEffect } from 'react';
import { Tooltip, Modal, Form, Input, Spin } from 'antd';
import { RotateCcw } from 'react-feather';
import { useWrap } from '~/context/wrap';
import { productApi } from '~/apiBase/product/product';
import { useForm } from 'react-hook-form';
import UploadFileField from '~/components/FormControl/UploadFileField';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import InputMoneyField from '~/components/FormControl/InputMoneyField';
import InputNumberField from '~/components/FormControl/InputNumberField';
import InputTextField from '~/components/FormControl/InputTextField';
import TextAreaField from '~/components/FormControl/TextAreaField';
import SelectField from '~/components/FormControl/SelectField';

AddProductForm.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	productIDList: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.number.isRequired,
			title: PropTypes.string.isRequired
		})
	).isRequired,
	isModalVisible: PropTypes.bool,
	Mode: PropTypes.string,
	onFetchData: PropTypes.func,
	_onSubmit: PropTypes.func,
	handleUploadFile: PropTypes.func,
	data: PropTypes.shape({
		ID: PropTypes.number,
		ProductTypeID: PropTypes.number,
		Name: PropTypes.string,
		Description: PropTypes.string,
		ListedPrice: PropTypes.number,
		Price: PropTypes.number,
		Quantity: PropTypes.number,
		Enable: PropTypes.bool,
		CreatedOn: PropTypes.string,
		CreatedBy: PropTypes.string,
		ModifiedOn: PropTypes.string,
		ModifiedBy: PropTypes.string,
		ImageOfProducts: PropTypes.shape({
			Link: PropTypes.string,
			isAvatar: PropTypes.bool
		})
	})
};

AddProductForm.defaultProps = {
	isLoading: { type: '', status: false },
	Mode: '',
	onFetchData: null,
	_onSubmit: null,
	data: null
};

function AddProductForm(props) {
	const { Mode, onFetchData, data, _onSubmit, isLoading, handleUploadFile, productIDList } = props;
	const [isVisible, setIsVisible] = useState(false);
	const { showNoti } = useWrap();

	const schema = yup.object().shape({
		Name: yup.string().required('B???n kh??ng ???????c ????? tr???ng'),
		ProductTypeID: yup.number().required('B???n kh??ng ???????c ????? tr???ng'),
		ListedPrice: yup.string().required('B???n kh??ng ???????c ????? tr???ng'),
		Price: yup.string().required('B???n kh??ng ???????c ????? tr???ng'),
		Description: yup.string(),
		Quantity: yup.number().required('B???n kh??ng ???????c ????? tr???ng'),
		ImageOfProducts: Mode === 'edit-type' ? yup.array() : yup.array().min(1, 'B???n ph???i ch???n ??t nh???t 1 file').nullable()
	});

	const defaultValuesInit = {
		ID: null,
		Name: null,
		ProductTypeID: null,
		ListedPrice: null,
		Price: null,
		Description: null,
		Quantity: null,
		ImageOfProducts: []
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	const checkHandleUploadFile = (arrFile) => {
		if (!handleUploadFile) return;
		return handleUploadFile(arrFile);
	};

	const checkHandleSubmit = (info) => {
		if (!_onSubmit) return;
		_onSubmit(info, Mode, data?.ID).then((res) => {
			if (res) {
				setIsVisible(false);
				onFetchData && onFetchData();
				form.reset({ ...defaultValuesInit });
			}
		});
	};

	useEffect(() => {
		if (isVisible) {
			if (data) {
				console.log(data);
				form.setValue('ID', data.ID);
				form.setValue('Name', data.Name);
				form.setValue('ProductTypeID', data.ProductTypeID);
				form.setValue('ListedPrice', data.ListedPrice);
				form.setValue('Price', data.Price);
				form.setValue('Description', data.Description);
				form.setValue('Quantity', data.Quantity);
			}
		}
	}, [isVisible]);

	return (
		<>
			{Mode == 'add-type' && (
				<button
					className="btn btn-warning add-new"
					onClick={() => {
						setIsVisible(true);
					}}
				>
					Th??m m???i
				</button>
			)}
			{Mode == 'edit-type' && (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsVisible(true);
					}}
				>
					<Tooltip title="C???p nh???t">
						<RotateCcw />
					</Tooltip>
				</button>
			)}

			<Modal
				title={Mode == 'edit-type' ? 'Thay ?????i th??ng tin' : 'Th??m s???n ph???m'}
				visible={isVisible}
				onCancel={() => {
					setIsVisible(false);
				}}
				footer={false}
			>
				<div className="container-fluit">
					<Form layout="vertical" onFinish={form.handleSubmit(checkHandleSubmit)}>
						<div className="row">
							<div className="col-12">
								<SelectField
									form={form}
									label="Lo???i s???n ph???m"
									name="ProductTypeID"
									placeholder="Ch???n lo???i s???n ph???m"
									className="style-input"
									isRequired={true}
									optionList={productIDList}
								/>
							</div>

							<div className="col-12">
								<InputTextField
									form={form}
									label="T??n s???n ph???m"
									name="Name"
									placeholder="Th??m t??n s???n ph???m"
									className="style-input"
									isRequired={true}
								/>
							</div>

							<div className="col-12">
								<InputMoneyField
									form={form}
									label="Gi?? ni??m y???t"
									name="ListedPrice"
									placeholder="Th??m gi?? ni??m y???t"
									className="style-input"
									isRequired={true}
								/>
							</div>

							<div className="col-12">
								<InputMoneyField
									form={form}
									label="Gi?? th???c b??n"
									name="Price"
									placeholder="Th??m gi?? th???c b??n"
									className="style-input"
									isRequired={true}
								/>
							</div>

							<div className="col-12">
								<InputNumberField
									form={form}
									label="S??? l?????ng"
									name="Quantity"
									placeholder="Th??m s??? l?????ng"
									className="style-input"
									isRequired={true}
								/>
							</div>

							<div className="col-12">
								<TextAreaField
									form={form}
									label="M?? t???"
									name="Description"
									placeholder="Th??m m?? t???"
									className="style-input mb-3"
									allowClear={true}
								/>
							</div>

							{Mode == 'add-type' && (
								<div className="col-12">
									<UploadFileField
										accept="image/png,image/jpg,image/jpeg,image/bmp"
										form={form}
										label="???nh s??n ph???m"
										name="ImageOfProducts"
										handleUploadFile={checkHandleUploadFile}
									/>
								</div>
							)}

							<div className="col-12 mt-5">
								<button type="submit" className="btn btn-primary w-100">
									L??u
									{isLoading.type == 'SUBMIT' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
}

export default AddProductForm;
