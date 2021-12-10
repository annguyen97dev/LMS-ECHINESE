import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Input, Modal, Spin, Tooltip } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { CreditCard } from 'react-feather';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import DateField from '~/components/FormControl/DateField';
import InputTextField from '~/components/FormControl/InputTextField';
import RadioField from '~/components/FormControl/RadioField';
import SelectField from '~/components/FormControl/SelectField';
import { numberWithCommas } from '~/utils/functions';
import { optionCommonPropTypes, radioCommonPropTypes } from '~/utils/proptypes';
import TextAreaField from '~/components/FormControl/TextAreaField';

CourseOfStudentPriceForm.propTypes = {
	isPayTuition: PropTypes.bool,
	isUpdate: PropTypes.bool,
	updateObj: PropTypes.shape({}),
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	paymentMethodOptionList: radioCommonPropTypes,
	optionBranchList: optionCommonPropTypes,
	handleSubmit: PropTypes.func,
	handleFetch: PropTypes.func
};
CourseOfStudentPriceForm.defaultProps = {
	isPayTuition: false,
	isUpdate: false,
	updateObj: {},
	isLoading: { type: '', status: false },
	paymentMethodOptionList: [],
	optionBranchList: [],
	handleSubmit: null,
	handleFetch: null
};

function CourseOfStudentPriceForm(props) {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { isPayTuition, isUpdate, isLoading, updateObj, paymentMethodOptionList, handleSubmit, optionBranchList } = props;
	const { TextArea } = Input;

	const schema = yup.object().shape({
		FullNameUnicode: yup.string().required('Bạn không được để trống'),
		MoneyInDebt: yup.string().required('Bạn không được để trống'),
		Paid: yup
			.string()
			.required('Bạn không được để trống')
			.test('less-than-total', 'Tiền thanh toán không hợp lệ', (value, context) => {
				return parseInt(value.replace(/\D/g, '')) <= parseInt(context.parent.MoneyInDebt.replace(/\D/g, ''));
			}),
		PaymentMethodsID: yup.number().required('Bạn không được để trống'),
		PayBranchID: yup.number().nullable().required('Bạn không được để trống'),
		PayDate: yup
			.date()
			.nullable()
			.min(moment().format('YYYY/MM/DD'), 'Ngày thanh toán tiếp theo không hợp lệ')
			.required('Bạn không được để trống')
	});

	const defaultValuesInit = {
		FullNameUnicode: '',
		MoneyInDebt: '',
		Paid: '',
		PaymentMethodsID: 1,
		PayBranchID: null,
		PayDate: moment().format('YYYY/MM/DD')
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	useEffect(() => {
		if (isUpdate && updateObj) {
			form.reset({
				...updateObj,
				MoneyInDebt: !updateObj.MoneyInDebt ? '' : numberWithCommas(updateObj.MoneyInDebt),
				Paid: ''
			});
		}
	}, [updateObj]);

	const checkHandleSubmit = (data) => {
		if (!handleSubmit) return;
		handleSubmit(data).then((res) => {
			if (res) {
				setIsModalVisible(false);
				if (!isUpdate) {
					form.reset({ ...defaultValuesInit });
				}
			}
		});
	};
	return (
		<>
			{isPayTuition ? (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					<Tooltip title="Thanh toán học phí">
						<CreditCard />
					</Tooltip>
				</button>
			) : (
				<button
					className="btn btn-warning add-new"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					Thêm mới
				</button>
			)}

			<Modal
				title={isPayTuition ? 'Thanh toán học phí' : 'Học viên nợ học phí'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div>
					<Form layout="vertical" onFinish={form.handleSubmit(checkHandleSubmit)}>
						<div className="row">
							<div className="col-12 col-md-6">
								<InputTextField
									form={form}
									name="FullNameUnicode"
									label="Tên học viên"
									placeholder="Nhập tên học viên"
									disabled={true}
								/>
							</div>
							<div className="col-12 col-md-6">
								<InputTextField
									form={form}
									name="MoneyInDebt"
									label="Số tiền còn lại"
									placeholder="Nhập số tiền còn lại"
									disabled={true}
								/>
							</div>
							<div className="col-12 col-md-6">
								<InputTextField
									form={form}
									name="Paid"
									label="Thanh toán"
									placeholder="Nhập số tiền thanh toán"
									handleFormatCurrency={numberWithCommas}
								/>
							</div>
							<div className="col-12 col-md-6">
								<RadioField
									form={form}
									name="PaymentMethodsID"
									label="Phương thức thanh toán"
									radioList={paymentMethodOptionList}
								/>
							</div>
							<div className="col-12 col-md-6">
								<SelectField
									form={form}
									name="PayBranchID"
									label="Trung tâm thanh toán"
									optionList={optionBranchList}
									placeholder="Chọn trung tâm thanh toán"
								/>
							</div>
							<div className="col-12 col-md-6">
								<DateField form={form} name="PayDate" label="Ngày thu tiếp theo" placeholder="Chọn ngày thu tiếp theo" />
							</div>
							<div className="col-12">
								<TextAreaField form={form} name="Note" label="Ghi chú" placeholder="Thêm ghi chú" rows={4} />
							</div>
							<div className="col-12 mt-3">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={isLoading.type === 'ADD_DATA' && isLoading.status}
								>
									Lưu
									{isLoading.type === 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
}

export default CourseOfStudentPriceForm;
