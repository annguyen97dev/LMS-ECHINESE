import React, { useState, useEffect } from 'react';
import { Form, Modal, Tooltip, Spin } from 'antd';
import PropTypes from 'prop-types';
import { CornerDownLeft, UserPlus } from 'react-feather';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import SelectField from '../FormControl/SelectField';
import { VideoCourseListApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';

ModalAddStudentTakedVideoCourse.propTypes = {
	getCourseRegisters: PropTypes.func,
	CourseID: PropTypes.number,
	userEmail: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string, value: PropTypes.number })),
	userName: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string, value: PropTypes.number })),
	userPhone: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string, value: PropTypes.number }))
};

export default function ModalAddStudentTakedVideoCourse(props) {
	const { userEmail, userPhone, userName, CourseID, getCourseRegisters } = props;
	const [isVisibleAddStudentModal, setIsVisibleAddStudentModal] = useState(false);
	const { showNoti } = useWrap();
	const [loading, setLoading] = useState(false);

	const schema = yup.object().shape({
		UserInformationID: yup.number().required('Bạn không được để trống')
	});

	const defaultValuesInit = {
		UserInformationID: null
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	const handleSubmit = async (data) => {
		console.log(data);
		setLoading(true);
		try {
			let res = await VideoCourseListApi.addStudent({ VideoCourseID: CourseID, UserInformationID: data.UserInformationID });
			console.log(res.data.data);
			if (res.status === 200) {
				showNoti('success', 'Thêm học viên thành công!');
				setIsVisibleAddStudentModal(false);
				getCourseRegisters();
			}
		} catch (error) {
			showNoti('error', error.message);
		} finally {
			setIsVisibleAddStudentModal(false);
			setLoading(false);
		}
	};

	return (
		<>
			<Tooltip title="Thêm học viên">
				<button
					className="btn-icon btn edit"
					onClick={() => {
						setIsVisibleAddStudentModal(true);
					}}
				>
					<UserPlus />
				</button>
			</Tooltip>
			<Modal
				title="Thêm học viên vào khóa"
				visible={isVisibleAddStudentModal}
				footer={null}
				onCancel={() => setIsVisibleAddStudentModal(false)}
				width={500}
			>
				<Form layout="vertical" onFinish={form.handleSubmit(handleSubmit)}>
					<div className="row">
						<div className="col-12">
							<SelectField
								name="UserInformationID"
								form={form}
								label="Email học viên"
								placeholder="Chọn Email học viên"
								optionList={userEmail}
							/>
						</div>
						<div className="col-12">
							<SelectField
								name="UserInformationID"
								form={form}
								label="Tên học viên"
								placeholder="Chọn tên học viên"
								optionList={userName}
							/>
						</div>
						<div className="col-12">
							<SelectField
								name="UserInformationID"
								form={form}
								label="Số điên thoại học viên"
								placeholder="Chọn số điện thoại học viên"
								optionList={userPhone}
							/>
						</div>
						<div className="col-12">
							<button className="btn-primary btn w-100" disabled={loading}>
								{' '}
								{loading ? <Spin /> : 'Thêm'}
							</button>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	);
}
