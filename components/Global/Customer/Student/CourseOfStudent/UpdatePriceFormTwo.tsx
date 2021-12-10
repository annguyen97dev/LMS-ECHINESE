import React, { useState, useEffect } from 'react';
import { DollarSign } from 'react-feather';
import { Tooltip, Modal, Spin, Input, Checkbox, DatePicker, Radio, Form } from 'antd';
import { numberWithCommas, parsePriceStrToNumber } from '~/utils/functions';
import moment from 'moment';
import { courseOfStudentApi } from '~/apiBase/customer/parents/courses-of-student';
import { useWrap } from '~/context/wrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';
import RadioField from '~/components/FormControl/RadioField';
import TextAreaField from '~/components/FormControl/TextAreaField';
import { yupResolver } from '@hookform/resolvers/yup';
import DateField from '~/components/FormControl/DateField';

const UpdatePriceFormTwo = (props) => {
	const { data } = props;
	const [visible, setVisible] = useState(false);
	const { showNoti } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});

	const [courseIDList, setCourseIDList] = useState<number[]>([]);
	const [customErrorCheckbox, setCustomErrorCheckbox] = useState({
		message: '',
		hasError: false
	});

	const schema = yup.object().shape({
		ID: yup.number(),
		Price: yup.string().required('Bạn không được để trống'),
		Paid: yup.string().required('Bạn không được để trống'),
		PaymentMethodsID: yup.number().oneOf([1, 2], 'Bạn không được để trống'),
		Note: yup.string()
	});

	const defaultValuesInit = {
		ID: null,
		Price: '',
		Paid: '',
		PaymentMethodsID: 1,
		Note: ''
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	const paymentMethodOptionList = [
		{
			label: 'Tiền mặt',
			value: 1
		},
		{
			label: 'Chuyển khoản',
			value: 2
		}
	];

	useEffect(() => {
		const { errors } = form.formState;
		const hasError = errors['Price'];
		const listCourseID = form.watch('Price');
		if (hasError) {
			setCustomErrorCheckbox({
				//@ts-ignore
				hasError,
				message: errors['Price']?.message
			});
		}
		if (listCourseID?.length) {
			setCustomErrorCheckbox({
				hasError: false,
				message: ''
			});
		}
	}, [form.watch('Price'), form.formState.errors]);

	const checkOnSubmit = (data) => {
		console.log(data);
		async () => {
			setIsLoading({ type: 'ADD_DATA', status: true });
			try {
				let res = await courseOfStudentApi.updatePrice(data);
				if (res.status == 200) {
					showNoti('success', 'Thêm thành công!');
				}
			} catch (error) {
			} finally {
				setIsLoading({ type: 'ADD_DATA', status: false });
			}
		};
	};

	return (
		<>
			<Tooltip title="Yêu cầu thanh toán thêm">
				<button
					type="button"
					className="btn btn-icon"
					onClick={() => {
						setVisible(true);
					}}
				>
					<DollarSign />
				</button>
			</Tooltip>
			<Modal
				title="Thông tin yêu cầu thanh toán thêm"
				visible={visible}
				onCancel={() => {
					setVisible(false);
				}}
				footer={null}
				width={600}
			>
				<Form layout="vertical" onFinish={form.handleSubmit(checkOnSubmit)}>
					<div className="row">
						<div className="col-12">
							<div className="refund-branch-item mb-4">
								<div className="info">
									<p className="name font-weight-black">{data.CourseName}</p>
									<ul className="list">
										<li className="price">
											Giá: <span> {numberWithCommas(data.Price)} VNĐ</span>
										</li>
										<li className="date-start">
											Ngày bắt đầu:
											<span> {moment(data.StartDay).format('DD/MM/YYYY')}</span>
										</li>
										<li className="date-end">
											Ngày kết thúc:
											<span> {moment(data.EndDay).format('DD/MM/YYYY')}</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div className="col-12 col-md-6">
							<InputTextField
								isRequired={true}
								form={form}
								name="Price"
								className="style-input"
								label="Số tiền thanh toán thêm"
								placeholder="Nhập số tiên yêu cầu"
								handleFormatCurrency={numberWithCommas}
							/>
						</div>
						<div className="col-12 col-md-6">
							<InputTextField
								isRequired={true}
								form={form}
								name="Paid"
								label="Số tiền học viên thanh toán"
								placeholder="Nhập số tiền học viên trả trước"
								className="style-input"
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
							<DateField
								form={form}
								isRequired={true}
								placeholder="Ngày hẹn thanh toán"
								className="style-input w-100"
								name="PayDate"
								label="Ngày hẹn thanh toán"
							/>
						</div>
						<div className="col-12">
							<TextAreaField
								className="style-input"
								form={form}
								name="Note"
								label="Ghi chú"
								placeholder="Nhập ghi chú"
								rows={4}
							/>
						</div>
						<div className="col-12">
							<button
								type="submit"
								className="btn btn-primary w-100"
								disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
							>
								Xác nhận
								{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
							</button>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default UpdatePriceFormTwo;
