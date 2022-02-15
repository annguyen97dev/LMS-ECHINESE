import { Form, Input, Modal, Select, Upload } from 'antd';
import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'react-feather';
import { devApi } from '~/apiBase/dev/dev';
import { useWrap } from '~/context/wrap';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { studentApi } from '~/apiBase';

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
		ParentID: number;
		RoleID: number;
		Route: string;
	};
};

const AddLevelTwoMenuModal = (props: Props) => {
	const { roleID, type, item } = props;
	const [form] = Form.useForm();
	const { showNoti } = useWrap();
	const [isVisible, setIsVisible] = useState(false);
	const [currentMenuType, setCurrentMenuType] = useState(null);
	const [loading, setLoading] = useState(false);
	const [imgUrl, setImgUrl] = useState();
	const [loadingImage, setLoadingImage] = useState(false);

	const menuType = ['sub-menu', 'single'];
	const { Option } = Select;

	const handleSubmit = async (data) => {
		setLoading(true);
		console.log(data);
		try {
			if (currentMenuType === 'single') {
				let res = await devApi.insertMenu({
					Level: 2,
					RoleID: roleID,
					Icon: data.Icon,
					MenuName: data.MenuName
				});
				if (res.status === 200) {
					showNoti('success', 'Add success!');
					setIsVisible(false);
				}
			}
			if (currentMenuType === 'sub-menu') {
				let res = await devApi.updateMenu({
					ID: item.ID,
					Level: 2,
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

	const onChangeType = (value) => {
		setCurrentMenuType(value);
	};

	const UploadButton = (props) => {
		const { img } = props;
		return (
			<>
				<div className={`bg-upload ${img && 'have-img'} ${loadingImage && 'loading'}`}>
					{loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
				</div>
			</>
		);
	};

	const handleChange_img = async (info: any) => {
		if (info.file.status === 'uploading') {
			setLoadingImage(true);
			return;
		}

		try {
			let res = await studentApi.uploadImage(info.file.originFileObj);
			res?.status == 200 && (showNoti('success', 'Upload ảnh thành công'), setImgUrl(res.data.data));
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoadingImage(false);
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
					Add level two menu
				</button>
			)}
			{type === 'edit' && (
				<button
					className="btn-icon btn edit"
					onClick={() => {
						setIsVisible(true);
					}}
				>
					<RotateCcw />
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
							<Form.Item label="Menu Type" name="MenuType">
								<Select className="style-input" placeholder="Select type" allowClear onChange={onChangeType}>
									{menuType.map((item, index) => (
										<Option value={item} key={index}>
											{item}
										</Option>
									))}
								</Select>
							</Form.Item>
						</div>

						{/* DIVIDE SINGLE AND SUB-MENU */}
						{currentMenuType === 'single' ? (
							<>
								<div className="col-12">
									<Form.Item label="Menu Name" name="MenuName">
										<Input className="style-input" placeholder="Add TabName" />
									</Form.Item>
								</div>
								<div className="col-12">
									<Form.Item label="Route" name="Route">
										<Input className="style-input" placeholder="Add Route" />
									</Form.Item>
								</div>
							</>
						) : (
							<>
								<div className="col-12">
									<Form.Item label="Menu Name" name="MenuName">
										<Input className="style-input" placeholder="Add TabName" />
									</Form.Item>
								</div>
								<div className="col-12">
									<Form.Item label="Icon" name="Icon">
										<Upload
											name="avatar"
											listType="picture-card"
											className="avatar-uploader"
											showUploadList={false}
											onChange={handleChange_img}
										>
											<img
												src={imgUrl ? imgUrl : '/images/user-none.png'}
												alt="avatar"
												style={{
													width: '100%',
													height: '100%',
													objectFit: 'cover'
													// display: imgUrl ? 'block' : 'none'
												}}
											/>

											<UploadButton img={imgUrl} />
										</Upload>
									</Form.Item>
								</div>
							</>
						)}

						{/* BUTTON SUBMIT */}
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

export default AddLevelTwoMenuModal;
