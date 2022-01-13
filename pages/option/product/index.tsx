import React, { useState, useEffect } from 'react';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import { useWrap } from './../../../context/wrap';
import AddProductForm from '~/components/Global/Product/AddProductForm';
import { productApi } from '~/apiBase/product/product';
import { parsePriceStrToNumber } from '~/utils/functions';
import { productTypeApi } from '~/apiBase/product/product-type';
import { Switch } from 'antd';
import ModalShowImage from '~/components/Global/Product/ModalShoeImage';
import { numberWithCommas } from '~/utils/functions';
import ModalAddImage from '~/components/Global/Product/ModalAddImage';
import DeleteTableRow from '~/components/Elements/DeleteTableRow/DeleteTableRow';

const Products = () => {
	const [dataSource, setDataSource] = useState<IProductType[]>([]);
	const { showNoti, pageSize } = useWrap();
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [productIDList, setProductIDList] = useState([]);
	const [isLoading, setIsLoading] = useState({ type: '', status: false });

	const paramsDefault = {
		pageIndex: 1,
		pageSize: pageSize
	};

	const [params, setParams] = useState(paramsDefault);

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setParams({
			...params,
			pageIndex: pageNumber
		});
	};

	const columns = [
		{
			title: 'Tên sản phẩm',
			dataIndex: 'Name',
			width: 180,
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Mã loại sản phẩm',
			dataIndex: 'ProductTypeID',
			width: 150,
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Giá niêm yết',
			dataIndex: 'ListedPrice',
			width: 130,
			render: (text) => <p className="font-weight-black">{numberWithCommas(text)}</p>
		},
		{
			title: 'Giá bán',
			dataIndex: 'Price',
			width: 130,
			render: (text) => <p className="font-weight-black">{numberWithCommas(text)}</p>
		},
		{
			title: 'Số lượng',
			dataIndex: 'Quantity',
			width: 80,
			render: (text) => <p className="font-weight-black">{numberWithCommas(text)}</p>
		},
		{
			title: 'Mô tả',
			dataIndex: 'Description',
			width: 200,
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Ảnh sản phẩm',
			dataIndex: 'ImageOfProducts',
			width: 150,
			render: (text, data) => (
				<>
					<ModalShowImage ImageList={data.ImageOfProducts} productID={data.ID} onFetchData={() => setParams({ ...params })} />
					<ModalAddImage ImageList={data.ImageOfProducts} productID={data.ID} onFetchData={() => setParams({ ...params })} />
				</>
			)
		},
		{
			title: 'Thao tác',
			dataIndex: 'Action',
			width: 100,
			render: (text, data) => {
				return (
					<>
						<AddProductForm
							Mode="edit-type"
							data={data}
							_onSubmit={_onSubmit}
							isLoading={isLoading}
							productIDList={productIDList}
							onFetchData={() => setParams({ ...params })}
						/>
						<DeleteTableRow handleDelete={() => handleChangeEnable(data)} text="sản phẩm này" title="Xóa sản phẩm" />
					</>
				);
			}
		}
	];

	const getDataSource = async () => {
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await productApi.getAll(params);
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

	const getProductID = async () => {
		setIsLoading({ type: 'GET_ALL', status: true });
		try {
			let res = await productTypeApi.getAll({
				pageIndex: 1,
				pageSize: pageSize
			});
			if (res.status == 200) {
				let tempArr = [];
				res.data.data.map((item) => {
					// @ts-ignore
					tempArr.push({ value: item.ID, title: item.Name });
				});
				setProductIDList(tempArr);
			}
			if (res.status == 204) {
				setProductIDList(null);
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'GET_ALL', status: false });
		}
	};

	const handleChangeEnable = async (data) => {
		try {
			let res = await productApi.update({ ID: data.ID, Enable: !data.Enable });
			if (res.status === 200) {
				setParams({ ...params });
				showNoti('success', data.Enable ? 'Đã xóa sản phẩm' : 'Đã hiện sản phẩm');
			}
		} catch (error) {
		} finally {
		}
	};

	const handleUploadImage = async (arrFile) => {
		setIsLoading({ type: 'UPLOADING', status: true });
		try {
			let nextPost = 0;
			const resArr = await Promise.all(
				arrFile.reduce((newArr, file, idx) => {
					if (file.originFileObj) {
						newArr.push(productApi.uploadImage(file.originFileObj));
					} else {
						nextPost = idx + 1;
						newArr;
					}
					return newArr;
				}, [])
			);
			const result = resArr.map((r: any) => {
				return {
					uid: r.data.data,
					url: r.data.data,
					Link: r.data.data,
					isAvatar: nextPost == 0 ? true : false
					// ...checkFileType(arrFile[nextPost])
				};
			});
			return result;
		} catch (error) {
			console.log('onUploadFile', error);
		} finally {
			setIsLoading({ type: 'UPLOADING', status: true });
		}
	};

	const _onSubmit = async (value, Mode, productID) => {
		setIsLoading({ type: 'SUBMIT', status: true });

		if (Mode === 'add-type') {
			try {
				let tempArr = [];
				value.ImageOfProducts.map((item) => {
					return tempArr.push({ Link: item.Link, isAvatar: item.isAvatar });
				});
				let res = await productApi.insert({
					...value,
					Price: parsePriceStrToNumber(value.Price),
					ListedPrice: parsePriceStrToNumber(value.ListedPrice),
					ImageOfProducts: tempArr
				});
				if (res.status === 200) {
					showNoti('success', 'Thêm sản phẩm thành công!');
					return true;
				}
			} catch (error) {
				showNoti('success', error.message);
			} finally {
				setIsLoading({ type: 'SUBMIT', status: false });
			}
		} else {
			try {
				let res = await productApi.update({
					...value,
					Price: parsePriceStrToNumber(value.Price),
					ListedPrice: parsePriceStrToNumber(value.ListedPrice),
					ImageOfProducts: null,
					ID: productID
				});
				if (res.status === 200) {
					showNoti('success', 'Thay đổi thành công!');
					return true;
				}
			} catch (error) {
				showNoti('success', error.message);
			} finally {
				setIsLoading({ type: 'SUBMIT', status: false });
			}
		}
	};

	useEffect(() => {
		getDataSource();
		getProductID();
	}, [params]);

	return (
		<>
			<PowerTable
				currentPage={currentPage}
				totalPage={totalPage}
				getPagination={getPagination}
				loading={isLoading}
				columns={columns}
				dataSource={dataSource}
				addClass="basic-header"
				TitleCard={
					<AddProductForm
						Mode="add-type"
						isLoading={isLoading}
						_onSubmit={_onSubmit}
						data={null}
						handleUploadFile={handleUploadImage}
						productIDList={productIDList}
						onFetchData={() => setParams({ ...params })}
					/>
				}
			/>
		</>
	);
};

Products.layout = LayoutBase;
export default Products;
