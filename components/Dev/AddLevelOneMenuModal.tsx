import { Form, Input, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'react-feather';
import { devApi } from '~/apiBase/dev/dev';
import { useWrap } from '~/context/wrap';

type Props = {
	roleID: number;
	type: string;
	item?: {
		CreatedBy: string;
		CreatedOn: string;
		Enable: boolean;
		ID: number;
		Icon: string;
		Level: number;
		MenuName: string;
		ModifiedBy: string;
		ModifiedOn: string;
		ParentID?: number;
		RoleID: number;
		Route: string;
	};
};

const AddParentMenuModal = (props: Props) => {
	const { roleID, type, item } = props;
	const [form] = Form.useForm();
	const { showNoti } = useWrap();
	const [isVisible, setIsVisible] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (data) => {
		setLoading(true);
		console.log(data);
		try {
			if (type === 'add') {
				let res = await devApi.insertMenu({
					Level: 1,
					RoleID: roleID,
					Icon: data.Icon,
					MenuName: data.MenuName
				});
				if (res.status === 200) {
					showNoti('success', 'Add success!');
					setIsVisible(false);
				}
			}
			if (type === 'edit') {
				let res = await devApi.updateMenu({
					ID: item.ID,
					Level: 1,
					RoleID: roleID,
					Icon: data.Icon,
					MenuName: data.MenuName,
					Enable: true
				});
				if (res.status === 200) {
					showNoti('success', 'Add success!');
					setIsVisible(false);
				}
			}
		} catch (error) {
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			{type === 'add' && (
				<button
					className="btn btn-primary mt-3"
					onClick={() => {
						setIsVisible(true);
					}}
				>
					Add level one menu
				</button>
			)}
			{type === 'edit' && (
				<button
					className="btn-icon btn edit"
					onClick={() => {
						setIsVisible(true);
					}}
				>
					<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16 }}></i>
				</button>
			)}

			<Modal
				visible={isVisible}
				footer={null}
				onCancel={() => {
					setIsVisible(false);
				}}
				title="Add parent menu"
			>
				<Form onFinish={handleSubmit} form={form} layout="vertical">
					<div className="row">
						<div className="col-12">
							<Form.Item label="Menu Name" name="MenuName">
								<Input className="style-input" placeholder="Add TabName" />
							</Form.Item>
						</div>
						<div className="col-12">
							<Form.Item label="Icon" name="Icon">
								<Input className="style-input" placeholder="Add Icon" />
							</Form.Item>
						</div>
						<div className="col-12">
							<button className="btn btn-primary w-100" disabled={loading}>
								Add
							</button>
						</div>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default AddParentMenuModal;
