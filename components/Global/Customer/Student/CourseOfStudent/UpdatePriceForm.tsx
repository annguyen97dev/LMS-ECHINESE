import React, { useState, useEffect } from 'react';
import { DollarSign } from 'react-feather';
import { Tooltip, Modal, Spin, Input, Checkbox, DatePicker, Radio, Form, InputNumber } from 'antd';
import { numberWithCommas, parsePriceStrToNumber } from '~/utils/functions';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { courseOfStudentApi } from '~/apiBase/customer/parents/courses-of-student';
import { useWrap } from '~/context/wrap';

const UpdatePriceForm = (props) => {
	const { data } = props;
	const [visible, setVisible] = useState(false);
	const [form] = Form.useForm();
	const { showNoti } = useWrap();
	const { setValue } = useForm();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [inputField, setInputField] = useState({
		Price: '',
		Paid: '',
		Mess: ''
	});
	const { TextArea } = Input;

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

	const _onSubmit = async (value) => {
		console.log(value);
		console.log(inputField);
		setIsLoading({ type: 'UPDATE', status: true });
		try {
			let res = await courseOfStudentApi.updatePrice({
				ID: data.CourseOfStudentPriceID,
				Price: parsePriceStrToNumber(inputField.Price),
				Paid: parsePriceStrToNumber(inputField.Paid),
				Note: value.Note,
				PaymentMethodsID: value.PaymentMethodsID,
				PayDate: value.PayDate._i
			});
			if (res.status == 200) {
				showNoti('success', 'Thêm thành công!');
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'UPDATE', status: false });
		}
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
				<Form layout="vertical" onFinish={_onSubmit} form={form} scrollToFirstError={true}>
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
							<Form.Item
								label="Số tiền thanh toán thêm"
								name="Price"
								rules={[{ required: true, message: 'Vui lòng điền số tiền thanh toán thêm!' }]}
							>
								<InputNumber
									name="Price"
									className="style-input"
									placeholder="Nhập số tiên yêu cầu"
									formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
									onChange={(value) => setValue('Paid', value)}
								/>
							</Form.Item>
						</div>
						<div className="col-12 col-md-6">
							<Form.Item
								label="Số tiền học viên thanh toán"
								name="Paid"
								rules={[{ required: true, message: 'Vui lòng điền số tiền học viên thanh toán!' }]}
							>
								<InputNumber
									className="style-input"
									placeholder="Nhập số tiền học viên trả trước"
									name="Paid"
									formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
									onChange={(value) => setValue('Paid', value)}
								/>
							</Form.Item>
						</div>
						<div className="col-12 col-md-6">
							<Form.Item
								name="PaymentMethodsID"
								label="Phương thức hoàn tiền"
								rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán!' }]}
							>
								<Radio.Group name="PaymentMethodsID" onChange={() => {}}>
									{paymentMethodOptionList.map((item, index) => (
										<Radio value={item.value} key={index}>
											{item.label}
										</Radio>
									))}
								</Radio.Group>
							</Form.Item>
						</div>
						<div className="col-12 col-md-6">
							<Form.Item
								name="PayDate"
								label="Ngày hẹn thanh toán"
								rules={[{ required: true, message: 'Vui lòng chọn ngày thanh toán!' }]}
							>
								<DatePicker
									name="PayDate"
									className="style-input w-100"
									placeholder="Ngày hẹn thanh toán"
									format="YYYY/MM/DD"
								/>
							</Form.Item>
						</div>
						<div className="col-12">
							<Form.Item name="Note" label="Lý do">
								<TextArea placeholder="Nhập lý do" rows={4} className="style-input" />
							</Form.Item>
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

export default UpdatePriceForm;
