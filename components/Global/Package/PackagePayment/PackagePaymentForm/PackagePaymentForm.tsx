import {yupResolver} from '@hookform/resolvers/yup';
import {Form, Modal, Spin, Tooltip} from 'antd';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {CreditCard} from 'react-feather';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import EditorField from '~/components/FormControl/EditorField';
import SelectField from '~/components/FormControl/SelectField';
import {optionCommonPropTypes} from '~/utils/proptypes';

PackagePaymentForm.propTypes = {
	isUpdate: PropTypes.bool,
	updateObj: PropTypes.shape({
		Approval: PropTypes.number.isRequired,
	}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired,
	}),
	handleUpdatePackagePayment: PropTypes.func,
	approvalOptionList: optionCommonPropTypes,
};
PackagePaymentForm.defaultProps = {
	isUpdate: false,
	updateObj: {Approval: null},
	isLoading: {type: '', status: false},
	handleUpdatePackagePayment: null,
	approvalOptionList: [],
};

function PackagePaymentForm(props) {
	const {
		isUpdate,
		isLoading,
		updateObj,
		handleUpdatePackagePayment,
		approvalOptionList,
	} = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		Approval: yup.number().nullable().required('Bạn không được để trống'),
	});
	const defaultValuesInit = {};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (updateObj.ID) {
			form.reset({
				...updateObj,
			});
		}
	}, [updateObj]);

	const checkHandlePackagePayment = (data: IPackageStudent) => {
		if (!handleUpdatePackagePayment) return;
		handleUpdatePackagePayment(data).then((res) => {
			if (res?.status === 200) {
				closeModal();
			}
		});
	};
	return (
		<>
			<button className="btn btn-icon edit" onClick={openModal}>
				<Tooltip title="Thanh toán">
					<CreditCard />
				</Tooltip>
			</button>
			<Modal
				title="Cập nhật trạng thái thanh toán"
				visible={isModalVisible}
				footer={null}
				onCancel={closeModal}
			>
				<div className="wrap-form">
					<Form
						layout="vertical"
						onFinish={form.handleSubmit(checkHandlePackagePayment)}
					>
						<div className="row">
							<div className="col-md-12 col-12">
								<SelectField
									form={form}
									name="Approval"
									label="Trạng thái"
									placeholder="Chọn trạng thái"
									optionList={approvalOptionList}
								/>
							</div>
							<div className="col-md-12 col-12">
								<EditorField
									form={form}
									name="Note"
									label="Ghi chú"
									height={200}
									disabled={true}
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
									Cập nhật
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

export default PackagePaymentForm;
