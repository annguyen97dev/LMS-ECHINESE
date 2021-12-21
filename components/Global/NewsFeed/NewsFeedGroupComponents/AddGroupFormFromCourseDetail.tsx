import React, { useState, useEffect } from 'react';
import { Users } from 'react-feather';
import { Form, Modal, Input, Spin, Select, Upload } from 'antd';
import { groupNewsFeedApi, studentApi } from '~/apiBase';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useWrap } from '~/context/wrap';
import { useRouter } from 'next/router';

const AddGroupFormFromCourseDetail = (props) => {
	const { courseDetail, handleSubmit } = props;
	const [loadingImage, setLoadingImage] = useState(false);
	const [imgUrl, setImgUrl] = useState(null);
	const [form] = Form.useForm();
	const [showModal, setShowModal] = useState(false);
	const { showNoti } = useWrap();
	const { Option } = Select;
	const [isLoading, setIsLoading] = useState({ type: '', status: false });
	const router = useRouter();

	const UploadButton = (props) => {
		return (
			<>
				<div className={`bg-upload  ${loadingImage && 'loading'}`}>{loadingImage ? <LoadingOutlined /> : <PlusOutlined />}</div>
			</>
		);
	};

	const handleUploadAvatar = async (file) => {
		try {
			if (file.status === 'uploading') {
				setLoadingImage(true);
				return;
			}
			if (file.status === 'done') {
				const res = await studentApi.uploadImage(file.originFileObj);
				if (res.status === 200) {
					setImgUrl(res.data.data);
					console.log(res.data.data);
					return res;
				}
			}
		} catch (err) {
			console.log('UploadAvatarField-handleUploadAvatar', err);
		} finally {
			setLoadingImage(false);
		}
	};

	const beforeUpload = (file) => {
		const validTypeList = ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp'];
		const isValidType = validTypeList.includes(file.type);
		if (!isValidType) {
			showNoti('danger', `${file.name} không đúng định dạng (jpg | jpeg | png | bmp).`);
		}
		return isValidType;
	};

	const _onSubmit = async (data) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		try {
			const res = await groupNewsFeedApi.add({ Name: data.Name, CourseID: data.CourseID, BackGround: imgUrl });
			if (res.status === 200) {
				showNoti('success', res.data.message);
				router.push({ pathname: '/newsfeed/', query: { idGroup: res.data.data.ID } });
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};
	return (
		<>
			<div
				onClick={() => {
					setShowModal(true);
				}}
			>
				<Users />
				<span title="Nhóm"> Nhóm</span>
			</div>
			{courseDetail && (
				<Modal
					title="Thêm nhóm"
					visible={showModal}
					footer={null}
					onCancel={() => {
						setShowModal(false);
					}}
				>
					<Form layout="vertical" onFinish={_onSubmit} form={form}>
						<div className="row">
							<div className="col-12">
								<Form.Item label="Tên nhóm" name="Name" initialValue={courseDetail.CourseName}>
									<Input className="style-input" placeholder="Nhập tên nhóm" />
								</Form.Item>
							</div>
							<div className="col-12">
								<Form.Item label="Khóa học" name="CourseID" initialValue={courseDetail.ID}>
									<Select className="style-input" placeholder="Chọn khóa học" disabled>
										<Option value={courseDetail.ID}>{courseDetail.CourseName}</Option>
									</Select>
								</Form.Item>
							</div>
							<div className="col-12">
								<Form.Item label="Ảnh bìa" name="BackGround">
									<Upload
										name="BackGround"
										listType="picture-card"
										className="avatar-uploader"
										showUploadList={false}
										beforeUpload={beforeUpload}
										onChange={(obj) => {
											handleUploadAvatar(obj.file).then(
												(res) => res?.status === 200 && form.setFieldsValue({ BackGround: res.data })
											);
										}}
									>
										<img
											src={imgUrl && imgUrl}
											alt="avatar"
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
												display: imgUrl && imgUrl ? 'block' : 'none'
											}}
										/>
										<UploadButton />
									</Upload>
								</Form.Item>
							</div>
							<div className="col-12">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={(isLoading.type == 'ADD_DATA' && isLoading.status) || loadingImage}
								>
									Lưu
									{((isLoading.type == 'ADD_DATA' && isLoading.status) || loadingImage) && (
										<Spin className="loading-base" />
									)}
								</button>
							</div>
						</div>
					</Form>
				</Modal>
			)}
		</>
	);
};

export default AddGroupFormFromCourseDetail;
