import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Modal, Spin, Tooltip} from 'antd';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {Edit} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import TextAreaField from '~/components/FormControl/TextAreaField';
import UploadAvatarField from '~/components/FormControl/UploadAvatarField';

InvoiceVoucherForm.propTypes = {
	isUpdate: PropTypes.bool,
	updateObj: PropTypes.shape({}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	handleSubmit: PropTypes.func,
	title: PropTypes.string,
};
InvoiceVoucherForm.defaultProps = {
	isUpdate: false,
	updateObj: {},
	isLoading: {type: '', status: false},
	handleSubmit: null,
	title: '',
};

function InvoiceVoucherForm(props) {
	const {title, isUpdate, isLoading, updateObj, handleSubmit} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		Reason: yup.string().required('Bạn không được để trống'),
		Qrcode: yup.string().nullable(),
	});
	const defaultValuesInit = {
		Reason: '',
		Qrcode: '',
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});
	useEffect(() => {
		if (isUpdate && updateObj) {
			form.reset({
				Reason: updateObj.Reason,
				Qrcode: updateObj.Qrcode,
			});
		}
	}, [updateObj]);

	const checkHandleSubmit = (data) => {
		if (!handleSubmit) return;
		handleSubmit(data).then((res) => {
			if (res) {
				closeModal();
				if (!isUpdate) {
					form.reset({...defaultValuesInit});
				}
			}
		});
	};

	return (
		<>
			<Tooltip title={title}>
				<button className="btn btn-icon" onClick={openModal}>
					<Edit />
				</button>
			</Tooltip>

			<Modal
				title={title}
				visible={isModalVisible}
				onCancel={closeModal}
				footer={null}
			>
				<div className="wrap-form">
					<Form
						layout="vertical"
						onFinish={form.handleSubmit(checkHandleSubmit)}
					>
						<div className="row">
							<div className="col-12">
								<TextAreaField
									form={form}
									name="Reason"
									label="Lý do"
									rows={5}
									placeholder="Nhập lý do"
								/>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<UploadAvatarField form={form} name="Qrcode" label="QR Code" />
							</div>
						</div>
						<div className="row ">
							<div className="col-12">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={isLoading.type === 'ADD_DATA' && isLoading.status}
								>
									Lưu
									{isLoading.type === 'ADD_DATA' && isLoading.status && (
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

export default InvoiceVoucherForm;
