import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { orderProductApi } from '~/apiBase/product/order-product';
import ExpandTable from '~/components/ExpandTable';
import ModalUpdatePaidStatus from '~/components/Global/Product/ModalUpdatePaidStatus';
import LayoutBase from '~/components/LayoutBase';
import { useWrap } from '~/context/wrap';
import NestedTable from '~/components/Elements/NestedTable';

const ProductPaid = (props) => {
	const [dataSource, setDataSource] = useState<IOrderProduct[]>([]);
	const { pageSize, userInformation } = useWrap();

	const [isLoading, setIsLoading] = useState({
		type: '',
		loading: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const paramsDefault = {
		pageIndex: 1,
		pageSize: pageSize
	};
	const [params, setParams] = useState(paramsDefault);

	const getDataSource = async () => {
		setIsLoading({ type: '', loading: true });
		try {
			let res = await orderProductApi.getAll(params);
			if (res.status === 200) {
				setDataSource(res.data.data);
				setTotalPage(res.data.totalRow);
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: '', loading: false });
		}
	};

	useEffect(() => {
		getDataSource();
	}, [params]);

	const columns =
		userInformation && (userInformation?.RoleID === 1 || userInformation?.RoleID === 5)
			? [
					{
						title: 'Tên học sinh',
						dataIndex: 'StudentName',
						width: 130,
						render: (text) => <p className="font-weight-primary">{text}</p>
					},
					{
						title: 'Trạng thái thanh toán',
						dataIndex: 'StatusName',
						width: 150,
						render: (text, data) => (
							<p
								className={`tag ${
									(data.StatusID === 0 && 'gray') ||
									(data.StatusID === 1 && 'yellow') ||
									(data.StatusID === 2 && 'green') ||
									(data.StatusID === 3 && 'blue') ||
									(data.StatusID === 4 && 'red')
								}`}
							>
								{text}
							</p>
						)
					},
					{
						title: 'Ngày mua',
						dataIndex: 'CreatedOn',
						width: 130,
						render: (text) => <p className="font-weight-black">{moment(text).format('DD/MM/YYYY')}</p>
					},
					{
						title: 'Phương thức thanh toán',
						dataIndex: 'PaymentMethodsName',
						width: 150,
						render: (text) => <p className="font-weight-black">{text}</p>
					},
					{
						title: '',
						dataIndex: 'Action',
						width: 100,
						render: (text, data) => {
							return (
								<>
									<ModalUpdatePaidStatus record={data} onFetching={() => setParams({ ...params })} />
								</>
							);
						}
					}
			  ]
			: [
					{
						title: 'Tên học sinh',
						dataIndex: 'StudentName',
						width: 130,
						render: (text) => <p className="font-weight-primary">{text}</p>
					},
					{
						title: 'Trạng thái thanh toán',
						dataIndex: 'StatusName',
						width: 150,
						render: (text, data) => (
							<p
								className={`tag ${
									(data.StatusID === 0 && 'gray') ||
									(data.StatusID === 1 && 'yellow') ||
									(data.StatusID === 2 && 'green') ||
									(data.StatusID === 3 && 'blue') ||
									(data.StatusID === 4 && 'red')
								}`}
							>
								{text}
							</p>
						)
					},
					{
						title: 'Ngày mua',
						dataIndex: 'CreatedOn',
						width: 130,
						render: (text) => <p className="font-weight-black">{moment(text).format('DD/MM/YYYY')}</p>
					},
					{
						title: 'Phương thức thanh toán',
						dataIndex: 'PaymentMethodsName',
						width: 150,
						render: (text) => <p className="font-weight-black">{text}</p>
					}
			  ];

	const nestedTable = [
		{
			title: 'Mã sản phẩm',
			dataIndex: 'ProductID',
			width: 100,
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Số lượng',
			dataIndex: 'Quantity',
			width: 100,
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Giá',
			dataIndex: 'Price',
			width: 100,
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'Ngày mua',
			dataIndex: 'CreatedOn',
			width: 130,
			render: (text) => <p className="font-weight-black">{moment(text).format('DD/MM/YYYY')}</p>
		}
	];

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setParams({
			...params,
			pageIndex: pageNumber
		});
	};

	const expandedRowRender = (record) => {
		return <NestedTable columns={nestedTable} dataSource={record.OrderProductDetail} loading={isLoading} />;
	};

	return (
		<>
			<ExpandTable
				currentPage={params.pageIndex}
				totalPage={totalPage}
				getPagination={getPagination}
				loading={isLoading}
				columns={columns}
				dataSource={dataSource}
				addClass="basic-header"
				TitlePage="Sản phẩm đã mua"
				expandable={{ expandedRowRender }}
			/>
		</>
	);
};

ProductPaid.layout = LayoutBase;
export default ProductPaid;
