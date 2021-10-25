import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useWrap } from '~/context/wrap';
import { priceFixExamApi } from '~/apiBase';
import { FormOutlined } from '@ant-design/icons';
import { Form, Modal, Spin, Tooltip } from 'antd';
import InputTextField from '~/components/FormControl/InputTextField';
import InputMoneyField from '~/components/FormControl/InputMoneyField';
import { RotateCcw } from 'react-feather';
import { numberWithCommas } from '~/utils/functions';

const PriceFixExamForm = (props) => {
	const { dataTeacher, dataRow, onFetchData, onUpdateData } = props;
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
		SetPackageLevel: null,
		Price: null
	};
	const schema = yup.object().shape({
		SetPackageLevel: yup.mixed().required('Vui lòng nhập thông tin'),
		Price: yup.mixed().required('Vui lòng nhập thông tin')
	});

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	const onSubmit = async (dataSubmit) => {
		dataSubmit.Price = parseInt(dataSubmit.Price.replace(/\,/g, ''));
		dataSubmit.SetPackageLevel = parseInt(dataSubmit.SetPackageLevel);
		console.log('Data Submit: ', dataSubmit);
		setIsLoading(true);

		let res = null;

		try {
			if (dataRow) {
				res = await priceFixExamApi.update(dataSubmit);
			} else {
				res = await priceFixExamApi.add(dataSubmit);
			}

			if (res.status === 200) {
				!dataRow ? onFetchData() : onUpdateData(dataSubmit);
				setIsModalVisible(false);
				form.reset(defaultValuesInit);
				showNoti('success', dataRow ? 'Cập nhật thành công' : 'Thêm mới thành công');
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
				form.reset({
					...dataRow,
					Price: !dataRow.Price ? '' : numberWithCommas(dataRow.Price)
				});
			}
		}
	}, [isModalVisible]);

	return (
		<>
			{dataRow ? (
				<Tooltip title="Sửa giá">
					<button className="btn btn-icon edit mr-1" onClick={showModal}>
						<RotateCcw />
					</button>
				</Tooltip>
			) : (
				<button className="btn btn-warning" onClick={showModal}>
					Thêm mới
				</button>
			)}
			<Modal title="Thêm mới" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
				<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
					<div className="container-fluid">
						<div className="row">
							<div className="col-12">
								<InputTextField isRequired={true} form={form} name="SetPackageLevel" label="Level" />
							</div>
							<div className="col-12">
								<InputMoneyField isRequired={true} form={form} name="Price" label="Giá" />
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

export default PriceFixExamForm;
