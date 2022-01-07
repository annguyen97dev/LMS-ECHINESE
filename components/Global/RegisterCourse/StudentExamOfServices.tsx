import React, { useEffect, useState } from 'react';

import { Modal, Form, Input, Select, Card, Spin, InputNumber, Button } from 'antd';
import { branchApi, discountApi } from '~/apiBase';
import { examServiceApi } from '~/apiBase/options/examServices';
import { useWrap } from '~/context/wrap';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { PaymentMethod } from '~/lib/payment-method/payment-method';

const StudentExamOfServices = React.memo((props: any) => {
	const { Option } = Select;
	const [branch, setBranch] = useState<IBranch[]>();
	const [examServices, setExamServices] = useState<IExamServices[]>();
	const [discount, setDiscount] = useState<IDiscount[]>();
	const { showNoti } = useWrap();
	const [form] = Form.useForm();
	const [detail, setDetail] = useState<IExamServices>();
	const [isLoading, setIsLoading] = useState(false);
	const { setValue } = useForm();
	const [discountPrice, setDiscountPrice] = useState(0);
	const [debt, setDebt] = useState(0);
	const [paid, setPaid] = useState(0);

	const fetchDataSelectList = () => {
		(async () => {
			try {
				const _branch = await branchApi.getAll({
					pageIndex: 1,
					pageSize: 99999,
					Enable: true
				});
				const _examServices = await examServiceApi.getPaged({
					pageIndex: 1,
					pageSize: 99999
				});
				const _discount = await discountApi.getAll({
					pageIndex: 1,
					pageSize: 99999,
					Status: 2
				});
				_branch.status == 200 && setBranch(_branch.data.data);
				_examServices.status == 200 && setExamServices(_examServices.data.data);
				_discount.status == 200 && setDiscount(_discount.data.data);
			} catch (err) {
				showNoti('danger', err.message);
			}
		})();
	};

	useEffect(() => {
		fetchDataSelectList();
	}, []);

	const handleChangeExamServices = (value) => {
		setIsLoading(true);
		(async () => {
			try {
				const _detail = await examServiceApi.getDetail(value);
				//@ts-ignore
				_detail.status == 200 && setDetail(_detail.data.data);
			} catch (err) {
				showNoti('danger', err.message);
			} finally {
				setIsLoading(false);
			}
		})();
	};

	const handleDiscount = (value) => {
		if (detail != undefined) {
			let _dc = [];
			for (let i = 0; i < discount.length; i++) {
				if (discount[i].DiscountCode == value) {
					_dc.push(discount[i]);
				}
			}

			if (_dc[0].DiscountType == 1) {
				setDiscountPrice(_dc[0].Discount);
			}

			if (_dc[0].DiscountType == 2) {
				if (_dc[0].MaxDiscountPrice < (detail.Price * _dc[0].Discount) / 100) {
					showNoti('warning', `Số tiền được giảm tối đa là ${Intl.NumberFormat('ja-JP').format(_dc[0].MaxDiscountPrice)} VNĐ`);
					setDiscountPrice(_dc[0].MaxDiscountPrice);
				} else {
					setDiscountPrice((detail.Price * _dc[0].Discount) / 100);
				}
			}
		} else {
			showNoti('warning', 'Vui lòng chọn dịch vụ trước!!');
		}
	};

	useEffect(() => {
		if (detail != undefined) {
			setDebt(detail.Price - (paid + discountPrice));
		}
	}, [detail, paid, discountPrice]);

	return (
		<Card title="Học viên đăng ký đợt thi">
			<Spin spinning={isLoading}>
				<div className="row">
					<div className="col-12">
						<Form.Item
							name="ExamOfServiceID"
							label="Tên dịch vụ"
							rules={[
								{
									required: true,
									message: 'Vui lòng điền đủ thông tin!'
								}
							]}
						>
							<Select
								className="style-input"
								showSearch
								optionFilterProp="children"
								onChange={(value) => handleChangeExamServices(value)}
							>
								{examServices?.map((item, index) => (
									<Option key={index} value={item.ID}>
										{item.ServicesName}
									</Option>
								))}
							</Select>
						</Form.Item>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 col-12">
						<Form.Item label="Nhà cung cấp">
							<Input value={detail ? detail.SupplierServicesName : ''} className="style-input" readOnly={true} />
						</Form.Item>
					</div>
					<div className="col-md-6 col-12">
						<Form.Item label="Số lượng">
							<Input value={detail ? detail.Amount : ''} className="style-input" readOnly={true} />
						</Form.Item>
					</div>
				</div>

				<div className="row">
					<div className="col-md-6 col-12">
						<Form.Item label="Ngày thi">
							<Input
								value={detail ? moment(detail.DayOfExam).format('DD/MM/YYYY') : ''}
								className="style-input"
								readOnly={true}
							/>
						</Form.Item>
					</div>
					<div className="col-md-6 col-12">
						<Form.Item label="Giờ thi">
							<Input value={detail ? detail.TimeExam : ''} className="style-input" readOnly={true} />
						</Form.Item>
					</div>
				</div>

				<div className="row">
					<div className="col-md-6 col-12">
						<Form.Item label="Giá vốn">
							<Input
								value={detail ? Intl.NumberFormat('ja-JP').format(detail.InitialPrice) : ''}
								className="style-input"
								readOnly={true}
							/>
						</Form.Item>
					</div>
					<div className="col-md-6 col-12">
						<Form.Item label="Giá bán">
							<Input
								value={detail ? Intl.NumberFormat('ja-JP').format(detail.Price) : ''}
								className="style-input"
								readOnly={true}
							/>
						</Form.Item>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6 col-12">
						<Form.Item
							name="PayBranchID"
							label="Trung tâm thanh toán"
							rules={[
								{
									required: true,
									message: 'Vui lòng điền đủ thông tin!'
								}
							]}
						>
							<Select className="style-input" showSearch optionFilterProp="children">
								{branch?.map((item, index) => (
									<Option key={index} value={item.ID}>
										{item.BranchName}
									</Option>
								))}
							</Select>
						</Form.Item>
					</div>
					<div className="col-md-6 col-12">
						<Form.Item
							name="PaymentMethodsID"
							label="Hình thức thanh toán"
							rules={[
								{
									required: true,
									message: 'Vui lòng điền đủ thông tin!'
								}
							]}
						>
							<Select className="style-input">
								{PaymentMethod?.map((item, index) => (
									<Option key={index} value={item.id}>
										{item.Name}
									</Option>
								))}
							</Select>
						</Form.Item>
					</div>
				</div>

				<div className="row">
					<div className="col-md-6 col-12">
						<Form.Item name="DiscountCode" label="Mã giảm giá">
							<Select
								allowClear={true}
								className="style-input"
								showSearch
								optionFilterProp="children"
								onChange={(value) => handleDiscount(value)}
							>
								{discount?.map((item, index) => (
									<Option key={index} value={item.DiscountCode}>
										{item.DiscountCode}
									</Option>
								))}
							</Select>
						</Form.Item>
					</div>
					<div className="col-md-6 col-12">
						<Form.Item label="Số tiền được giảm">
							<Input value={Intl.NumberFormat('ja-JP').format(discountPrice)} className="style-input" readOnly={true} />
						</Form.Item>
					</div>
				</div>

				<div className="row">
					<div className="col-md-6 col-12">
						<Form.Item name="Paid" label="Thanh toán" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
							<InputNumber
								placeholder="Số tiền thanh toán"
								className="ant-input style-input w-100"
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
								onChange={(value: any) => {
									setValue('Paid', value);
									setPaid(value);
								}}
							/>
						</Form.Item>
					</div>
					<div className="col-md-6 col-12">
						<Form.Item label="Số tiền còn lại">
							<Input value={Intl.NumberFormat('ja-JP').format(debt)} className="style-input" readOnly={true} />
						</Form.Item>
					</div>
				</div>
			</Spin>

			<div className="row">
				<div className="col-12 text-center text-left-mobile">
					<button type="submit" className="btn btn-primary">
						Xác nhận
						{props.loading == true && <Spin className="loading-base" />}
					</button>
				</div>
			</div>
		</Card>
	);
});

export default StudentExamOfServices;
