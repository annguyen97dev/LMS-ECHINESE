import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useWrap } from '~/context/wrap';
import { payFixExamApi } from '~/apiBase';
import { FormOutlined } from '@ant-design/icons';
import { Form, Modal, Spin, Tooltip } from 'antd';
import InputTextField from '~/components/FormControl/InputTextField';
import InputMoneyField from '~/components/FormControl/InputMoneyField';
import { RotateCcw } from 'react-feather';
import { numberWithCommas } from '~/utils/functions';
import SelectField from '~/components/FormControl/SelectField';
import TextAreaField from '~/components/FormControl/TextAreaField';
import InputNumberField from '~/components/FormControl/InputNumberField';

const PayFixExamForm = (props) => {
	const { dataStudent, dataRow, onFetchData, onUpdateData, dataLevel, isBuy, userID } = props;
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { showNoti } = useWrap();
	const [activePrice, setActivePrice] = useState<number>(null);

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
		StudentID: null,
		PriceFixExam: null,
		Amount: 1,
		Paid: null,
		PaymentMethodsID: null, //1-Tiền mặt 2-Chuyển khoản
		Note: null
	};
	const schema = yup.object().shape({
		PriceFixExam: yup.mixed().required('Vui lòng chọn thông tin'),
		StudentID: yup.mixed().required('Vui lòng chọn thông tin'),
		Amount: yup.mixed().required('Vui lòng nhập thông tin'),
		Paid: yup.mixed().required('Vui lòng nhập thông tin'),
		PaymentMethodsID: yup.mixed().required('Vui lòng nhập thông tin')
	});

	const form = useForm({
		defaultValues: defaultValuesInit,
		resolver: yupResolver(schema)
	});

	const onChange_SelectLevel = (value) => {
		let priceLevel = dataLevel.find((item) => item.value === value).price;
		setActivePrice(priceLevel);
		form.setValue('Amount', 1);
		form.setValue('Paid', numberWithCommas(priceLevel));
	};

	const onChange_ChangeAmount = (amount) => {
		if (activePrice) {
			if (amount > 0) {
				let totalPrice = amount * activePrice;
				totalPrice = numberWithCommas(totalPrice);
				form.setValue('Paid', totalPrice);
			}
		}
	};

	const onSubmit = async (dataSubmit) => {
		dataSubmit.Paid = parseInt(dataSubmit.Paid.replace(/\,/g, ''));
		console.log('Data Submit: ', dataSubmit);
		setIsLoading(true);

		let res = null;

		try {
			res = await payFixExamApi.add(dataSubmit);

			if (res.status === 200) {
				onFetchData && onFetchData();
				setIsModalVisible(false);
				form.reset(defaultValuesInit);
				showNoti('success', !isBuy ? 'Thêm mới thành công' : 'Mua lượt chấm thành công');
				('');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading(false);
		}
	};

	// useEffect(() => {
	// 	if (isModalVisible) {
	// 		if (userID) {
	// 			form.setValue('StudentID', userID);
	// 		}
	// 	}
	// }, [isModalVisible]);
	useEffect(() => {
		userID && form.setValue('StudentID', userID);
	}, [userID]);

	return (
		<>
			{isBuy ? (
				<button className="btn btn-warning" onClick={showModal}>
					Mua lượt chấm bài
				</button>
			) : (
				<button className="btn btn-warning" onClick={showModal}>
					Thêm mới
				</button>
			)}
			<Modal title="Mua lượt chấm" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
				<Form layout="vertical" onFinish={form.handleSubmit(onSubmit)}>
					<div className="container-fluid">
						<div className="row">
							<div className="col-12">
								<SelectField
									disabled={isBuy ? true : false}
									isRequired={true}
									form={form}
									name="StudentID"
									label="Học viên"
									optionList={dataStudent}
								/>
							</div>
							<div className="col-12">
								<SelectField
									onChangeSelect={(value) => onChange_SelectLevel(value)}
									isRequired={true}
									form={form}
									name="PriceFixExam"
									label="Level"
									optionList={dataLevel}
								/>
							</div>
							<div className="col-12">
								<InputNumberField
									handleChange={(value) => onChange_ChangeAmount(value)}
									isRequired={true}
									form={form}
									name="Amount"
									label="Số lượt chấm"
								/>
							</div>
							<div className="col-12">
								<InputMoneyField isRequired={true} form={form} name="Paid" label="Giá" disabled={true} />
							</div>
							<div className="col-12">
								<SelectField
									isRequired={true}
									form={form}
									name="PaymentMethodsID"
									label="Phương thức thanh toán"
									optionList={[
										{
											title: 'Tiền mặt',
											value: 1
										},
										{
											title: 'Chuyển khoản',
											value: 2
										}
									]}
								/>
							</div>
							<div className="col-12">
								<TextAreaField form={form} name="Note" label="Ghi chú" />
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

export default PayFixExamForm;
