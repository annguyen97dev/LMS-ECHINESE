import { Form, Modal, Spin, Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'react-feather';
import { orderProductApi } from '~/apiBase/product/order-product';
import { useWrap } from '~/context/wrap';
import SelectField from '~/components/FormControl/SelectField';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

const statusList = [
	{ value: 0, title: 'Chưa xác nhận' },
	{ value: 1, title: 'Đã xác nhận' },
	{ value: 2, title: 'Đã thanh toán' },
	{ value: 3, title: 'Đã nhận đơn hàng' },
	{ value: 4, title: 'Đã hủy đơn hàng' }
];

const ModalUpdatePaidStatus = (props) => {
	const { record, onFetching } = props;
	const [isVisible, setIsVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({ type: '', loading: false });
	const { showNoti } = useWrap();

	const handleUpdate = async (data) => {
		setIsLoading({ type: 'UPLOADING', loading: true });
		try {
			let res = await orderProductApi.update({ ID: record.ID, StatusID: data.StatusID, Enable: true });
			if (res.status == 200) {
				showNoti('success', 'Cập nhật thành công!');
				onFetching();
				setIsVisible(false);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({ type: 'UPLOADING', loading: false });
		}
	};

	const schema = yup.object().shape({
		StatusID: yup.number().required('Bạn không được để trống')
	});
	const defaultValuesInit = {
		StatusID: null
	};
	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	return (
		<>
			<button
				className="btn btn-icon edit"
				onClick={() => {
					setIsVisible(true);
				}}
			>
				<Tooltip title="Cập nhật trạng thái thanh toán">
					<i className="fas fa-edit" style={{ color: '#34c4a4', fontSize: 16 }}></i>
				</Tooltip>
			</button>

			<Modal
				visible={isVisible}
				footer={null}
				title="Cập nhật trạng thái mua hàng"
				onCancel={() => {
					setIsVisible(false);
				}}
			>
				<Form onFinish={form.handleSubmit(handleUpdate)} layout="vertical">
					<div className="row">
						<div className="col-12 mb-3">
							<SelectField
								form={form}
								label="Trạng thái"
								name="StatusID"
								placeholder="Chọn trạng thái"
								className="style-input"
								isRequired={true}
								optionList={statusList}
							/>
						</div>
						<div className="col-12">
							<button type="submit" className="btn btn-primary w-100">
								Lưu
								{isLoading.type == 'UPLOADING' && isLoading.loading && <Spin className="loading-base" />}
							</button>
						</div>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default ModalUpdatePaidStatus;
