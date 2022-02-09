import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { discountApi } from '~/apiBase';
import PowerTable from '~/components/PowerTable';
import { useWrap } from '~/context/wrap';
import { numberWithCommas } from '~/utils/functions';

const InfoDiscountCard = (props) => {
	const { studentID } = props;
	const [dataSource, setDataSource] = useState(null);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const { showNoti, pageSize } = useWrap();
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: 1,
		StudentID: studentID
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await discountApi.getAllNew(todoApi);
			console.log(res.data.data);
			res.status == 200 && (setDataSource(res.data.data), setTotalPage(res.data.totalRow));

			res.status == 204 && setDataSource([]);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);

		setTodoApi({
			...todoApi,
			// ...listFieldSearch,
			pageIndex: pageNumber
		});
	};

	const columns = [
		{
			title: 'Mã Khuyễn mãi',
			dataIndex: 'DiscountCode',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Khóa học',
			dataIndex: 'Name',
			render: (text, data) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Đã giảm',
			dataIndex: 'Reduced',
			render: (text, data) => <p className="font-weight-black">{numberWithCommas(text)}</p>
		},
		{
			title: 'Loại',
			dataIndex: 'Type',
			render: (type) => <p className="font-weight-black">{type}</p>
		},
		{
			title: 'Ngày khuyến mãi',
			dataIndex: 'DiscountDate',
			render: (type) => <p className="font-weight-black">{moment(type).format('DD/MM/YYYY')}</p>
		}
	];

	// ============== USE EFFECT - FETCH DATA ===================
	useEffect(() => {
		getDataSource();
	}, [todoApi]);

	return (
		<>
			<PowerTable
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				addClass="basic-header"
				TitlePage="Danh sách chương trình"
				dataSource={dataSource}
				columns={columns}
			/>
		</>
	);
};

export default InfoDiscountCard;
