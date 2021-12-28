import React, { useState, useEffect } from 'react';
import { Modal, Form, Tooltip, Select, Input, Upload, message, Spin, InputNumber } from 'antd';
import { RotateCw, X } from 'react-feather';
import { useWrap } from '~/context/wrap';
import { shoppingCartApi } from '~/apiBase/shopping-cart/shopping-cart';

const AddCurrencyForm = (props) => {
	const { type, onFetchData, dataCurrency } = props;
	const [visible, setVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [form] = Form.useForm();
	const { showNoti } = useWrap();

	const _onFinish = async (data) => {
		setIsLoading({ type: 'ADD', status: true });
		try {
			if (type === 'add') {
				let res = await shoppingCartApi.updateCurrency({ ...data, ID: 0, PassCode: 'm0n4medi4', Enable: true });
				if (res.status === 200) {
					showNoti('success', res.data.message);
					onFetchData();
					form.resetFields();
					setVisible(false);
				}
			} else if (type === 'edit') {
				let res = await shoppingCartApi.updateCurrency({ ...data, ID: dataCurrency.ID, Enable: true });
				if (res.status === 200) {
					showNoti('success', res.data.message);
					onFetchData();
					setVisible(false);
				}
			} else {
				let res = await shoppingCartApi.updateCurrency({ ID: dataCurrency.ID, Enable: false });
				if (res.status === 200) {
					showNoti('success', res.data.message);
					onFetchData();
					setVisible(false);
				}
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({ type: 'ADD', status: false });
		}
	};

	return (
		<>
			{props.type == 'add' && (
				<button
					className="btn btn-warning"
					onClick={() => {
						setVisible(true);
					}}
					type="button"
				>
					Thêm loại tiền tệ
				</button>
			)}

			{props.type == 'edit' && (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setVisible(true);
					}}
					type="button"
				>
					<Tooltip title="Sửa ">
						<RotateCw />
					</Tooltip>
				</button>
			)}
			<Modal
				visible={visible}
				footer={null}
				title={
					(props.type == 'add' && 'Thêm loại tiền tệ') ||
					(props.type == 'edit' && 'Sửa loại tiền tệ') ||
					(props.type == 'delete' && '')
				}
				onCancel={() => {
					setVisible(false);
				}}
			>
				<Form form={form} onFinish={_onFinish} layout="vertical">
					<div className="row">
						{type && type === 'delete' ? (
							<div className="col-12 mb-3">
								<h5>Bạn xác nhận ẩn loại tiền tệ này?</h5>
							</div>
						) : (
							<>
								<div className="col-12">
									<Form.Item
										name="CurrencyType"
										label="Loại tiền tệ"
										rules={[{ required: true, message: 'Bạn không được để trống' }]}
										initialValue={dataCurrency && dataCurrency.CurrencyType}
									>
										<Input placeholder="Nhập loại tiền tệ" className="style-input" allowClear={true} />
									</Form.Item>
								</div>
								<div className="col-12">
									<Form.Item
										name="ExchangeRate"
										label="Mệnh giá"
										rules={[{ required: true, message: 'Bạn không được để trống' }]}
										initialValue={dataCurrency && dataCurrency.ExchangeRate}
									>
										<InputNumber
											placeholder="Nhập mệnh giá"
											className="ant-input style-input w-100"
											formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
											parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
											onChange={(value) => form.setFieldsValue({ ExchangeRate: value })}
										/>
									</Form.Item>
								</div>
							</>
						)}
						<div className="col-12">
							{
								<button
									className="btn btn-primary w-100"
									type="submit"
									disabled={isLoading.type == 'ADD' && isLoading.status}
								>
									{isLoading.type == 'ADD' && isLoading.status ? <Spin /> : 'Lưu'}
								</button>
							}
						</div>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default AddCurrencyForm;
