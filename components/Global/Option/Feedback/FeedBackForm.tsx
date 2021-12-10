import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Tooltip, Select, Spin } from 'antd';
import { RotateCcw } from 'react-feather';
import { useWrap } from '~/context/wrap';
import { Roles } from '~/lib/roles/listRoles';
import { useForm } from 'react-hook-form';
import { feedbackApi } from '~/apiBase/options/feedback';

const FeedbackForm = React.memo((props: any) => {
	const { Option } = Select;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { feedbackId, reloadData, feedbackDetail, currentPage } = props;
	const [form] = Form.useForm();
	const { showNoti, useAllRoles } = useWrap();
	const [loading, setLoading] = useState(false);
	const { setValue } = useForm();

	const onSubmit = async (data: any) => {
		setLoading(true);
		if (feedbackId) {
			try {
				let res = await feedbackApi.update({
					...data,
					Enable: true,
					ID: feedbackId
				});
				reloadData(currentPage);
				afterSubmit(res?.data.message);
			} catch (error) {
				showNoti('danger', error.message);
				setLoading(false);
			}
		} else {
			try {
				let res = await feedbackApi.add({ ...data, Enable: true });
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
		if (feedbackDetail) {
			form.setFieldsValue(feedbackDetail);
		}
	}, [isModalVisible]);

	return (
		<>
			{feedbackId ? (
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
				title={<>{feedbackId ? 'Cập nhật loại phản hồi' : 'Tạo loại phản hồi'}</>}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<Form.Item name="Role" label="Role" rules={[{ required: true, message: 'Vui lòng điền đủ thông tin!' }]}>
									<Select className="w-100 style-input" placeholder="Chọn role người tạo ...">
										{useAllRoles &&
											useAllRoles.map((row) => (
												<Option key={row.ID} value={row.ID}>
													{row.name}
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
									name="Name"
									label="Loại phản hồi"
									rules={[{ required: true, message: 'Vui lòng điền đủ thông tin!' }]}
								>
									<Input
										placeholder="Nhập vào loại phản hồi..."
										className="style-input"
										onChange={(e) => setValue('Name', e.target.value)}
										allowClear={true}
									/>
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

export default FeedbackForm;
