import React, { useState, useEffect } from 'react';
import { DollarSign } from 'react-feather';
import { Tooltip, Modal, Spin, Input, Popconfirm, DatePicker, Radio, Form, Button } from 'antd';
import { numberWithCommas, parsePriceStrToNumber } from '~/utils/functions';
import moment from 'moment';
import { courseOfStudentApi } from '~/apiBase/customer/parents/courses-of-student';
import { useWrap } from '~/context/wrap';

const UpdatePriceForm = (props) => {
	const { data } = props;
	const [visible, setVisible] = useState(false);
	const [form] = Form.useForm();
	const { showNoti } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [inputField, setInputField] = useState({
		Price: null,
		Paid: null,
		Mess: ''
	});
	const { TextArea } = Input;
	const [showConfirm, setShowConfirm] = useState(false);

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

	const showModal = () => {
		setShowConfirm(true);
	};

	const handleOk = () => {
		setShowConfirm(false);

		const temp = {
			ID: data.CourseOfStudentPriceID,
			Price: inputField.Price,
			Paid: inputField.Paid,
			PaymentMethodsID: form.getFieldValue('PaymentMethodsID'),
			PayDate: form.getFieldValue('PayDate')._d,
			Note: form.getFieldValue('Note')
		};

		console.log(temp);
		_onSubmit(temp);
	};

	const _onSubmit = async (value) => {
		console.log(value);
		setIsLoading({ type: 'UPDATE', status: true });
		try {
			let res = await courseOfStudentApi.updatePrice({
				ID: data.CourseOfStudentPriceID,
				Price: inputField.Price,
				Paid: inputField.Paid,
				Note: value.Note,
				PaymentMethodsID: value.PaymentMethodsID,
				PayDate: moment(value.PayDate).format('DD/MM/yyyy')
			});
			if (res.status == 200 || res.status == 204) {
				setVisible(false);
				showNoti('success', 'Thêm thành công!');
			}
		} catch (error) {
			showNoti('danger', error.message);
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

						<div className="col-12 col-md-6">
							<Form.Item label="Số tiền thanh toán thêm" name="Price">
								<Input
									name="Price"
									className="style-input"
									placeholder="Nhập số tiên yêu cầu"
									onChange={(event) => {
										setInputField({ ...inputField, Price: parsePriceStrToNumber(event.target.value) });
									}}
									value={numberWithCommas(inputField.Price)}
									defaultValue={numberWithCommas(inputField.Price)}
								/>
								<p className="font-weight-primary">{inputField.Mess}</p>
							</Form.Item>
						</div>
						<div className="col-12 col-md-6">
							<Form.Item
								label="Số tiền học viên thanh toán"
								name="Paid"
								// rules={[{ required: true, message: 'Vui lòng điền số tiền học viên thanh toán!' }]}
							>
								<Input
									className="style-input"
									placeholder="Nhập số tiền học viên trả trước"
									name="Paid"
									onChange={(event) => {
										setInputField({ ...inputField, Paid: parsePriceStrToNumber(event.target.value) });
										// form.setFieldsValue({ Paid: numberWithCommas(inputField.Paid) });
									}}
									value={numberWithCommas(inputField.Paid)}
									defaultValue={numberWithCommas(inputField.Paid)}
								/>
								<p className="font-weight-primary">{inputField.Mess}</p>
							</Form.Item>
						</div>

						<div className="col-12 col-md-6">
							<Form.Item name="PaymentMethodsID" label="Phương thức hoàn tiền">
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
							<Form.Item name="PayDate" label="Ngày hẹn thanh toán">
								<DatePicker
									name="PayDate"
									className="style-input w-100"
									placeholder="Ngày hẹn thanh toán"
									format="YYYY/MM/DD"
								/>
							</Form.Item>
						</div>
						<div className="col-12">
							<Form.Item name="Note" label="Ghi chú thanh toán">
								<TextArea placeholder="Nhập lý do" rows={4} className="style-input" />
							</Form.Item>
						</div>

						<div className="col-12">
							<Button
								// type="submit"
								onClick={() => setShowConfirm(true)}
								className="btn btn-primary w-100"
								disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								style={{ height: 38 }}
							>
								Xác nhận
								{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
							</Button>
						</div>

						<Modal title="Xác nhận" visible={showConfirm} onOk={handleOk} onCancel={() => setShowConfirm(false)}>
							<p>Bạn chắc chắn muốn xác nhận yêu cầu?</p>
						</Modal>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default UpdatePriceForm;
