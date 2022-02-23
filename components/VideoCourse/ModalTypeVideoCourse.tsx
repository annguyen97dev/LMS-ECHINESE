import React, { useState, useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { RotateCcw } from 'react-feather';
import { VideoCourseCategoryApi } from '~/apiBase/video-course-store/category';
import { useWrap } from '~/context/wrap';

type Props = {
	typeOfModal: string;
	dataItem?: {
		ID: number;
		CategoryName: string;
		LevelName: string;
		CurriculumName: string;
	};
	onFetchData: Function;
};

const ModalTypeVideoCourse = (props: Props) => {
	const [isLoading, setIsLoading] = useState(false);
	const { typeOfModal, dataItem, onFetchData } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const { showNoti } = useWrap();

	const handleSubmit = async (data) => {
		console.log(data);
		setIsLoading(true);
		try {
			let res = await VideoCourseCategoryApi.add({
				ID: typeOfModal === 'add' ? null : dataItem.ID,
				CategoryName: data.CategoryName,
				Enable: true
			});
			if (res.status === 200) {
				showNoti('success', typeOfModal === 'add' ? 'Thêm thành công!' : 'Sửa thành công!');
				onFetchData && onFetchData();
				setIsModalVisible(false);
				form.resetFields();
			}
		} catch (error) {
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<>
			{typeOfModal === 'add' ? (
				<button
					className="btn btn-warning"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					Thêm loại video
				</button>
			) : (
				<button
					type="button"
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true);
						form.resetFields();
					}}
				>
					<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16 }}></i>
				</button>
			)}

			<Modal
				visible={isModalVisible}
				footer={null}
				onCancel={() => {
					setIsModalVisible(false);
				}}
				title={typeOfModal === 'add' ? 'Thêm loại video' : 'Sửa loại video'}
			>
				<Form onFinish={handleSubmit} form={form} layout="vertical">
					<div className="row">
						<div className="col-12">
							<Form.Item
								label="Loại video"
								name="CategoryName"
								initialValue={dataItem && dataItem.CategoryName}
								rules={[{ required: true, message: 'Vui lòng điền đủ thông tin!' }]}
							>
								<Input className="style-input" placeholder="Thêm tên loại" />
							</Form.Item>
						</div>
						<div className="col-12">
							<button className="btn btn-primary w-100" type="submit" disabled={isLoading}>
								Xác nhận
							</button>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default ModalTypeVideoCourse;
