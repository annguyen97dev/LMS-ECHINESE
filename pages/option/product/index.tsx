import React, { useState, useEffect } from 'react';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import moment from 'moment';
import DeleteTableRow from '~/components/Elements/DeleteTableRow/DeleteTableRow';
import { useWrap } from './../../../context/wrap';

const Products = () => {
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

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setParams({
			...params,
			pageIndex: pageNumber
		});
	};

	const columns = [
		{
			title: 'Tên loại',
			dataIndex: 'Name',
			width: 130,
			render: (text) => <p className="font-weight-primary">{text}</p>
		},
		{
			title: 'ID',
			dataIndex: 'ID',
			width: 80,
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			width: 130,
			render: (text) => <p className="font-weight-black">{moment(text).format('DD/MM/YYYY')}</p>
		},
		{
			title: 'Tạo bởi',
			dataIndex: 'CreatedBy',
			width: 130,
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Thao tác',
			dataIndex: 'Action',
			width: 100,
			render: (text, data) => {
				return (
					<>
						<DeleteTableRow handleDelete={() => updateDataDelete(data)} text="loại sản phẩm này" />
					</>
				);
			}
		}
	];

	const updateDataDelete = (data) => {};

	return (
		<>
			<PowerTable
				currentPage={params.pageIndex}
				totalPage={totalPage}
				getPagination={getPagination}
				loading={isLoading}
				columns={columns}
				dataSource={dataSource}
				addClass="basic-header"
				TitlePage="Sản phẩm"
			/>
		</>
	);
};
