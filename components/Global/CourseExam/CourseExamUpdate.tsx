import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useWrap } from '~/context/wrap';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Divider, Form, Modal, Spin, Tooltip } from 'antd';
import SelectField from '~/components/FormControl/SelectField';
import TextAreaField from '~/components/FormControl/TextAreaField';
import { UndoOutlined } from '@ant-design/icons';
import { courseExamApi } from '~/apiBase/package/course-exam';

let returnSchema = {};
let schema = null;

const CourseExamUpdate = (props) => {
	const { dataTeacher, dataRow, onFetchData } = props;
	const { showNoti } = useWrap();

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	// -----  HANDLE ALL IN FORM -------------
	const defaultValuesInit = {
		ID: null,
		TeacherID: null,
		Note: ''
	};

	(function returnSchemaFunc() {
		returnSchema = { ...defaultValuesInit };
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'Email':
					returnSchema[key] = yup.string().email('Email nhập sai cú pháp').required('Bạn không được để trống');
					break;
				case 'Mobile':
					returnSchema[key] = yup.mixed().required('Bạn không được để trống');
					break;

				case 'Branch':
					returnSchema[key] = yup.array().required('Bạn không được để trống');

				default:
					// returnSchema[key] = yup.mixed().required("Bạn không được để trống");
					break;
			}
		});

		schema = yup.object().shape(returnSchema);
	})();

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	const onSubmit = async (dataSubmit: any) => {
		setIsLoading(true);
		try {
			let res = await courseExamApi.update(dataSubmit);
			if (res.status == 200) {
				showNoti('success', 'Cập nhật thành công');
				setIsModalVisible(false);
				onFetchData && onFetchData();
			} else {
				showNoti('danger', 'Mạng không ổn định');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isModalVisible) {
			if (dataRow) {
				form.setValue('ID', dataRow.ID);
				form.setValue('TeacherID', dataRow.TeacherID);
				form.setValue('Note', dataRow.Note);
			}
		}
	}, [isModalVisible]);

	return (
		<>
			<Tooltip title="Cập nhật">
				<button className="btn btn-icon edit" onClick={showModal}>
					<UndoOutlined />
				</button>
			</Tooltip>
			<Modal
				footer={
					<div className="wp-100 text-center">
						<button type="button" className="btn btn-primary w-100" onClick={form.handleSubmit(onSubmit)}>
							Cập nhật
							{isLoading && <Spin className="loading-base" />}
						</button>
					</div>
				}
				title="Cập nhật"
				visible={isModalVisible}
				onCancel={handleCancel}
			>
				<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
					<SelectField form={form} name="TeacherID" label="Giáo viên" optionList={dataTeacher} placeholder="Chọn giáo viên" />
					<TextAreaField name="Note" label="Ghi chú" form={form} placeholder="Nhập ghi chú" />
				</Form>
			</Modal>
		</>
	);
};

export default CourseExamUpdate;
