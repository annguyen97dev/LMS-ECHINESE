import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Modal, Spin } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import TextAreaField from '~/components/FormControl/TextAreaField';

TimelineCourseForm.propTypes = {
	isLoading: PropTypes.shape({
		type: PropTypes.string.isRequired,
		status: PropTypes.bool.isRequired
	}),
	handleSubmit: PropTypes.func
};
TimelineCourseForm.defaultProps = {
	isLoading: { type: '', status: false },
	handleSubmit: null
};
function TimelineCourseForm(props) {
	const { isLoading, handleSubmit } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);

	const schema = yup.object().shape({
		Note: yup.string().required('Bạn không được để trống')
	});
	const defaultValuesInit = {
		Note: ''
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

	return (
		<>
			<button
				className="btn btn-warning add-new"
				onClick={() => {
					setIsModalVisible(true);
				}}
			>
				Thêm mới
			</button>

			<Modal title="Thêm phản hồi" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div>
					<Form layout="vertical" onFinish={form.handleSubmit(checkHandleSubmit)}>
						<div className="row">
							<div className="col-12">
								<TextAreaField form={form} name="Note" label="Phản hồi" placeholder="Nhập phản hồi" rows={5} />
							</div>
							<div className="col-12">
								<TextAreaField
									form={form}
									name="NoteStudent"
									label="Phản hồi về học viên"
									placeholder="Nhập phản hồi"
									rows={5}
								/>
							</div>
							<div className="col-12">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={isLoading.type == 'ADD_TIMELINE' && isLoading.status}
								>
									Lưu
									{isLoading.type == 'ADD_TIMELINE' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
}

export default TimelineCourseForm;
