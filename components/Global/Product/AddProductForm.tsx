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
		Name: yup.string().required('Bạn không được để trống'),
		ProductTypeID: yup.number().required('Bạn không được để trống'),
		ListedPrice: yup.string().required('Bạn không được để trống'),
		Price: yup.string().required('Bạn không được để trống'),
		Description: yup.string(),
		Quantity: yup.number().required('Bạn không được để trống'),
		ImageOfProducts: Mode === 'edit-type' ? yup.array() : yup.array().min(1, 'Bạn phải chọn ít nhất 1 file').nullable()
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
					Thêm mới
				</button>
			)}
			{Mode == 'edit-type' && (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsVisible(true);
					}}
				>
					<Tooltip title="Cập nhật">
						<RotateCcw />
					</Tooltip>
				</button>
			)}

			<Modal
				title={Mode == 'edit-type' ? 'Thay đổi thông tin' : 'Thêm sản phẩm'}
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
									label="Loại sản phẩm"
									name="ProductTypeID"
									placeholder="Chọn loại sản phẩm"
									className="style-input"
									isRequired={true}
									optionList={productIDList}
								/>
							</div>

							<div className="col-12">
								<InputTextField
									form={form}
									label="Tên sản phẩm"
									name="Name"
									placeholder="Thêm tên sản phẩm"
									className="style-input"
									isRequired={true}
								/>
							</div>

							<div className="col-12">
								<InputMoneyField
									form={form}
									label="Giá niêm yết"
									name="ListedPrice"
									placeholder="Thêm giá niêm yết"
									className="style-input"
									isRequired={true}
								/>
							</div>

							<div className="col-12">
								<InputMoneyField
									form={form}
									label="Giá thực bán"
									name="Price"
									placeholder="Thêm giá thực bán"
									className="style-input"
									isRequired={true}
								/>
							</div>

							<div className="col-12">
								<InputNumberField
									form={form}
									label="Số lượng"
									name="Quantity"
									placeholder="Thêm số lượng"
									className="style-input"
									isRequired={true}
								/>
							</div>

							<div className="col-12">
								<TextAreaField
									form={form}
									label="Mô tả"
									name="Description"
									placeholder="Thêm mô tả"
									className="style-input mb-3"
									allowClear={true}
								/>
							</div>

							{Mode == 'add-type' && (
								<div className="col-12">
									<UploadFileField
										accept="image/png,image/jpg,image/jpeg,image/bmp"
										form={form}
										label="Ảnh sàn phẩm"
										name="ImageOfProducts"
										handleUploadFile={checkHandleUploadFile}
									/>
								</div>
							)}

							<div className="col-12 mt-5">
								<button type="submit" className="btn btn-primary w-100">
									Lưu
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
