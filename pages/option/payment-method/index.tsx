import React, { useState, useEffect } from 'react';
import { paymentConfig } from '~/apiBase/shopping-cart/payment-config';
import AddPaymentMethodForm from '~/components/Global/Option/shopping-cart/AddPaymentMethodForm';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';

const PaymentMethodConfig = () => {
	const [dataSource, setDataSource] = useState<IPaymentMethod[]>([]);
	const [paymentMethod, setPaymentMethod] = useState<IPaymentMethodConfig[]>();
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
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
			title: '',
			dataIndex: 'Action',
			width: 200,
			render: (text) => {
				return (
					<>
						<AddPaymentMethodForm paymentMethod={paymentMethod} type="edit" />
						<AddPaymentMethodForm paymentMethod={paymentMethod} type="delete" />
					</>
				);
			}
		}
	];

	const getPaymentMethod = async () => {
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await paymentConfig.getPaymentConfig();
			if (res.status == 200) {
				setPaymentMethod(res.data.data);
				setTotalPage(res.data.totalRow);
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
				TitleCard={<AddPaymentMethodForm paymentMethod={paymentMethod} type="add" />}
			></PowerTable>
		</>
	);
};

PaymentMethodConfig.layout = LayoutBase;
export default PaymentMethodConfig;
