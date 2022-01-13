import React, { useState, useEffect } from 'react';
import LayoutBase from '~/components/LayoutBase';
import { useWrap } from './../../context/wrap';
import { useRouter } from 'next/router';
import { Card, Input, List } from 'antd';
import { orderProductApi } from './../../apiBase/product/order-product';
import { productApi } from '~/apiBase/product/product';
import RenderItemCard from '~/components/VideoCourse/RenderItemCourseStudent';
import RenderProductItem from './../../components/Global/Product/RenderProductItem';
import FilterProduct from '~/components/Global/Option/FilterTable/FilterProduct';
import { productTypeApi } from '~/apiBase/product/product-type';

interface Props {}

const Stationery = (props: Props) => {
	const [isLoading, setIsLoading] = useState({ type: '', status: false });
	const [dataSource, setDataSource] = useState<IProduct[]>([]);
	const { showNoti, pageSize } = useWrap();
	const [totalPage, setTotalPage] = useState(null);
	const [productType, setProductType] = useState([]);
	const router = useRouter();
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: 1
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);
	const { Search } = Input;

	const sortList = [
		{
			dataSort: {
				sort: 0,
				sortType: false
			},
			value: 1,
			text: 'Tên giảm dần'
		},
		{
			dataSort: {
				sort: 0,
				sortType: true
			},
			value: 2,
			text: 'Tên tăng dần '
		},
		{
			dataSort: {
				sort: 1,
				sortType: false
			},
			value: 3,
			text: 'Số tiền giảm dần'
		},
		{
			dataSort: {
				sort: 1,
				sortType: true
			},
			value: 4,
			text: 'Số tiền tăng dần '
		}
	];

	const getDataSource = async () => {
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await productApi.getAll(todoApi);
			if (res.status === 200) {
				setDataSource(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status == 204) {
				setDataSource([]);
			}
		} catch (err) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false });
		}
	};

	const getProductType = async () => {
		try {
			let res = await productTypeApi.getAll(todoApi);
			if (res.status === 200) {
				let temp = [];
				res.data.data.map((item) => {
					//@ts-ignore
					temp.push({ name: item.Name, value: item.ID });
				});
				setProductType(temp);
			}
		} catch (err) {
		} finally {
		}
	};

	const getPagination = (pageNumber: number) => {
		setTodoApi({ ...todoApi, pageIndex: pageNumber });
	};

	useEffect(() => {
		getDataSource();
		getProductType();
	}, [todoApi]);

	const handleFilter = (data) => {
		setTodoApi({ ...data, pageIndex: 1, pageSize: pageSize });
	};

	const onReset = () => {
		setTodoApi({ ...listTodoApi });
	};

	// CARD EXTRA
	const Extra = () => {
		return (
			<div className="row m-0 vc-store_extra-table">
				<div className="row m-0">
					<div className="row m-0 st-fb-100w ">
						<div>
							<FilterProduct productType={productType} sortList={sortList} handleFilter={handleFilter} onReset={onReset} />
						</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			<Card style={{ width: '100%' }} loading={isLoading.status} title={<div className="m-2">{Extra()}</div>}>
				<List
					itemLayout="horizontal"
					dataSource={dataSource}
					grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 5 }}
					renderItem={(item) => <RenderProductItem product={item} />}
					pagination={{
						onChange: getPagination,
						total: totalPage,
						size: 'small',
						current: 1
					}}
				></List>
			</Card>
		</>
	);
};

Stationery.layout = LayoutBase;
export default Stationery;
