import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Divider, Tooltip, Spin, Select } from 'antd';
import { useForm } from 'react-hook-form';
import { useWrap } from '~/context/wrap';
import { RotateCcw } from 'react-feather';
import { branchApi } from '~/apiBase';
import router from 'next/router';

const RoomForm = React.memo((props: any) => {
	const {
		reset,
		register,
		handleSubmit,
		control,
		setValue,
		formState: { isSubmitting, errors, isSubmitted }
	} = useForm();
	const branchID = parseInt(router.query.slug as string);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const { showNoti } = useWrap();
	const [form] = Form.useForm();
	const { Option } = Select;

	const [disableCenter, setDisableCenter] = useState(false);
	const { isLoading, _onSubmit, roomID, rowData, getIndex, dataCenter } = props;

	const [loadingSelect, setLoadingSelect] = useState(false);

	// HANDLE SUBMIT
	const onFinish = handleSubmit((data: any) => {
		let res = _onSubmit(data);
		res.then(function (rs: any) {
			console.log('result is: ', rs);
			rs && rs.status == 200 && (setIsModalVisible(false), form.resetFields());
		});
	});

	// ON CHANGE SELECT
	const onChangeSelect = (name) => (value) => {
		setValue(name, value);
	};

	useEffect(() => {
		if (isModalVisible) {
			if (branchID) {
				setValue('BranchID', branchID);
				setDisableCenter(true);
				form.setFieldsValue({
					...rowData,
					BranchID: branchID
				});
			}

			if (roomID) {
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
			{roomID ? (
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

			<Modal
				title={`${roomID ? 'Sửa' : 'Tạo'} phòng trong trung tâm`}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="container-fluid">
					<Form form={form} onFinish={onFinish} layout="vertical">
						<div className="row">
							<div className="col-12">
								<Form.Item
									name="BranchID"
									label="Trung tâm"
									rules={[{ required: true, message: 'Bạn không được để trống' }]}
								>
									<Select
										loading={loadingSelect}
										disabled={disableCenter}
										style={{ width: '100%' }}
										className="style-input"
										showSearch
										optionFilterProp="children"
										onChange={onChangeSelect('BranchID')}
										// defaultValue={branchID ? branchID : ""}
									>
										{dataCenter?.map((item, index) => (
											<Option key={index} value={item.ID}>
												{item.BranchName}
											</Option>
										))}
									</Select>
								</Form.Item>
							</div>
							<div className="col-12">
								<Form.Item
									name="RoomCode"
									label="Mã phòng"
									rules={[{ required: true, message: 'Bạn không được để trống' }]}
								>
									<Input
										placeholder=""
										className="style-input"
										onChange={(e) => setValue('RoomCode', e.target.value)}
										allowClear={true}
									/>
								</Form.Item>
							</div>
						</div>
						<div className="row">
							<div className="col-12">
								<Form.Item
									name="RoomName"
									label="Tên phòng"
									rules={[{ required: true, message: 'Bạn không được để trống' }]}
								>
									<Input
										placeholder=""
										className="style-input"
										onChange={(e) => setValue('RoomName', e.target.value)}
										allowClear={true}
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

export default RoomForm;
