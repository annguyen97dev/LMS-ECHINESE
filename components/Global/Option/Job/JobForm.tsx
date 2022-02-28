import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Tooltip, Select, Spin } from 'antd';
import { RotateCcw } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useWrap } from '~/context/wrap';
import { jobApi } from '~/apiBase';

const JobForm = React.memo((props: any) => {
	const { jobId, reloadData, jobDetail, currentPage } = props;
	const { setValue } = useForm();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const { showNoti } = useWrap();
	const [loading, setLoading] = useState(false);

	const onSubmit = async (data: any) => {
		setLoading(true);
		if (jobId) {
			try {
				let res = await jobApi.update({ ...data, Enable: true, JobID: jobId });
				afterSubmit(res?.data.message);
				reloadData(currentPage);
			} catch (error) {
				showNoti('danger', error.message);
				setLoading(false);
			}
		} else {
			try {
				let res = await jobApi.add({ ...data, Enable: true });
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
		if (isModalVisible === true) {
			if (jobDetail) {
				form.setFieldsValue(jobDetail);
			}
		}
	}, [isModalVisible]);

	console.log('job');

	return (
		<>
			{jobId ? (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					<Tooltip title="Cập nhật">
						<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16 }}></i>
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
				title={<>{jobId ? 'Thêm mới' : 'Cập nhật'}</>}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-12">
								<Form.Item
									name="JobName"
									label="Nghề nghiệp"
									rules={[{ required: true, message: 'Vui lòng điền đủ thông tin!' }]}
								>
									<Input
										placeholder="Nghề nghiệp"
										className="style-input"
										onChange={(e) => setValue('JobName', e.target.value)}
										allowClear={true}
									/>
								</Form.Item>
							</div>
						</div>
						<div className="row">
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

export default JobForm;
