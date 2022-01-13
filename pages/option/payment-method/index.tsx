import { Switch } from 'antd';
import React, { useState, useEffect } from 'react';
import { paymentConfig } from '~/apiBase/shopping-cart/payment-config';
import AddPaymentMethodForm from '~/components/Global/Option/shopping-cart/AddPaymentMethodForm';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';

const PaymentMethodConfig = () => {
	const [dataSource, setDataSource] = useState<IPaymentMethod[]>();
	const [paymentMethod, setPaymentMethod] = useState<IPaymentMethodConfig[]>();
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const { showNoti } = useWrap();
	const [isLoading, setIsLoading] = useState({ type: '', status: false });

	const columns = [
		{
			title: 'Phương thức thanh toán',
			dataIndex: 'PaymentName',
			width: 200,
			render: (text) => {
				return <p className="font-weight-black">{text}</p>;
			}
		},
		{
			title: 'Mã phương thức',
			dataIndex: 'PaymentCode',
			width: 200,
			render: (text) => {
				return <p className="font-weight-black">{text}</p>;
			}
		},
		{
			title: 'Logo',
			dataIndex: 'PaymentLogo',
			width: 80,
			render: (text, data) => {
				return <img style={{ width: 40, height: 40 }} src={data.PaymentLogo} />;
			}
		},
		{
			title: 'Trạng thái',
			dataIndex: 'Enable',
			width: 100,
			render: (text, data) => {
				return (
					<Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" checked={data.Enable} onClick={() => handleChangeEnable(data)} />
				);
			}
		},
		{
			title: '',
			dataIndex: 'Action',
			width: 70,
			render: (text, data) => {
				return (
					<>
						<AddPaymentMethodForm
							paymentMethod={paymentMethod}
							dataPayment={data}
							fetchData={() => {
								getPaymentMethod(), getPaymentMethods();
							}}
							type="edit"
						/>
					</>
				);
			}
		}
	];

	const handleChangeEnable = async (data) => {
		setIsLoading({ type: 'ENABLE', status: true });
		try {
			let res = await paymentConfig.update({ ID: data.ID, Enable: data.Enable ? false : true });
			if (res.status === 200) {
				showNoti('success', res.data.message);
				getPaymentMethods();
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'ENABLE', status: false });
		}
	};

	const getPaymentMethod = async () => {
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await paymentConfig.getPaymentConfig();
			if (res.status == 200) {
				setPaymentMethod(res.data.data);
				console.log('config', res.data.data);
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false });
		}
	};

	const getPaymentMethods = async () => {
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await paymentConfig.getAll();
			if (res.status == 200) {
				setDataSource(res.data.data);
				setTotalPage(res.data.data.length);
				console.log('payment methods', res.data.data);
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false });
		}
	};

	// PAGINATION
	const getPagination = (pageNumber: number, pageSize: number) => {
		if (!pageSize) pageSize = 10;
		setCurrentPage(pageNumber);
	};

	useEffect(() => {
		getPaymentMethod();
		getPaymentMethods();
	}, []);

	return (
		<>
			<PowerTable
				loading={isLoading}
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={getPagination}
				dataSource={dataSource}
				columns={columns}
				TitlePage="Cấu hình phương thức thanh toán"
				TitleCard={
					<AddPaymentMethodForm
						paymentMethod={paymentMethod}
						type="add"
						fetchData={() => {
							getPaymentMethod(), getPaymentMethods();
						}}
					/>
				}
			></PowerTable>
		</>
	);
};

PaymentMethodConfig.layout = LayoutBase;
export default PaymentMethodConfig;
