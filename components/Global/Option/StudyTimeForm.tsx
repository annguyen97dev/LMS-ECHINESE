import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Spin, Tooltip, Select, TimePicker } from 'antd';
import { useForm } from 'react-hook-form';
import { gradeApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';
import { RotateCcw } from 'react-feather';
import moment from 'moment';

const StudyTimeForm = (props) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { Option } = Select;

	const { isLoading, rowID, _onSubmit, getIndex, index, rowData } = props;
	const {
		register,
		handleSubmit,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm();
	const { showNoti } = useWrap();
	const [form] = Form.useForm();

	// SUBMI FORM
	const onSubmit = handleSubmit((data: any, e) => {
		let res = _onSubmit(data);

		res.then(function (rs: any) {
			rs && rs.status == 200 && (setIsModalVisible(false), form.resetFields());
		});
	});

	useEffect(() => {
		if (isModalVisible) {
			if (rowID) {
				getIndex();
				// Cập nhật giá trị khi show form update
				Object.keys(rowData).forEach(function (key) {
					setValue(key, rowData[key]);
				});
				form.setFieldsValue(rowData);
			}
		}
	}, [isModalVisible]);

	return (
		<>
			{rowID ? (
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

			{/*  */}
			<Modal
				title={rowData ? 'Cập nhật ca học' : 'Thêm mới ca học'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<Form.Item name="Name" label="Ca học" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
									<Input
										placeholder=""
										className="style-input"
										allowClear={true}
										onChange={(e) => setValue('Name', e.target.value)}
									/>
								</Form.Item>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<Form.Item name="Time" label="Thời gian" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
									<Input
										placeholder="Số phút, VD: 120"
										className="style-input"
										onChange={(e) => setValue('Time', e.target.value)}
										allowClear={true}
									/>
								</Form.Item>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<Form.Item
									name="TimeStart"
									label="Thời gian bắt đầu"
									rules={[{ required: true, message: 'Bạn không được để trống' }]}
								>
									{/* <Input
                    placeholder=""
                    className="style-input"
                    onChange={(e) => setValue("TimeStart", e.target.value)}
                    allowClear={true}
                  /> */}
									<TimePicker
										className="style-input"
										format="HH:mm"
										onChange={(time, timeString) => {
											setValue('TimeStart', timeString);
										}}
									/>
								</Form.Item>
							</div>
						</div>
						<div className="row ">
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100">
									Lưu
									{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};

export default StudyTimeForm;
