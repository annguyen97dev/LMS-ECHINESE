import React, { useEffect, useState } from 'react';
import { Modal, Form, Spin } from 'antd';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import InputTextField from '~/components/FormControl/InputTextField';
import SelectField from '~/components/FormControl/SelectField';
import TextAreaField from '~/components/FormControl/TextAreaField';
import { studyRoleApi } from '~/apiBase';
import { useWrap } from '~/context/wrap';

let returnSchema = {};
let schema = null;

const AddStudyRole = (props) => {
	const { studentID, dataProgram, onFetchData } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { showNoti } = useWrap();

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
		StudentID: null,
		ProgramID: null,
		Note: null
	};

	(function returnSchemaFunc() {
		returnSchema = { ...defaultValuesInit };
		Object.keys(returnSchema).forEach(function (key) {
			switch (key) {
				case 'ProgramID':
					returnSchema[key] = yup.mixed().required('Bạn không được để trống');
					break;
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
			let res = await studyRoleApi.add(dataSubmit);
			if (res.status == 200) {
				setIsModalVisible(false);
				showNoti('success', 'Thêm lộ trình thành công');
				onFetchData && onFetchData();
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		form.setValue('StudentID', studentID);
	}, []);

	return (
		<>
			<button className="btn btn-warning" onClick={showModal}>
				Thêm mới
			</button>
			<Modal
				footer={
					<div className="row">
						<div className="col-12 d-flex justify-content-center">
							<button onClick={form.handleSubmit(onSubmit)} type="submit" className="btn btn-primary w-100">
								Lưu
								{isLoading && <Spin className="loading-base" />}
							</button>
						</div>
					</div>
				}
				title="Thêm lộ trình"
				visible={isModalVisible}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
					<div className="row">
						<div className="col-12">
							<SelectField
								form={form}
								name="ProgramID"
								label="Chương trình học"
								optionList={dataProgram}
								placeholder="chọn chương trình"
							/>
						</div>
						<div className="col-12">
							<TextAreaField form={form} name="Note" label="Ghi chú" />
						</div>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default AddStudyRole;
