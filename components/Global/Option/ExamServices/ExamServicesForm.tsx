import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Tooltip, Select, Spin, TimePicker, DatePicker, InputNumber } from 'antd';
import { RotateCcw } from 'react-feather';
import { useWrap } from '~/context/wrap';
import { useForm } from 'react-hook-form';
import { serviceApi } from '~/apiBase';
import moment from 'moment';
import { examServiceApi } from '~/apiBase/options/examServices';
import { numberWithCommas } from '~/utils/functions';

moment.locale('vn');

const ExamServicesForm = React.memo((props: any) => {
	const { Option } = Select;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { examServicesId, reloadData, examServicesDetail, currentPage } = props;
	const [form] = Form.useForm();
	const { showNoti } = useWrap();
	const [loading, setLoading] = useState(false);
	const { setValue } = useForm();

	const [services, setServices] = useState<IService>();

	const fetchData = () => {
		(async () => {
			try {
				const res = await serviceApi.getAll({ selectAll: true });
				//@ts-ignore
				res.status == 200 && setServices(res.data.data);
			} catch (err) {
				showNoti('danger', err.message);
			}
		})();
	};

	const examServiceType = [
		{
			id: 1,
			type: 'Thi thật'
		},
		{
			id: 2,
			type: 'Thi thử'
		}
	];

	useEffect(() => {
		fetchData();
	}, []);

	const onSubmit = async (data: any) => {
		setLoading(true);
		if (examServicesId) {
			try {
				let res = await examServiceApi.update({
					...data,
					Enable: true,
					ID: examServicesId
				});
				reloadData(currentPage);
				afterSubmit(res?.data.message);
			} catch (error) {
				showNoti('danger', error.message);
				setLoading(false);
			}
		} else {
			try {
				let res = await examServiceApi.add({
					...data,
					Enable: true,
					TimeExam: moment(data.TimeExam).format('LT')
				});
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
		if (examServicesDetail) {
			examServicesDetail.InitialPrice = parseInt(examServicesDetail.InitialPrice);
			form.setFieldsValue({
				...examServicesDetail,
				DayOfExam: null,
				TimeExam: ''
			});
		}
	}, [isModalVisible]);

	return (
		<>
			{examServicesId ? (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					<Tooltip title="Cập nhật">
						<RotateCcw />
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
				title={<>{examServicesId ? 'Cập nhật đợt thi' : 'Tạo đợt thi'}</>}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<Form.Item
									name="ServicesID"
									label="Dịch vụ"
									rules={[{ required: true, message: 'Vui lòng điền đủ thông tin!' }]}
								>
									<Select className="w-100 style-input" placeholder="Chọn dịch vụ ...">
										{services?.map((item, index) => (
											<Option key={index} value={item.ID}>
												{item.ServiceName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</div>
						</div>
						{/*  */}
						<div className="row">
							<div className="col-12">
								<Form.Item
									name="DayOfExam"
									label="Ngày thi"
									rules={[{ required: true, message: 'Vui lòng điền đủ thông tin!' }]}
								>
									<DatePicker className="style-input" onChange={(e) => setValue('DayOfExam', e)} />
								</Form.Item>
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<Form.Item
									name="TimeExam"
									label="Thời gian thi"
									rules={[
										{
											required: true,
											message: 'Vui lòng điền đủ thông tin!'
										}
									]}
								>
									<TimePicker
										format="HH:mm"
										className="style-input"
										onChange={(value) => setValue('TimeExam', moment(value).format('LT'))}
									/>
								</Form.Item>
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<Form.Item
									name="Amount"
									label="Số lượng thí sinh"
									rules={[{ required: true, message: 'Vui lòng điền đủ thông tin!' }]}
								>
									<Input
										placeholder="Số lượng thí sinh"
										type="number"
										className="style-input"
										onChange={(e) => setValue('Amount', e.target.value)}
									/>
								</Form.Item>
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<Form.Item
									name="InitialPrice"
									label="Giá vốn"
									rules={[{ required: true, message: 'Vui lòng điền đủ thông tin!' }]}
								>
									{/* <Input
										value={valuePrice.priceFirst}
										placeholder="Giá vốn"
										className="style-input w-100"
										onChange={(e) => onChange_Price(e, 'priceFirst')}
									/> */}
									<InputNumber
										type="number"
										className="ant-input style-input w-100 hide-icon"
										formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
										onChange={(value) => setValue('InitialPrice', value)}
									/>
								</Form.Item>
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<Form.Item
									name="Price"
									label="Giá bán"
									rules={[{ required: true, message: 'Vui lòng điền đủ thông tin!' }]}
								>
									{/* <Input
										value={valuePrice.priceBuy}
										placeholder="Giá bán"
										className="style-input"
										onChange={(e) => onChange_Price(e, 'priceBuy')}
									/> */}
									<InputNumber
										className="ant-input style-input w-100"
										formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
										onChange={(value) => setValue('Price', value)}
									/>
								</Form.Item>
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<Form.Item label="Hình thức thi" name="ExamOfServiceStyle">
									<Select
										className="style-input"
										placeholder="Chọn hình thức thi"
										onChange={(value) => setValue('ExamOfServiceStyle', value)}
										allowClear={true}
									>
										{examServiceType?.map((item, index) => (
											<Option key={index} value={item.id}>
												{item.type}
											</Option>
										))}
									</Select>
								</Form.Item>
							</div>
						</div>

						<div className="row ">
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100">
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

export default ExamServicesForm;
