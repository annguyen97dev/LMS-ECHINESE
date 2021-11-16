import React, { FC, useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message, Spin, Select, Tooltip, Skeleton } from 'antd';
import { FormProvider, useForm } from 'react-hook-form';
import { branchApi, areaApi, districtApi } from '~/apiBase';

import { useWrap } from '~/context/wrap';
import router from 'next/router';
import { RotateCcw } from 'react-feather';

const CurriculumForm = React.memo((props: any) => {
	const programID = parseInt(router.query.slug as string);
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
	const { isLoading, rowID, _onSubmit, getIndex, index, rowData, dataProgram } = props;

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
			if (programID) {
				setValue('ProGramID', programID);

				form.setFieldsValue({
					...rowData,
					ProGramID: programID
				});
			}

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
						<RotateCcw />
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

			<Modal
				title={rowID ? 'Sửa giáo trình' : 'Tạo giáo trình'}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} onFinish={onSubmit} layout="vertical">
						<div className="row">
							<div className="col-12">
								<Form.Item
									label="Chương trình"
									name="ProGramID"
									rules={[{ required: true, message: 'Bạn không được để trống' }]}
								>
									<Select
										disabled={true}
										style={{ width: '100%' }}
										className="style-input"
										showSearch
										optionFilterProp="children"
										onChange={onChangeSelect('ProGramID')}
									>
										{dataProgram?.map((item, index) => (
											<Option key={index} value={item.ID}>
												{item.ProgramName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<Form.Item
									label="Tên giáo trình"
									name="CurriculumName"
									rules={[{ required: true, message: 'Bạn không được để trống' }]}
								>
									<Input
										placeholder=""
										className="style-input"
										onChange={(e) => setValue('CurriculumName', e.target.value)}
									/>
								</Form.Item>
							</div>
						</div>

						<div className="row">
							<div className="col-12">
								<Form.Item
									label="Số buổi học"
									name="Lesson"
									rules={[{ required: true, message: 'Bạn không được để trống' }]}
								>
									<Input
										type="number"
										placeholder=""
										className="style-input"
										onChange={(e) => setValue('Lesson', parseInt(e.target.value))}
									/>
								</Form.Item>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<Form.Item
									label="Thời gian buổi học"
									name="TimeOfLesson"
									rules={[{ required: true, message: 'Bạn không được để trống' }]}
								>
									<Input
										type="number"
										placeholder="số phút(VD: 120)"
										className="style-input"
										onChange={(e) => setValue('TimeOfLesson', parseInt(e.target.value))}
									/>
								</Form.Item>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<Form.Item label="Phần trăm xem video tối thiểu" name="MinViewPercent">
									<Input
										type="number"
										placeholder="Nhập số, VD: 30 (tương ứng 30%)"
										className="style-input"
										onChange={(e) => setValue('MinViewPercen', parseInt(e.target.value))}
									/>
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

export default CurriculumForm;
