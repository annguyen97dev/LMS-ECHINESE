import {Input} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {saleCampaignApi, saleSalaryApi, staffApi} from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import {useWrap} from '~/context/wrap';
import {
	fmSelectArr,
	numberWithCommas,
	parsePriceStrToNumber,
} from '~/utils/functions';

type IOptionListFilter = {
	optionSaleCampaignList: IOptionCommon[];
	optionCounselorList: IOptionCommon[];
};
function SalesSalary(props) {
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
				sort: 2,
				sortType: true,
			},
			value: 3,
			text: 'Tổng lương tăng dần',
		},
		{
			dataSort: {
				sort: 2,
				sortType: false,
			},
			value: 4,
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
		DonePaid: false,
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,
	});
	const [filters, setFilters] = useState(listFieldInit);

	// PAGINATION
	const getPagination = (pageIndex: number) => {
		refValue.current = {
			...refValue.current,
			pageIndex,
		};
		setFilters({
			...filters,
			pageIndex,
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

	const onChangeBonus = async (key: string, vl: string, idx: number) => {
		try {
			const newSaleSalaryList = [...saleSalaryList];
			const newSaleSalary: ISaleSalary =
				key === 'Bonus'
					? {
							...newSaleSalaryList[idx],
							Bonus: parsePriceStrToNumber(vl),
							TotalSalary:
								newSaleSalaryList[idx].Salary + parsePriceStrToNumber(vl),
					  }
					: {
							...newSaleSalaryList[idx],
							Note: vl,
					  };
			newSaleSalaryList.splice(idx, 1, newSaleSalary);
			setSaleSalaryList(newSaleSalaryList);
		} catch (error) {
			console.log('onChangeBonus', error.message);
		}
	};

	const onUpdateSaleSalary = (idx: number) => {
		return async () => {
			try {
				setIsLoading({
					type: 'GET_ALL',
					status: true,
				});
				const newSaleSalaryList = [...saleSalaryList];

				const {ID, Bonus, Note} = newSaleSalaryList[idx];

				const newSaleSalary: {
					ID: number;
					Bonus: number;
					DonePaid: boolean;
					Note: string;
				} = {
					ID,
					Bonus,
					Note,
					DonePaid: true,
				};

				const res = await saleSalaryApi.update(newSaleSalary);
				if (res.status === 200) {
					newSaleSalaryList.splice(idx, 1);
					setSaleSalaryList(newSaleSalaryList);
					showNoti('success', res.data.message);
				}
			} catch (error) {
				showNoti('danger', error.message);
				console.log('onUpdateSaleSalary', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false,
				});
			}
		};
	};

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
			render: (price) => numberWithCommas(price),
		},
		{
			title: 'Thưởng',
			dataIndex: 'Bonus',
			render: (price, item: ISaleSalary, idx) => (
				<Input
					key={item.ID}
					value={price > 0 ? numberWithCommas(price) : ''}
					style={{width: 150}}
					placeholder="Nhập thưởng"
					className="style-input"
					allowClear={true}
					onChange={(e) => onChangeBonus('Bonus', e.target.value, idx)}
				/>
			),
		},
		{
			title: 'Tổng lương',
			dataIndex: 'TotalSalary',
			render: (price) => numberWithCommas(price),
		},
		{
			title: 'Ghi chú',
			dataIndex: 'Note',
			render: (price, item: ISaleSalary, idx) => (
				<Input
					key={item.ID}
					style={{width: 150}}
					placeholder="Nhập ghi chú"
					className="style-input"
					allowClear={true}
					onChange={(e) => onChangeBonus('Note', e.target.value, idx)}
				/>
			),
		},
		{
			width: 140,
			align: 'center',
			render: (record: ISaleSalary, _, idx) => (
				<div onClick={(e) => e.stopPropagation()}>
					<button
						className="btn btn-warning add-new"
						onClick={onUpdateSaleSalary(idx)}
					>
						Thanh toán
					</button>
				</div>
			),
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

export default SalesSalary;
