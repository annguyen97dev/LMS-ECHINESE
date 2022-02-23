import React, { FC, useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message, Spin, Select, Tooltip, Skeleton } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import { branchApi, areaApi, districtApi } from '~/apiBase';

import { useWrap } from '~/context/wrap';
import router from 'next/router';
import { RotateCcw } from 'react-feather';

const CurriculumDetailForm = React.memo((props: any) => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { Option } = Select;
	const [form] = Form.useForm();
	const { showNoti } = useWrap();
	const {
		reset,
		register,
		handleSubmit,
		control,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm();
	const { isLoading, rowID, _onSubmit, getIndex, index, rowData, dataSubject } = props;

	// SUBMI FORM
	const onSubmit = handleSubmit((data: any) => {
		let res = _onSubmit(data);

		res.then(function (rs: any) {
			rs && rs.status == 200 && (setIsModalVisible(false), form.resetFields());
		});
	});

	// FUNCTION SELECT
	const onChangeSelect = (name) => (value) => {};

	useEffect(() => {
		if (isModalVisible) {
			if (rowID) {
				getIndex();
				// Cập nhật giá trị khi show form update
				Object.keys(rowData).forEach(function (key) {
					setValue(key, rowData[key]);
				});
				form.setFieldsValue(rowData);
			}
		}
	}, [isModalVisible]);

	return (
		<>
			{rowID ? (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					<Tooltip title="Cập nhật">
						<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16 }}></i>
					</Tooltip>
				</button>
			) : (
				<button
					className="btn btn-warning add-new"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					Thêm mới
				</button>
			)}

			<Modal title="Tạo trung tâm" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
				<div className="container-fluid">
					<Form form={form} onFinish={onSubmit} layout="vertical">
						<div className="row">
							<div className="col-12">
								<Form.Item
									label="Chương trình"
									name="SubjectID"
									rules={[{ required: true, message: 'Bạn không được để trống' }]}
								>
									<Select
										disabled={true}
										style={{ width: '100%' }}
										className="style-input"
										showSearch
										optionFilterProp="children"
										onChange={onChangeSelect('SubjectID')}
									>
										{dataSubject?.map((item, index) => (
											<Option key={index} value={item.ID}>
												{item.SubjectName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</div>
						</div>

						<div className="row ">
							<div className="col-12 mt-3">
								<button type="submit" className="btn btn-primary w-100">
									Lưu
									{isLoading.type == 'ADD_DATA' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
});

export default CurriculumDetailForm;
