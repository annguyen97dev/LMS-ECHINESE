import {Form, Modal, Select, Spin, Tooltip} from 'antd';
import React, {useEffect, useState} from 'react';
import {DollarSign} from 'react-feather';
import {useForm} from 'react-hook-form';
import {useWrap} from '~/context/wrap';

const RefundForm = (props) => {
	const {Option} = Select;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [form] = Form.useForm();
	const {showNoti} = useWrap();

	const {
		register,
		handleSubmit,
		setValue,
		formState: {isSubmitting, errors, isSubmitted},
	} = useForm();

	const onSubmit = handleSubmit((data: any) => {
		console.log('Data submit', data);
		if (Object.keys(data).length === 1) {
			showNoti('danger', 'Bạn chưa chỉnh sửa');
		} else {
			let res = props._onSubmit(data);
			res.then(function (rs: any) {
				rs && rs.status === 200 && setIsModalVisible(false);
			});
		}
	});
	useEffect(() => {
		console.log(props.rowData?.StatusName);
		if (isModalVisible) {
			if (props.rowData) {
				setValue('ID', props.rowData.ID);
			}
		}
	}, [isModalVisible]);

	return (
		<>
			<Tooltip title="Cập nhật">
				<button
					className="btn btn-icon"
					onClick={() => {
						setIsModalVisible(true);
					}}
				>
					<DollarSign />
				</button>
			</Tooltip>

			<Modal
				title="Cập nhật trạng thái yêu cầu hoàn tiền"
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				footer={null}
			>
				<div className="wrap-form">
					<Form form={form} layout="vertical" onFinish={onSubmit}>
						<div className="row">
							<div className="col-md-12 col-12">
								<Form.Item
									label="Trạng thái"
									name="Trạng thái"
									initialValue={props.rowData?.StatusName}
								>
									<Select
										className="w-100 style-input"
										onChange={(value) => setValue('StatusID', value)}
									>
										<Option value="1">Chờ duyệt</Option>
										<Option value="2">Đã duyệt</Option>
										<Option value="3">Không duyệt</Option>
									</Select>
								</Form.Item>
							</div>
							<div className="col-12 mt-3">
								<button
									type="submit"
									className="btn btn-primary w-100"
									disabled={
										props.isLoading.type === 'ADD_DATA' &&
										props.isLoading.status
									}
								>
									Lưu
									{props.isLoading.type == 'ADD_DATA' &&
										props.isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};

export default RefundForm;
