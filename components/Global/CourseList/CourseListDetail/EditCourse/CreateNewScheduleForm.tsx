import { yupResolver } from '@hookform/resolvers/yup';
import { Spin } from 'antd';
import Form from 'antd/lib/form/Form';
import Modal from 'antd/lib/modal/Modal';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import { optionCommonPropTypes } from '~/utils/proptypes';

CreateNewScheduleForm.propTypes = {
	handleOnCreateSchedule: PropTypes.func,
	optionSubjectList: optionCommonPropTypes,
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	})
};
CreateNewScheduleForm.defaultProps = {
	handleOnCreateSchedule: null,
	optionSubjectList: [],
	isLoading: { type: '', status: false }
};
function CreateNewScheduleForm(props) {
	const { handleOnCreateSchedule, isLoading, optionSubjectList } = props;

	const [isModalVisible, setIsModalVisible] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const schema = yup.object().shape({
		SubjectID: yup.number(),
		StudyDay: yup.number().typeError('Bạn không được bỏ trống').nullable().required('Bạn không được bỏ trống')
	});
	const defaultValuesInit = {
		SubjectID: 0,
		StudyDay: null
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema),
		mode: 'onChange'
	});

	const checkHandleOnCreateSchedule = (data) => {
		if (!handleOnCreateSchedule) return;
		handleOnCreateSchedule(data);
		handleOk();
		form.reset(defaultValuesInit);
	};

	return (
		<>
			<button type="button" className="btn btn-warning" onClick={showModal}>
				Tạo buổi học
			</button>
			<Modal width="350px" title="Tạo buổi học" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
				<div className="wrap-form">
					<Form layout="vertical" onFinish={form.handleSubmit(checkHandleOnCreateSchedule)}>
						<SelectField
							form={form}
							name="SubjectID"
							label="Môn học"
							optionList={optionSubjectList}
							isLoading={isLoading.type === 'FETCH_SUBJECT' && isLoading.status}
						/>
						<InputTextField form={form} name="StudyDay" label="Số buổi học" isRequired placeholder="Nhập số buổi học" />
						<button
							type="submit"
							className="btn btn-primary w-100 mt-3"
							disabled={isLoading.type == 'CREATE_SCHEDULE' && isLoading.status}
						>
							Khởi tạo
							{isLoading.type == 'CREATE_SCHEDULE' && isLoading.status && <Spin className="loading-base" />}
						</button>
					</Form>
				</div>
			</Modal>
		</>
	);
}

export default CreateNewScheduleForm;
