import React, { useState } from 'react';
import { Modal, Form, Input, Tooltip, Select, Spin, TimePicker, DatePicker } from 'antd';
import { RotateCcw } from 'react-feather';
import { useWrap } from '~/context/wrap';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { courseReserveApi } from '~/apiBase/customer/student/course-reserve';

moment.locale('vn');

const UpdateStudentReserveDate = React.memo((props: any) => {
	const { TextArea } = Input;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { reloadData, infoDetail, onUpdateStudentReserveDate } = props;
	const [form] = Form.useForm();
	const { showNoti } = useWrap();
	const [loading, setLoading] = useState(false);
	const { setValue } = useForm();

	const onSubmit = async (data: any) => {
		setLoading(true);
		try {
			data = { ...data, ID: infoDetail.ID };
			console.log('data', data);
			let res = await onUpdateStudentReserveDate(data);
			reloadData(1);
			form.resetFields();
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setLoading(false);
			setIsModalVisible(false);
		}
	};

	return (
		<>
			<button
				className="btn btn-icon view"
				onClick={() => {
					setIsModalVisible(true);
				}}
			>
				<Tooltip title="Cập nhật hạn bảo lưu">
					<RotateCcw />
				</Tooltip>
			</button>

			<Modal title="Cập nhật hạn bảo lưu" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="container-fluid">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						{/*  */}
						<div className="row">
							<div className="col-12">
								<Form.Item label="Học viên" rules={[{ required: true, message: 'Vui lòng điền đủ thông tin!' }]}>
									<Input
										disabled={true}
										className="style-input"
										readOnly={true}
										defaultValue={infoDetail.FullNameUnicode}
									/>
								</Form.Item>
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<Form.Item
									name="ExpirationDate"
									label="Hạn bảo lưu"
									rules={[{ required: true, message: 'Vui lòng điền đủ thông tin!' }]}
								>
									<DatePicker
										className="style-input"
										onChange={(e) => setValue('ExpirationDate', e)}
										defaultValue={moment(infoDetail.ExpirationDate, 'YYYY-MM-DD')}
									/>
								</Form.Item>
							</div>
						</div>

						<div className="row ">
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100">
									Cập nhật
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

export default UpdateStudentReserveDate;
