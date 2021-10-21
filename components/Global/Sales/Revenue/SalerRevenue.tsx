import {Spin} from 'antd';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {salerRevenueApi, salerTotalRevenueApi, staffApi} from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import ExpandTable from '~/components/ExpandTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import {useWrap} from '~/context/wrap';
import {fmSelectArr, numberWithCommas} from '~/utils/functions';
import SalerRevenueChart from './Chart/SalerRevenueChart';
import SalerRevenueSearch from './Chart/SalerRevenueSearch';

function SalerRevenue(props) {
	const [salerTotalRevenueList, setSalerTotalRevenueList] = useState<
		ISalerTotalRevenue[]
	>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const {showNoti} = useWrap();
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
	const [salerList, setSalerList] = useState<IOptionCommon[]>([]);
	// SORT OPTION
	const sortOptionList = [
		{
			dataSort: {
				sort: 0,
				sortType: true,
			},
			value: 1,
			text: 'Doanh thu tăng dần',
		},
		{
			dataSort: {
				sort: 0,
				sortType: false,
			},
			value: 2,
			text: 'Doanh thu giảm dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: true,
			},
			value: 3,
			text: 'Tổng hóa đơn tăng dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: false,
			},
			value: 4,
			text: 'Tổng hóa đơn giảm dần',
		},
		{
			dataSort: {
				sort: 2,
				sortType: true,
			},
			value: 5,
			text: 'Tổng khách hàng tăng dần',
		},
		{
			dataSort: {
				sort: 2,
				sortType: false,
			},
			value: 6,
			text: 'Tổng khách hàng giảm dần',
		},
	];
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,

		CounselorsName: null,
		CounselorsID: null,
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,
	});
	const [filters, setFilters] = useState(listFieldInit);
	const [salerRevenue, setSalerRevenue] = useState<{
		id: number;
		data: ISalerRevenue[];
	}>({
		id: null,
		data: [],
	});
	// FILTER
	const onFilter = (obj) => {
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			...obj,
			fromDate: moment(obj.fromDate).format('YYYY/MM/DD'),
			toDate: moment(obj.toDate).format('YYYY/MM/DD'),
		});
	};
	// PAGINATION
	const getPagination = (pageIndex: number, pageSize: number) => {
		if (!pageSize) pageSize = 10;
		refValue.current = {
			...refValue.current,
			pageSize,
			pageIndex,
		};
		setFilters({
			...filters,
			...refValue.current,
		});
	};
	// SORT
	const onSort = (option) => {
		refValue.current = {
			...refValue.current,
			sort: option.title.sort,
			sortType: option.title.sortType,
		};
		setFilters({
			...listFieldInit,
			...refValue.current,
		});
	};
	// RESET SEARCH
	const onResetSearch = () => {
		setActiveColumnSearch('');
		setFilters({
			...listFieldInit,
			pageSize: refValue.current.pageSize,
		});
	};
	// ACTION SEARCH
	const onSearch = (valueSearch, dataIndex) => {
		setActiveColumnSearch(dataIndex);
		if (dataIndex === 'CreatedOn') {
			setFilters({
				...listFieldInit,
				...refValue.current,
				pageIndex: 1,
				...valueSearch,
			});
		} else {
			setFilters({
				...listFieldInit,
				...refValue.current,
				pageIndex: 1,
				[dataIndex]: valueSearch,
			});
		}
	};

	const fetchSalerTotalRevenueList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true,
			});
			const res = await salerTotalRevenueApi.getAll(filters);
			if (res.status === 200) {
				setSalerTotalRevenueList(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status === 204) {
				setSalerTotalRevenueList([]);
				setTotalPage(0);
			}
		} catch (error) {
			console.log('fetchSalerTotalRevenueList', error.message);
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};

	useEffect(() => {
		fetchSalerTotalRevenueList();
	}, [filters]);

	const fetchSalerList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true,
			});
			const res = await staffApi.getAll({
				selectAll: true,
				RoleID: 6,
			});

			if (res.status === 200) {
				const fmSelectOptionList = fmSelectArr(
					res.data.data,
					'FullNameUnicode',
					'UserInformationID'
				);
				setSalerList(fmSelectOptionList);
			}
		} catch (error) {
			console.log('fetchSalerList', error.message);
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};
	useEffect(() => {
		fetchSalerList();
	}, []);
	const fetchSalerRevenue = async (SalerID: number) => {
		try {
			setIsLoading({
				type: 'FETCH_SALER_REVENUE',
				status: true,
			});
			const res = await salerRevenueApi.getAll({
				selectAll: true,
				CounselorsID: SalerID,
			});

			if (res.status === 200) {
				setSalerRevenue({
					id: SalerID,
					data: res.data.data,
				});
			}
			if (res.status === 204) {
				setSalerRevenue({
					...salerRevenue,
					id: SalerID,
				});
			}
		} catch (error) {
			console.log('fetchTotalRevenueSaler', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_SALER_REVENUE',
				status: false,
			});
		}
	};
	const filterSalerRevenue = async (data: {
		fromDate: string;
		toDate: string;
	}) => {
		try {
			setIsLoading({
				type: 'FETCH_SALER_REVENUE',
				status: true,
			});
			const newData = {
				fromDate: moment(data.fromDate).format('YYYY/MM/DD'),
				toDate: moment(data.toDate).format('YYYY/MM/DD'),
			};
			const res = await salerRevenueApi.getAll({
				selectAll: true,
				CounselorsID: salerRevenue.id,
				...newData,
			});

			if (res.status === 200) {
				setSalerRevenue({
					...salerRevenue,
					data: res.data.data,
				});
			}
			if (res.status === 204) {
				showNoti('danger', 'Dữ liệu trống');
			}
		} catch (error) {
			console.log('fetchTotalRevenueSaler', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_SALER_REVENUE',
				status: false,
			});
		}
	};

	const columns = [
		{
			title: 'Tư vấn viên',
			dataIndex: 'CounselorsName',
			render: (text) => <p className="font-weight-black">{text}</p>,
			...FilterColumn(
				'CounselorsID',
				onSearch,
				onResetSearch,
				'select',
				salerList
			),
			className:
				activeColumnSearch === 'CounselorsID' ? 'active-column-search' : '',
		},
		{
			title: 'Tổng số hóa đơn',
			dataIndex: 'InvoiceNumber',
		},
		{
			title: 'Tổng số khách hàng',
			dataIndex: 'CustomersNumber',
		},
		{
			title: 'Doanh thu',
			dataIndex: 'Revenue',
			render: (price) => numberWithCommas(price),
		},
	];

	const expandableObj = {
		expandedRowRender: (record: ISalerRevenue) => (
			<Spin
				spinning={isLoading.type === 'FETCH_SALER_REVENUE' && isLoading.status}
			>
				<SalerRevenueSearch handleSubmit={filterSalerRevenue} />
				<SalerRevenueChart revenueList={salerRevenue.data} />
			</Spin>
		),
		onExpand: (expanded, record: ISalerRevenue) => {
			if (expanded && salerRevenue.id !== record.CounselorsID) {
				fetchSalerRevenue(record.CounselorsID);
			}
		},
	};
	return (
		<ExpandTable
			TitlePage="Doanh thu"
			loading={isLoading}
			totalPage={totalPage}
			currentPage={filters.pageIndex}
			getPagination={getPagination}
			noScroll
			Extra={
				<div className="extra-table">
					<SortBox handleSort={onSort} dataOption={sortOptionList} />
				</div>
			}
			dataSource={salerTotalRevenueList}
			columns={columns}
			expandable={expandableObj}
		/>
	);
}

export default SalerRevenue;
