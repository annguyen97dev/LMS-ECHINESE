import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Tooltip, Select, Spin, TimePicker, DatePicker } from 'antd';
import { RotateCcw } from 'react-feather';
import { useWrap } from '~/context/wrap';
import { useForm } from 'react-hook-form';
import { serviceApi } from '~/apiBase';
import moment from 'moment';
import { examServiceApi } from '~/apiBase/options/examServices';
import { courseReserveApi } from '~/apiBase/customer/student/course-reserve';

moment.locale('vn');

const ReserveCourseForm = React.memo((props: any) => {
	const { TextArea } = Input;
	const { Option } = Select;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { reloadData, infoDetail, currentPage } = props;
	const [form] = Form.useForm();
	const { showNoti } = useWrap();
	const [loading, setLoading] = useState(false);
	const { setValue } = useForm();

	const onSubmit = async (data: any) => {
		setLoading(true);
		try {
			let res = await courseReserveApi.add({
				...data,
				CourseOfStudentID: infoDetail.ID
			});
			afterSubmit(res?.data.message);
			reloadData(1);
			form.resetFields();
		} catch (error) {
			showNoti('danger', error.message);
			setLoading(false);
		}
	};

	const afterSubmit = (mes) => {
		showNoti('success', mes);
		setLoading(false);
		setIsModalVisible(false);
	};

	return (
		<>
			<button
				className="btn btn-icon view"
				onClick={() => {
					setIsModalVisible(true);
				}}
			>
				<Tooltip title="Bảo lưu khóa">
					<RotateCcw />
				</Tooltip>
			</button>

			<Modal title="Bảo lưu khóa" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
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
									<DatePicker className="style-input" onChange={(e) => setValue('ExpirationDate', e)} />
								</Form.Item>
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<Form.Item name="Note" label="Ghi chú">
									<TextArea className="style-input" onChange={(e) => setValue('Note', e.target.value)} />
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

export default ReserveCourseForm;
