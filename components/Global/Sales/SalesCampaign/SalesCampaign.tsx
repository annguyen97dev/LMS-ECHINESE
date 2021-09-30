import {Tooltip} from 'antd';
import moment from 'moment';
import Link from 'next/link';
import React, {useEffect, useRef, useState} from 'react';
import {Eye} from 'react-feather';
import {saleCampaignApi} from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import ExpandTable from '~/components/ExpandTable';
import {useWrap} from '~/context/wrap';
import {numberWithCommas, parsePriceStrToNumber} from '~/utils/functions';
import SalesCampaignFilter from './SalesCampaignFilter';
import SalesCampaignForm from './SalesCampaignForm';
const SalesCampaign = () => {
	const [saleCampaignList, setSaleCampaignList] = useState<ISaleCampaign[]>([]);
	const {showNoti} = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const optionStatusList = [
		//2-Đang hoạt động 3-Tạm ngưng 4-Kết thúc
		{
			title: 'Đang hoạt động',
			value: 2,
		},
		{
			title: 'Tạm ngưng',
			value: 3,
		},
	];
	const sortOptionList = [
		{
			dataSort: {
				sort: 0,
				sortType: true,
			},
			value: 1,
			text: 'Ngày bắt đầu tăng dần',
		},
		{
			dataSort: {
				sort: 0,
				sortType: false,
			},
			value: 2,
			text: 'Ngày bắt đầu giảm dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: true,
			},
			value: 3,
			text: 'Ngày kết thúc tăng dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: false,
			},
			value: 4,
			text: 'Ngày kết thúc giảm dần',
		},
	];
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,

		StatusID: null,
		Time: '',
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
			Time: moment(obj.Time).format('YYYY/MM/DD'),
		});
	};
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
		setFilters({
			...listFieldInit,
			pageSize: refValue.current.pageSize,
		});
	};
	// ACTION SEARCH
	const onSearch = (valueSearch, dataIndex) => {
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
			const res = await saleCampaignApi.getAll(filters);
			if (res.status === 200) {
				setSaleCampaignList(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status === 204) {
				setSaleCampaignList([]);
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
	// CREATE
	const onCreateSaleCampaign = async (data: {
		Name: string;
		StartTime: string;
		EndTime: string;
		Note?: string;
		SaleBonusList?: {MoneyCollected: string; PercentBonus: number}[];
	}) => {
		try {
			setIsLoading({
				type: 'ADD_DATA',
				status: true,
			});
			const newData = {
				...data,
				StartTime: moment(data.StartTime).format('YYYY/MM/DD'),
				EndTime: moment(data.EndTime).format('YYYY/MM/DD'),
				SaleBonusList: data.SaleBonusList.map((s) => ({
					...s,
					MoneyCollected: parsePriceStrToNumber(s.MoneyCollected),
				})),
			};
			const res = await saleCampaignApi.add(newData);
			if (res.status === 200) {
				showNoti('success', res.data.message);
				onResetSearch(); // <== khi tạo xong r reset search để trở về trang đầu tiên
				return true;
			}
		} catch (error) {
			showNoti('danger', error.message);
			console.log('onCreateSaleCampaign', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false,
			});
		}
	};
	// UPDATE
	const onUpdateSaleCampaign = (idx: number) => {
		return async (data: ISaleCampaign) => {
			try {
				setIsLoading({
					type: 'ADD_DATA',
					status: true,
				});
				const {
					StartTime,
					EndTime,
					SaleBonusList: newSaleBonusList,
					StatusID,
				} = data;
				// GET OLD SALE CAMPAIGN
				const newSaleCampaignList = [...saleCampaignList];
				const saleCampaign = newSaleCampaignList[idx];
				const {SaleBonusList: oldSaleBonusList} = saleCampaign;
				// FORMAT BONUS LIST FOLLOW API
				const formatSaleBonusList = [
					...newSaleBonusList,
					...oldSaleBonusList,
				].reduce((arr, saleBonus) => {
					// CLEAR DUPLICATE OLD BONUS
					if (
						arr.some(
							(newBonusArr) => newBonusArr.ID && newBonusArr.ID === saleBonus.ID
						)
					) {
						return arr;
					}
					if (
						newSaleBonusList.some(
							(newSaleBonus) =>
								newSaleBonus.ID && newSaleBonus.ID === saleBonus.ID
						)
					) {
						arr.push({
							...saleBonus,
							MoneyCollected: parsePriceStrToNumber(saleBonus.MoneyCollected),
						});
					} else if (!saleBonus.hasOwnProperty('ID')) {
						// DO NOT HAVE PROPERTY ID => NEW BONUS
						arr.push({
							...saleBonus,
							MoneyCollected: parsePriceStrToNumber(saleBonus.MoneyCollected),
						});
					} else {
						// CAN NOT FIND ID BONUS IN SALE BONUS LIST => BONUS REMOVED
						arr.push({
							...saleBonus,
							Enable: false,
						});
					}
					return arr;
				}, []);
				//
				const newSaleCampaign: ISaleCampaign = {
					...saleCampaign,
					...data,
					StatusName: [2, 3].includes(StatusID)
						? optionStatusList.find((o) => o.value === data.StatusID).title
						: saleCampaign.StatusName,
					StartTime: moment(StartTime).format('YYYY/MM/DD'),
					EndTime: moment(EndTime).format('YYYY/MM/DD'),
					SaleBonusList: formatSaleBonusList,
				};
				const res = await saleCampaignApi.update(newSaleCampaign);
				if (res.status === 200) {
					newSaleCampaignList.splice(idx, 1, {
						...newSaleCampaign,
						SaleBonusList: newSaleBonusList.map((s) => ({
							...s,
							MoneyCollected: parsePriceStrToNumber(s.MoneyCollected),
						})),
					});
					setSaleCampaignList(newSaleCampaignList);
					showNoti('success', res.data.message);
					return true;
				}
			} catch (error) {
				showNoti('danger', error.message);
				console.log('onUpdateSaleCampaign', error.message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false,
				});
			}
		};
	};

	const columns = [
		{
			title: 'Tên chiến dịch',
			dataIndex: 'Name',
		},
		{
			title: 'Bắt đầu',
			dataIndex: 'StartTime',
			render: (date) => (
				<p className="font-weight-black">{moment(date).format('DD/MM/YYYY')}</p>
			),
		},
		{
			title: 'Kết thúc',
			dataIndex: 'EndTime',
			render: (date) => (
				<p className="font-weight-black">{moment(date).format('DD/MM/YYYY')}</p>
			),
		},
		{
			title: 'Số ngày',
			dataIndex: 'TotalDay',
		},
		{
			title: 'Doanh thu',
			dataIndex: 'TotalRevenue',
			render: (text) => numberWithCommas(text),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusID',
			render: (statusID, record: ISaleCampaign) => {
				let cls = 'tag';
				switch (statusID) {
					//1-Chưa hoạt động 2-Đang hoạt động 3-Tạm ngưng 4-Kết thúc
					case 1:
						cls += ' black';
						break;
					case 2:
						cls += ' green';
						break;
					case 3:
						cls += ' yellow';
					case 4:
						cls += ' gray';
						break;
				}
				return <span className={cls}>{record.StatusName}</span>;
			},
			filters: [
				{
					text: 'Chưa hoạt động',
					value: 1,
				},
				{
					text: 'Đang hoạt động',
					value: 2,
				},
				{
					text: 'Tạm ngưng',
					value: 3,
				},
				{
					text: 'Kết thúc',
					value: 4,
				},
			],
		},
		{
			title: 'Ghi chú',
			dataIndex: 'Note',
		},
		{
			align: 'center',
			render: (record: ISaleCampaign, _, idx) => (
				<div onClick={(e) => e.stopPropagation()}>
					<Link
						href={{
							pathname: '/staff/sales-campaign/sales-campaign-detail/[slug]',
							query: {slug: record.ID},
						}}
					>
						<a className="btn btn-icon">
							<Tooltip title="Chi tiết chiến dịch">
								<Eye />
							</Tooltip>
						</a>
					</Link>
					<SalesCampaignForm
						isUpdate={true}
						updateObj={record}
						isLoading={isLoading}
						handleSubmit={onUpdateSaleCampaign(idx)}
						optionStatusList={optionStatusList}
					/>
				</div>
			),
		},
	];
	const expandedRowRender = (item: ISaleCampaign) => {
		return (
			<table className="tb-expand">
				<thead>
					<tr>
						<th>Mốc doanh thu</th>
						<th>Thưởng (%)</th>
					</tr>
				</thead>
				<tbody>
					{item.SaleBonusList.map((s) => (
						<tr>
							<td>
								<p className="font-weight-black">
									{numberWithCommas(s.MoneyCollected)}
								</p>
							</td>
							<td>
								<p className="font-weight-black">{s.PercentBonus}%</p>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		);
	};
	return (
		<ExpandTable
			loading={isLoading}
			currentPage={filters.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			addClass="basic-header"
			TitlePage="Danh sách phiếu chi"
			dataSource={saleCampaignList}
			columns={columns}
			handleTableChange={(pagination, filters, sorter) => {
				if (filters['StatusID']) {
					onSearch(filters['StatusID'].toString(), 'StatusID');
				} else {
					onSearch(null, 'StatusID');
				}
			}}
			TitleCard={
				<>
					<SalesCampaignForm
						isLoading={isLoading}
						handleSubmit={onCreateSaleCampaign}
					/>
				</>
			}
			Extra={
				<div className="extra-table">
					<SalesCampaignFilter
						handleFilter={onFilter}
						handleResetFilter={onResetSearch}
					/>
					<SortBox handleSort={onSort} dataOption={sortOptionList} />
				</div>
			}
			expandable={{expandedRowRender}}
		/>
	);
};

export default SalesCampaign;
