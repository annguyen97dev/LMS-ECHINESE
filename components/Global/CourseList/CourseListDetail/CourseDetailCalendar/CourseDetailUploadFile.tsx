import { yupResolver } from '@hookform/resolvers/yup';
import { Spin } from 'antd';
import Form from 'antd/lib/form/Form';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';
import UploadFileField from '~/components/FormControl/UploadFileField';

CourseDetailUploadFile.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	isModalVisible: PropTypes.bool,
	handleCloseModal: PropTypes.func,
	handleUploadDocument: PropTypes.func,
	courseScheduleID: PropTypes.number
};
CourseDetailUploadFile.defaultProps = {
	isLoading: { type: '', status: false },
	isModalVisible: false,
	handleCloseModal: null,
	handleUploadDocument: null,
	courseScheduleID: 0
};
function CourseDetailUploadFile(props) {
	const { isLoading, isModalVisible, handleCloseModal, handleUploadDocument, courseScheduleID } = props;

	const schema = yup.object().shape({
		CourseScheduleID: yup.number().required('Bạn không được để trống'),
		File: yup.array().min(1, 'Bạn phải chọn ít nhất 1 file').nullable().required('Bạn không được để trống')
	});

	const defaultValuesInit = {
		CourseScheduleID: 0,
		File: []
	};

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	useEffect(() => {
		if (!isModalVisible) {
			form.reset({ ...defaultValuesInit });
		}
		if (!courseScheduleID) return;
		form.setValue('CourseScheduleID', courseScheduleID);
	}, [isModalVisible]);

	const checkHandleCloseModal = () => {
		if (!handleCloseModal) return;
		handleCloseModal();
	};

	const checkHandleUploadDocument = (data) => {
		if (!handleUploadDocument) return;
		handleUploadDocument(data).then((res) => {
			if (res && res.status === 200) {
				checkHandleCloseModal();
				form.reset({ ...defaultValuesInit });
			}
		});
	};

	return (
		<Modal title="Thêm tài liệu cho buổi học" visible={isModalVisible} footer={null} onCancel={checkHandleCloseModal} width={400}>
			<div className="wrap-form">
				<Form layout="vertical" onFinish={form.handleSubmit(checkHandleUploadDocument)}>
					<div className="row">
						<div className="col-md-12 col-12">
							<UploadFileField form={form} name="File" label="Tài liệu buổi học" max={1} />
						</div>
						<div className="col-md-12 col-12 mt-3" style={{ textAlign: 'center' }}>
							<button type="submit" className="btn btn-primary" disabled={isLoading.type == 'ADD_DATA' && isLoading.status}>
								Thêm tài liệu
								{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
							</button>
						</div>
					</div>
				</Form>
			</div>
		</Modal>
	);
}

export default CourseDetailUploadFile;
