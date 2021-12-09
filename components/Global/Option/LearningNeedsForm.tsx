import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Tooltip } from 'antd';
import { learningNeeds } from './../../../apiBase/options/learning-needs';
import { useWrap } from '~/context/wrap';
import { RotateCcw } from 'react-feather';

const LearningNeedsForm = (props) => {
	const [visible, setVisible] = useState(false);
	const [form] = Form.useForm();
	const [isLoading, setIsLoading] = useState({ type: '', status: false });
	const { showNoti } = useWrap();

	const handleCancel = () => {
		setVisible(false);
	};

	const _onSubmit = async (data) => {
		setIsLoading({ type: 'ADD_DATA', status: true });
		try {
			let res = props.type == 'add' ? await learningNeeds.insert(data) : await learningNeeds.update({ ...data, ID: props.record.ID });
			if (res.status == 200) {
				showNoti('success', 'Thêm thành công!');
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

			<Modal visible={visible} onCancel={handleCancel} title="Thêm nhu cầu học" footer={null}>
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
			</Modal>
		</>
	);
};

export default LearningNeedsForm;
