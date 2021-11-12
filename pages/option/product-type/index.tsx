import React, { useState, useEffect } from 'react';
import { productTypeApi } from '~/apiBase/product/product-type';
import AddProductTypeForm from '~/components/Global/Product/AddProductType';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';
import moment from 'moment';
import DeleteTableRow from '~/components/Elements/DeleteTableRow/DeleteTableRow';

const ProductType = () => {
	const [dataSource, setDataSource] = useState<IProductType[]>([]);
	const { showNoti, pageSize } = useWrap();
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState({ type: '', status: false });

	const paramsDefault = {
		pageIndex: 1,
		pageSize: pageSize
	};

	const [params, setParams] = useState(paramsDefault);

	const columns = [
		{
			title: 'Tên loại',
			dataIndex: 'Name',
			// width: 30,
			render: (text) => <p className="font-weight-blue">{text}</p>
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			// width: 30,
			render: (text) => <p className="font-weight-black">{moment(text).format('DD/MM/YYYY')}</p>
		},
		{
			title: 'Tạo bởi',
			dataIndex: 'CreatedBy',
			// width: 30,
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Thao tác',
			dataIndex: 'Action',
			// width: 30,
			render: (text, data, index) => {
				return (
					<>
						<AddProductTypeForm
							mode="edit-type"
							onFetchData={() => {
								getPagination(1);
								setParams({ ...params, pageIndex: 1 });
								getDataSource();
							}}
							data={data}
						/>
						<DeleteTableRow handleDelete={() => updateDataDelete(data)} text="loại sản phẩm này" />
					</>
				);
			}
		}
	];

	const updateDataDelete = async (data) => {
		console.log(data);
		let fetchDelete = {
			ID: data.ID,
			Name: data.Name,
			Enable: false
		};
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await productTypeApi.update(fetchDelete);
			if (res.status == 200) {
				showNoti('success', 'Thành công!');
				getDataSource();
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false });
		}
	};

	const getDataSource = async () => {
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await productTypeApi.getAll(params);
			if (res.status == 200) {
				setDataSource(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status == 204) {
				setDataSource([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false });
		}
	};

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setParams({
			...params,
			pageIndex: pageNumber
		});
	};

	useEffect(() => {
		getDataSource();
	}, []);

	return (
		<PowerTable
			currentPage={params.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			loading={isLoading}
			columns={columns}
			dataSource={dataSource}
			addClass="basic-header"
			TitlePage="Product Type"
			TitleCard={
				<AddProductTypeForm
					mode="add-type"
					onFetchData={() => {
						getPagination(1);
						setParams({ ...params, pageIndex: 1 });
						getDataSource();
					}}
					data={null}
				/>
			}
		/>
	);
};

ProductType.layout = LayoutBase;
export default ProductType;
