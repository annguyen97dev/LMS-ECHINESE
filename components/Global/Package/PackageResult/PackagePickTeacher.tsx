import { Form, Modal, Spin, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import SelectField from '~/components/FormControl/SelectField';
import { useWrap } from '~/context/wrap';
import { FormOutlined } from '@ant-design/icons';
import { packageResultApi } from '~/apiBase/package/package-result';

const PackagePickTeacher = (props) => {
	const { dataTeacher, dataRow, onFetchData } = props;
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

	const defaultValuesInit = {
		ID: null,
		TeacherID: null
	};
	const schema = yup.object().shape({
		TeacherID: yup.mixed().required('Vui lòng chọn giáo viên')
	});

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	const onSubmit = async (dataSubmit) => {
		console.log('Data Submit: ', dataSubmit);
		setIsLoading(true);

		try {
			let res = await packageResultApi.update(dataSubmit);
			if (res.status === 200) {
				onFetchData();
				setIsModalVisible(false);
				showNoti('succes', 'Chọn giáo viên thành công');
				('');
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
				dataRow.TeacherID !== 0 && form.setValue('TeacherID', dataRow.TeacherID);
			}
		}
	}, [isModalVisible]);

	return (
		<>
			<Tooltip title="Chọn giáo viên chấm bài">
				<button className="btn btn-icon edit mr-1" onClick={showModal}>
					<FormOutlined />
				</button>
			</Tooltip>
			<Modal title="Chọn giáo viên chấm bài" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
				<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
					<div className="container-fluid">
						<div className="row">
							<div className="col-12">
								<SelectField
									form={form}
									name="TeacherID"
									label="Chọn giáo viên"
									optionList={dataTeacher}
									placeholder="Giáo viên"
									// isLoading={loadingTeacher}
								/>
							</div>
							<div className="col-12">
								<button type="submit" className="btn btn-primary w-100">
									Lưu
									{isLoading && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default PackagePickTeacher;
