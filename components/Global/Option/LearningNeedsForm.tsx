import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Tooltip } from 'antd';
import { learningNeeds } from './../../../apiBase/options/learning-needs';
import { useWrap } from '~/context/wrap';
import { RotateCcw, X } from 'react-feather';

const LearningNeedsForm = (props) => {
	const [visible, setVisible] = useState(false);
	const [form] = Form.useForm();
	const [isLoading, setIsLoading] = useState({ type: '', status: false });
	const { showNoti } = useWrap();

	const handleCancel = () => {
		setVisible(false);
	};

	const handleDelete = async () => {
		setIsLoading({ type: 'ADD_DATA', status: true });
		try {
			let res = await learningNeeds.update({ ID: props.record.ID, Enable: false });
			if (res.status == 200) {
				showNoti('success', 'Xóa thành công!');
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'ADD_DATA', status: false });
		}
	};

	const _onSubmit = async (data) => {
		setIsLoading({ type: 'ADD_DATA', status: true });
		try {
			let res = null;
			if (props.type == 'add') {
				res = await learningNeeds.insert(data);
			}
			if (props.type == 'deleterow') {
				res = await learningNeeds.update({ ID: props.record.ID, Enable: false });
			}
			if (props.type == 'edit') {
				res = await learningNeeds.update({ ...data, ID: props.record.ID });
			}
			if (res.status == 200) {
				showNoti(
					'success',
					props.type == 'add' ? 'Thêm thành công!' : props.type == 'edit' ? 'Sửa thành công!' : 'Xóa thành công!'
				);
				setVisible(false);
				props.setTodoApi();
				form.resetFields();
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({ type: 'ADD_DATA', status: false });
		}
	};

	return (
		<>
			{props.type == 'edit' && (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setVisible(true);
						form.resetFields();
					}}
					type="button"
				>
					<Tooltip title="Sửa nhu cầu học">
						<RotateCcw />
					</Tooltip>
				</button>
			)}
			{props.type == 'add' && (
				<button
					className="btn btn-warning"
					onClick={() => {
						setVisible(true);
						form.resetFields();
					}}
					type="button"
				>
					Thêm nhu cầu học
				</button>
			)}
			{props.type == 'deleterow' && (
				<button
					className="btn  btn-icon delete"
					onClick={() => {
						setVisible(true);
					}}
					type="button"
				>
					<Tooltip title="Xóa nhu cầu học">
						<X />
					</Tooltip>
				</button>
			)}

			<Modal visible={visible} onCancel={handleCancel} title="Thêm nhu cầu học" footer={null}>
				{props.type == 'deleterow' ? (
					<Form form={form} onFinish={_onSubmit} layout="vertical">
						<div className="row">
							<div className="col-12">
								<p className="text-confirm">Bạn có chắc muốn xóa nhu cầu học này?</p>
							</div>
							<div className="col-12">
								<button
									className="btn btn-primary w-100"
									type="submit"
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									Xóa
								</button>
							</div>
						</div>
					</Form>
				) : (
					<Form form={form} onFinish={_onSubmit} layout="vertical">
						<div className="row">
							<div className="col-12">
								<Form.Item name="Name" label="Nhu cầu học" rules={[{ required: true, message: 'Bạn không được để trống' }]}>
									<Input
										placeholder="Nhập nhu cầu học"
										className="style-input"
										defaultValue={props.record && props.record.Name}
									/>
								</Form.Item>
							</div>
							<div className="col-12">
								<button
									className="btn btn-primary w-100"
									type="submit"
									disabled={isLoading.type == 'ADD_DATA' && isLoading.status}
								>
									Lưu
								</button>
							</div>
						</div>
					</Form>
				)}
			</Modal>
		</>
	);
};

export default LearningNeedsForm;
