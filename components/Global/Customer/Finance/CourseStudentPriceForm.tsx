import {
	DatePicker,
	Form,
	Input,
	InputNumber,
	Modal,
	Select,
	Spin,
	Tooltip,
} from 'antd';
import React, {useEffect, useState} from 'react';
import {CreditCard} from 'react-feather';
import {useForm} from 'react-hook-form';
import {branchApi} from '~/apiBase';
import {courseStudentPriceApi} from '~/apiBase/customer/student/course-student-price';
import {useWrap} from '~/context/wrap';

const CourseOfStudentPriceForm = React.memo((props: any) => {
	const {Option} = Select;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const {infoId, reloadData, infoDetail, currentPage} = props;
	const [form] = Form.useForm();
	const {showNoti} = useWrap();
	const [loading, setLoading] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const {setValue} = useForm();

	const [payBranch, setPayBranch] = useState<IBranch[]>();
	const paymentMethod = [
		{
			title: 'Tiền mặt',
			value: 1,
		},
		{
			title: 'Chuyển khoản',
			value: 2,
		},
	];
	const fetchData = () => {
		setIsLoading(true);
		(async () => {
			try {
				const _payBranch = await branchApi.getAll({
					pageSize: 99999,
					pageIndex: 1,
				});
				//@ts-ignore
				_payBranch.status == 200 && setPayBranch(_payBranch.data.data);
			} catch (err) {
				showNoti('danger', err.message);
			} finally {
				setIsLoading(false);
			}
		})();
	};

	const onSubmit = async (data: any) => {
		setLoading(true);
		if (infoId) {
			try {
				let res = await courseStudentPriceApi.update({
					...data,
					Enable: true,
					ID: infoId,
				});
				reloadData(currentPage);
				afterSubmit(res?.data.message);
			} catch (error) {
				showNoti('danger', error.message);
				setLoading(false);
			}
		} else {
			try {
				let res = await courseStudentPriceApi.add({...data, Enable: true});
				afterSubmit(res?.data.message);
				reloadData(1);
				form.resetFields();
			} catch (error) {
				showNoti('danger', error.message);
				setLoading(false);
			}
		}
	};

	const afterSubmit = (mes) => {
		showNoti('success', mes);
		setLoading(false);
		setIsModalVisible(false);
	};

	useEffect(() => {
		if (isModalVisible == true) {
			fetchData();
			if (infoDetail) {
				form.setFieldsValue({
					...infoDetail,
					Paid: null,
					PayDate: null,
					payBranch: null,
				});
			}
		}
	}, [isModalVisible]);

	return (
		<>
			{infoId ? (
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
				title={<>{infoId ? 'Thanh toán học phí' : 'Học viên nợ học phí'}</>}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div>
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12 col-md-6">
								<Form.Item name="FullNameUnicode" label="Học viên">
									<Input
										value={infoDetail.FullNameUnicode}
										readOnly={true}
										className="style-input"
										// onChange={(e) =>
										//   setValue("FullNameUnicode", e.target.value)
										// }
									/>
								</Form.Item>
							</div>

							<div className="col-12 col-md-6">
								<Form.Item name="MoneyInDebt" label="Số tiền còn lại">
									<InputNumber
										value={infoDetail.MoneyInDebt}
										readOnly={true}
										className="ant-input style-input w-100"
										formatter={(value) =>
											`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
										}
										parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
										// onChange={(value) => setValue("MoneyInDebt", value)}
									/>
								</Form.Item>
							</div>
						</div>
						<div className="row">
							<div className="col-12 col-md-6">
								<Form.Item
									name="Paid"
									label="Thanh toán"
									rules={[
										{
											required: true,
											message: 'Vui lòng điền đủ thông tin!',
										},
									]}
								>
									<InputNumber
										value="0"
										className="ant-input style-input w-100"
										formatter={(value) =>
											`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
										}
										//@ts-ignore
										parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
										onChange={(value) => setValue('Paid', value)}
										placeholder="Nhập số tiền thanh toán"
									/>
								</Form.Item>
							</div>

							<div className="col-12 col-md-6">
								<Form.Item
									name="PaymentMethodsID"
									label="Hình thức thanh toán"
									rules={[
										{
											required: true,
											message: 'Vui lòng điền đủ thông tin!',
										},
									]}
								>
									<Select
										className="w-100 style-input"
										placeholder="Chọn hình thức thanh toán"
									>
										{paymentMethod?.map((item, index) => (
											<Option key={index} value={item.value}>
												{item.title}
											</Option>
										))}
									</Select>
								</Form.Item>
							</div>
						</div>

						<div className="row">
							<div className="col-12 col-md-6">
								<Form.Item
									name="PayBranchID"
									label="Trung tâm thanh toán"
									rules={[
										{
											required: true,
											message: 'Vui lòng điền đủ thông tin!',
										},
									]}
								>
									<Select
										className="w-100 style-input"
										placeholder="Chọn trung tâm thanh toán"
									>
										{payBranch?.map((item, index) => (
											<Option key={index} value={item.ID}>
												{item.BranchName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</div>
							<div className="col-12 col-md-6">
								<Form.Item
									name="PayDate"
									label="Ngày thu tiếp theo"
									rules={[
										{
											required: true,
											message: 'Vui lòng điền đủ thông tin!',
										},
									]}
								>
									<DatePicker
										className="style-input"
										onChange={(e) => setValue('PayDate', e)}
										format="DD/MM/YYYY"
										placeholder="Chọn ngày thu tiếp theo"
									/>
								</Form.Item>
							</div>
						</div>
						{/*  */}

						<div className="row mt-3">
							<div className="col-12">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={loading}
								>
									Lưu
									{loading == true && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
});

export default CourseOfStudentPriceForm;
