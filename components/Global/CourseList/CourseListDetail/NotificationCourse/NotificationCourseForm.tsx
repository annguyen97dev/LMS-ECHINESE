import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Modal, Spin } from 'antd';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useWrap } from '~/context/wrap';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';
import TextAreaField from '~/components/FormControl/TextAreaField';

NotificationCourseForm.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	handleSubmit: PropTypes.func
};
NotificationCourseForm.defaultProps = {
	isLoading: { type: '', status: false },
	handleSubmit: null
};
function NotificationCourseForm(props) {
	const { userInformation } = useWrap();
	const { isLoading, handleSubmit } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const openModal = () => setIsModalVisible(true);
	const closeModal = () => setIsModalVisible(false);

	const schema = yup.object().shape({
		NotificationTitle: yup.string().required('Bạn không được để trống'),
		NotificationContent: yup.string().required('Bạn không được để trống')
	});
	const defaultValuesInit = {
		NotificationTitle: '',
		NotificationContent: ''
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	const checkHandleSubmit = (data) => {
		if (!handleSubmit) return;
		handleSubmit(data).then((res) => {
			if (res) {
				form.reset({ ...defaultValuesInit });
				setIsModalVisible(false);
			}
		});
	};

	const isStudent = () => {
		let role = userInformation?.RoleID;
		if (role == 3) {
			return true;
		} else {
			return false;
		}
	};

	return (
		<>
			{!isStudent() && (
				<button className="btn btn-warning add-new" onClick={openModal}>
					Thêm mới
				</button>
			)}
			<Modal title="Tạo thông báo mới" visible={isModalVisible} footer={null} onCancel={closeModal}>
				<div className="wrap-form">
					<Form layout="vertical" onFinish={form.handleSubmit(checkHandleSubmit)}>
						<div className="row">
							<div className="col-12">
								<InputTextField form={form} name="NotificationTitle" label="Thông báo" placeholder="Nhập thông báo" />
							</div>

							<div className="col-12">
								<TextAreaField
									form={form}
									name="NotificationContent"
									label="Nội dung thông báo"
									placeholder="Nhập nội dung thông báo"
									rows={5}
								/>
							</div>

							<div className="col-12">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={isLoading.type == 'ADD_NOTI' && isLoading.status}
								>
									Lưu
									{isLoading.type == 'ADD_NOTI' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
}

export default NotificationCourseForm;
