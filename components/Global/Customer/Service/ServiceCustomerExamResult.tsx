import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Switch, Tooltip, Select, DatePicker, InputNumber, Spin } from 'antd';
import { RotateCcw, Edit } from 'react-feather';
import { useWrap } from '~/context/wrap';
import { useForm } from 'react-hook-form';
import moment from 'moment';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

const ServiceCustomerExamResult = (props) => {
	const { Option } = Select;
	const { TextArea } = Input;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const { showNoti } = useWrap();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm();
	// const { showNoti } = useWrap();

	const onSubmit = handleSubmit((data: any) => {
		console.log('Data submit', data);

		if (Object.keys(data).length === 1) {
			showNoti('danger', 'Bạn chưa chỉnh sửa');
		} else {
			let res = props._onSubmit(data);
			res.then(function (rs: any) {
				console.log(rs);
				rs && rs.status == 200 && setIsModalVisible(false), console.log(isModalVisible);
			});
		}
	});

	useEffect(() => {
		if (isModalVisible) {
			if (props.rowData) {
				// Object.keys(props.rowData).forEach(function (key) {
				//   setValue(key, props.rowData[key]);
				// });
				setValue('ID', props.rowData.ID);
			}
		}
		// console.log(props.rowData?.DayOfExam);
	}, [isModalVisible]);

	return (
		<>
			{props.showIcon && (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					<Tooltip title="Cập nhật lại điểm">
						<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16 }}></i>
					</Tooltip>
				</button>
			)}

			{/*  */}
			<Modal title="Cập nhật lại điểm" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<Form.Item label="Học viên" name="Học viên" initialValue={props.rowData?.FullNameUnicode}>
									<Input className="style-input" readOnly={true} />
								</Form.Item>
							</div>
						</div>
						<div className="row">
							<div className="col-6">
								<Form.Item
									label="Ngày thị"
									name="Ngày thị"
									initialValue={moment(props.rowData?.DayOfExam).format('DD/MM/YYYY')}
								>
									<Input className="style-input" readOnly={true} />
								</Form.Item>
							</div>
							<div className="col-6">
								<Form.Item label="Số kỹ năng" name="Số kỹ năng" initialValue={props.rowData?.Skills}>
									<InputNumber
										className="ant-input w-100 style-input"
										min={1}
										max={4}
										onChange={(value) => setValue('Skills', value)}
									/>
								</Form.Item>
							</div>
						</div>
						<div className="row">
							<div className="col-6">
								<Form.Item
									label="Listeing"
									name="Listeing"
									// rules={[{ required: true, message: 'Bạn không được bỏ trống' }]}
									initialValue={props.rowData?.ListeningPoint}
								>
									<InputNumber
										className="ant-input w-100 style-input"
										onChange={(value) => setValue('ListeningPoint', value)}
									/>
								</Form.Item>
							</div>
							<div className="col-6">
								<Form.Item label="Speaking" name="Speaking" initialValue={props.rowData?.SpeakingPoint}>
									<InputNumber
										className="ant-input w-100 style-input"
										onChange={(value) => setValue('SpeakingPoint', value)}
									/>
								</Form.Item>
							</div>
						</div>
						<div className="row">
							<div className="col-6">
								<Form.Item label="Reading" name="Reading" initialValue={props.rowData?.ReadingPoint}>
									<InputNumber
										className="ant-input w-100 style-input"
										onChange={(value) => setValue('ReadingPoint', value)}
									/>
								</Form.Item>
							</div>
							<div className="col-6">
								<Form.Item label="Writing" name="Writing" initialValue={props.rowData?.WritingPoint}>
									<InputNumber
										className="ant-input w-100 style-input"
										onChange={(value) => setValue('WritingPoint', value)}
									/>
								</Form.Item>
							</div>
						</div>
						<div className="row ">
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100">
									Lưu
									{props.isLoading.type == 'ADD_DATA' && props.isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};

export default ServiceCustomerExamResult;
