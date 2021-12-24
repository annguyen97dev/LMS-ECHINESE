import { Switch } from 'antd';
import React, { useState, useEffect } from 'react';
import { shoppingCartApi } from '~/apiBase/shopping-cart/shopping-cart';
import AddCurrencyForm from '~/components/Global/Option/shopping-cart/AddCurrencyForm';
import AddPaymentMethodForm from '~/components/Global/Option/shopping-cart/AddPaymentMethodForm';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import { numberWithCommas } from '~/utils/functions';
import { useWrap } from '~/context/wrap';

const CurrencyConfig = (props) => {
	const [currencys, setCurrencys] = useState<ICurrency[]>();
	const [isLoading, setIsLoading] = useState({ type: '', status: false });
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPage, setTotalPage] = useState(null);
	const { showNoti } = useWrap();

	const columns = [
		{
			title: 'ID',
			dataIndex: 'ID',
			width: 100,
			render: (text) => {
				return <p className="font-weight-black">{text}</p>;
			}
		},
		{
			title: 'Loại tiền tệ',
			dataIndex: 'CurrencyType',
			width: 200,
			render: (text) => {
				return <p className="font-weight-primary">{text}</p>;
			}
		},
		{
			title: 'Tỉ lệ chuyển đổi',
			dataIndex: 'ExchangeRate',
			width: 200,
			render: (text) => {
				return <p className="font-weight-black">{numberWithCommas(text)}</p>;
			}
		},
		{
			title: 'Trạng thái',
			dataIndex: 'Enable',
			width: 150,
			render: (text, data) => {
				return (
					<Switch checkedChildren="Hiện" unCheckedChildren="Ẩn" checked={data.Enable} onClick={() => handleChangeEnable(data)} />
				);
			}
		},
		{
			title: '',
			dataIndex: 'Action',
			width: 50,
			render: (text, data) => {
				return <AddCurrencyForm type="edit" onFetchData={getCurrencys} dataCurrency={data} />;
			}
		}
	];

	const handleChangeEnable = async (data) => {
		setIsLoading({ type: 'ENABLE', status: true });
		try {
			let res = await shoppingCartApi.updateCurrency({
				ID: data.ID,
				CurrencyType: data.CurrencyType,
				ExchangeRate: data.ExchangeRate,
				Enable: data.Enable ? false : true
			});
			if (res.status === 200) {
				showNoti('success', res.data.message);
				getCurrencys();
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'ENABLE', status: false });
		}
	};

	const getCurrencys = async () => {
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await shoppingCartApi.getAllCurrency();
			if (res.status === 200) {
				setCurrencys(res.data.data);
				setTotalPage(res.data.data.length);
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false });
		}
	};

	console.log(currencys);
	useEffect(() => {
		getCurrencys();
	}, []);

	// PAGINATION
	const getPagination = (pageNumber: number, pageSize: number) => {
		if (!pageSize) pageSize = 10;
		setCurrentPage(pageNumber);
	};

	return (
		<>
			<PowerTable
				columns={columns}
				dataSource={currencys}
				loading={isLoading}
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={getPagination}
				TitlePage="Cấu hình tiền tệ"
				TitleCard={
					<AddCurrencyForm
						type="add"
						onFetchData={() => {
							getCurrencys();
						}}
					/>
				}
			/>
		</>
	);
};
CurrencyConfig.layout = LayoutBase;
export default CurrencyConfig;
