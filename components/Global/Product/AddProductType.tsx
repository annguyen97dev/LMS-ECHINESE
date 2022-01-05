import React, { useState, useEffect } from 'react';
import { Tooltip, Modal, Form, Input, Spin } from 'antd';
import { RotateCcw } from 'react-feather';
import { productTypeApi } from '~/apiBase/product/product-type';
import { useWrap } from '~/context/wrap';

const AddProductTypeForm = ({ mode, onFetchData, data }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({ type: '', status: false });
	const [form] = Form.useForm();
	const { showNoti } = useWrap();

	const addProductType = async (data) => {
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await productTypeApi.insert(data);
			if (res.status == 200) {
				showNoti('success', 'Thành công!');
				onFetchData && onFetchData();
				form.resetFields();
				setIsVisible(false);
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false });
		}
	};

	const updateProductType = async (data) => {
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await productTypeApi.update(data);
			if (res.status == 200) {
				showNoti('success', 'Thành công!');
				onFetchData && onFetchData();
				form.resetFields();
				setIsVisible(false);
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false });
		}
	};

	const _onSubmit = (value) => {
		let fetchAdd = {
			Name: value.Name
		};
		let fetchEdit = {
			Name: value.Name,
			ID: data?.ID,
			Enable: true
		};

		mode == 'add-type' && addProductType(fetchAdd);
		mode == 'edit-type' && updateProductType(fetchEdit);
	};
	return (
		<>
			{mode == 'add-type' && (
				<button
					className="btn btn-warning add-new"
					onClick={() => {
						setIsVisible(true);
					}}
				>
					Thêm mới
				</button>
			)}
			{mode == 'edit-type' && (
				<button
					className="btn btn-icon edit"
					onClick={() => {
						setIsVisible(true);
						form.resetFields();
					}}
				>
					<Tooltip title="Cập nhật">
						<RotateCcw />
					</Tooltip>
				</button>
			)}
			<Modal
				title={mode == 'edit-type' ? 'Thay đổi thông tin' : 'Thêm loại sản phẩm'}
				visible={isVisible}
				onCancel={() => {
					form.resetFields();
					setIsVisible(false);
				}}
				footer={false}
			>
				<div className="container-fluit">
					<Form form={form} layout="vertical" onFinish={_onSubmit}>
						<div className="row">
							<div className="col-12">
								<Form.Item
									label="Tên loại sản phẩm"
									name="Name"
									rules={[{ required: true, message: 'Bạn không được để trống' }]}
									initialValue={mode === 'edit-type' ? data.Name : ''}
								>
									<Input placeholder="Thêm tên" className="style-input" />
								</Form.Item>
							</div>
							<div className="col-12 mt-3">
								<button type="submit" className="btn btn-primary w-100">
									Lưu
									{isLoading.type == 'GET_ALL' && isLoading.status && <Spin className="loading-base" />}
								</button>
							</div>
						</div>
					</Form>
				</div>
			</Modal>
		</>
	);
};

export default AddProductTypeForm;
