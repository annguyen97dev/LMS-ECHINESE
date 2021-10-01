import React, {useEffect, useRef, useState} from 'react';
import {saleCampaignApi, saleSalaryApi, staffApi} from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import {useWrap} from '~/context/wrap';
import {fmSelectArr, numberWithCommas} from '~/utils/functions';

type IOptionListFilter = {
	optionSaleCampaignList: IOptionCommon[];
	optionCounselorList: IOptionCommon[];
};
function SalesSalaryHistory(props) {
	const [saleSalaryList, setSaleSalaryList] = useState<ISaleSalary[]>([]);
	const {showNoti} = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const [optionListForFilter, setOptionListForFilter] =
		useState<IOptionListFilter>({
			optionSaleCampaignList: [],
			optionCounselorList: [],
		});
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
	const sortOptionList = [
		{
			dataSort: {
				sort: 0,
				sortType: true,
			},
			value: 1,
			text: 'Lương tăng dần',
		},
		{
			dataSort: {
				sort: 0,
				sortType: false,
			},
			value: 2,
			text: 'Lương giảm dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: true,
			},
			value: 3,
			text: 'Thưởng tăng dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: false,
			},
			value: 4,
			text: 'Thưởng giảm dần',
		},
		{
			dataSort: {
				sort: 2,
				sortType: true,
			},
			value: 5,
			text: 'Tổng lương tăng dần',
		},
		{
			dataSort: {
				sort: 2,
				sortType: false,
			},
			value: 6,
			text: 'Tổng lương giảm dần',
		},
	];
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,

		CounselorsID: null,
		SaleCampaignID: null,
		DonePaid: true,
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,
	});
	const [filters, setFilters] = useState(listFieldInit);

	// FILTER
	const onFilter = (obj) => {
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			...obj,
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
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			[dataIndex]: valueSearch,
		});
	};

	// GET DATA TABLE
	const fetchSaleCampaignList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true,
			});
			const res = await saleSalaryApi.getAll(filters);
			if (res.status === 200) {
				setSaleSalaryList(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status === 204) {
				setSaleSalaryList([]);
				setTotalPage(0);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};
	useEffect(() => {
		fetchSaleCampaignList();
	}, [filters]);

	const fetchDataForFilter = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true,
			});
			const [counselorRes, saleCampaignRes] = await Promise.all([
				staffApi.getAll({selectAll: true, RoleID: 6}),
				saleCampaignApi.getAll({selectAll: true}),
			]);
			const rs: IOptionListFilter = {
				optionSaleCampaignList: [],
				optionCounselorList: [],
			};
			if (counselorRes.status === 200) {
				rs.optionCounselorList = fmSelectArr(
					counselorRes.data.data,
					'FullNameUnicode',
					'UserInformationID'
				);
			}
			if (saleCampaignRes.status === 200) {
				rs.optionSaleCampaignList = fmSelectArr(
					saleCampaignRes.data.data,
					'Name',
					'ID'
				);
			}
			setOptionListForFilter(rs);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};
	useEffect(() => {
		fetchDataForFilter();
	}, []);

	const columns = [
		{
			title: 'Tư vấn viên',
			dataIndex: 'CounselorsName',
			...FilterColumn(
				'CounselorsID',
				onSearch,
				onResetSearch,
				'select',
				optionListForFilter.optionCounselorList
			),
			render: (text) => <p className="font-weight-black">{text}</p>,
			className:
				activeColumnSearch === 'CounselorsID' ? 'active-column-search' : '',
		},
		{
			title: 'Chiến dịch',
			dataIndex: 'SaleCampaignName',
			...FilterColumn(
				'SaleCampaignID',
				onSearch,
				onResetSearch,
				'select',
				optionListForFilter.optionSaleCampaignList
			),
			className:
				activeColumnSearch === 'SaleCampaignID' ? 'active-column-search' : '',
		},
		{
			title: 'Lương chiến dịch',
			dataIndex: 'Salary',
			render: (price) => (
				<p className="font-weight-black">{numberWithCommas(price)}</p>
			),
		},
		{
			title: 'Thưởng',
			dataIndex: 'Bonus',
			render: (price) => (
				<p className="font-weight-black">{numberWithCommas(price)}</p>
			),
		},
		{
			title: 'Tổng lương',
			dataIndex: 'TotalSalary',
			render: (price) => (
				<p className="font-weight-black">{numberWithCommas(price)}</p>
			),
		},
		{
			title: 'Ghi chú',
			dataIndex: 'Note',
		},
	];
	return (
		<PowerTable
			loading={isLoading}
			currentPage={filters.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			addClass="basic-header"
			TitlePage="Danh sách phiếu chi"
			dataSource={saleSalaryList}
			columns={columns}
			Extra={
				<div className="extra-table">
					<SortBox handleSort={onSort} dataOption={sortOptionList} />
				</div>
			}
		/>
	);
}

export default SalesSalaryHistory;
