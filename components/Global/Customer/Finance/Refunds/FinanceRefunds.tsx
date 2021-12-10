import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'react-feather';
import { branchApi, refundsApi, voucherApi } from '~/apiBase';
import { ExpandRefundRow } from '~/components/Elements/ExpandBox';
import SortBox from '~/components/Elements/SortBox';
import ExpandTable from '~/components/ExpandTable';
import RefundForm from '~/components/Global/Customer/Finance/Refunds/RefundsForm';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import { fmSelectArr, numberWithCommas } from '~/utils/functions';
import InvoiceVoucherFilter from '../InvoiceVoucher/InvoiceVoucherFilter';

const FinanceRefund = () => {
	const [refundList, setRefundList] = useState<IRefunds[]>([]);
	const { showNoti, pageSize } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	});
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
	const [totalPage, setTotalPage] = useState(null);
	const [optionBrachList, setOptionBranchList] = useState<IOptionCommon[]>([]);
	const [infoVoucherList, setInfoVoucherList] = useState<IVoucher[]>([]);
	// STATUS
	const optionStatusList = [
		{
			title: 'Chờ duyệt',
			value: 1
		},
		{
			title: 'Đã duyệt',
			value: 2
		},
		{
			title: 'Không duyệt',
			value: 3
		}
	];
	// SORT
	const sortOptionList = [
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

	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: pageSize,
		sort: -1,
		sortType: false,

		FullNameUnicode: null,
		StatusID: null
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false
	});
	const [filters, setFilters] = useState(listFieldInit);

	// FILTER
	const onFilter = (obj) => {
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			...obj,
			fromDate: moment(obj.fromDate).format('YYYY/MM/DD'),
			toDate: moment(obj.toDate).format('YYYY/MM/DD')
		});
	};
	// PAGINATION
	const getPagination = (pageIndex: number, pageSize: number) => {
		if (!pageSize) pageSize = 10;
		refValue.current = {
			...refValue.current,
			pageSize,
			pageIndex
		};
		setFilters({
			...filters,
			...refValue.current
		});
	};
	// SORT
	const onSort = (option) => {
		refValue.current = {
			...refValue.current,
			sort: option.title.sort,
			sortType: option.title.sortType
		};
		setFilters({
			...listFieldInit,
			...refValue.current
		});
	};
	// RESET SEARCH
	const onResetSearch = () => {
		setActiveColumnSearch('');
		setFilters({
			...listFieldInit,
			pageSize: refValue.current.pageSize
		});
	};
	// ACTION SEARCH
	const onSearch = (valueSearch, dataIndex) => {
		setActiveColumnSearch(dataIndex);
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			[dataIndex]: valueSearch
		});
	};

	// GET DATA TABLE
	const fetchRefundList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			let res = await refundsApi.getAll(filters);
			if (res.status === 200) {
				setRefundList(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status == 204) {
				setRefundList([]);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};
	useEffect(() => {
		fetchRefundList();
	}, [filters]);

	const fetchBranchList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			const res = await branchApi.getAll({ pageIndex: 1, pageSize: 9999 });
			if (res.status === 200) {
				const fmOpTionBranchList = fmSelectArr(res.data.data, 'BranchName', 'ID');
				setOptionBranchList(fmOpTionBranchList);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};
	useEffect(() => {
		fetchBranchList();
	}, []);

	const onUpdateRefund = (ID: number, idx: number) => {
		return async (data: { StatusID: number }) => {
			try {
				setIsLoading({
					type: 'ADD_DATA',
					status: true
				});
				const { StatusID } = data;
				const newRefund = {
					StatusID,
					ID
				};
				const res = await refundsApi.update(newRefund);
				if (res.status === 200) {
					const newRefundList = [...refundList];
					newRefundList.splice(idx, 1, {
						...newRefundList[idx],
						StatusID,
						StatusName: optionStatusList.find((s) => s.value === StatusID).title
					});
					setRefundList(newRefundList);
					showNoti('success', 'Cập nhật thành công');
					return true;
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false
				});
			}
		};
	};

	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'FullNameUnicode',
			width: 200,
			...FilterColumn('FullNameUnicode', onSearch, onResetSearch, 'text'),
			className: activeColumnSearch === 'FullNameUnicode' ? 'active-column-search' : '',
			render: (name) => <p className="font-weight-black">{name}</p>
		},
		{
			width: 150,
			title: 'Trung tâm',
			dataIndex: 'BranchName'
		},
		{
			width: 200,
			title: 'Số điện thoại',
			dataIndex: 'Mobile'
		},
		{
			title: 'Số tiền',
			width: 200,
			dataIndex: 'Price',
			render: (Price) => {
				return <p className="font-weight-primary">{numberWithCommas(Price)}</p>;
			}
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusName',
			width: 200,
			align: 'center',
			render: (fnStatus) => {
				switch (fnStatus) {
					case 'Chờ duyệt':
						return <span className="tag green">{fnStatus}</span>;
					case 'Không duyệt':
						return <span className="tag red">{fnStatus}</span>;
					case 'Đã duyệt':
						return <span className="tag yellow">{fnStatus}</span>;
						break;
				}
			},
			...FilterColumn('StatusID', onSearch, onResetSearch, 'select', optionStatusList)
		},
		{
			title: 'Xóa khỏi lớp',
			dataIndex: 'isExpulsion',
			width: 240,
			align: 'center',
			render: (isExpulsion) => {
				return <p>{isExpulsion ? <Check color="#0da779" /> : ''}</p>;
			}
		},
		{
			title: '',
			width: 200,
			render: (record: IRefunds, _, idx: number) => (
				<RefundForm
					isLoading={isLoading}
					isUpdate={true}
					updateObj={record}
					optionStatusList={optionStatusList}
					handleSubmit={onUpdateRefund(record.ID, idx)}
				/>
			)
		}
	];

	//
	const fetchInfoVoucherList = async (ID: number) => {
		try {
			setIsLoading({
				type: 'FETCH_INFO_VOUCHER',
				status: true
			});
			const res = await voucherApi.getAll({
				RefundsID: ID
			});
			if (res.status === 200) {
				setInfoVoucherList(res.data.data);
			}
			if (res.status === 204) {
				setInfoVoucherList(null);
			}
		} catch (error) {
			console.log(fetchInfoVoucherList, error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_INFO_VOUCHER',
				status: false
			});
		}
	};

	const expandableObj = {
		expandedRowRender: (record) => (
			<ExpandRefundRow isLoading={isLoading} key={record.ID} dataRow={record} infoVoucherList={infoVoucherList} />
		),
		onExpand: (expanded, record) => {
			if (expanded) {
				fetchInfoVoucherList(record.ID);
			}
		}
	};

	return (
		<ExpandTable
			loading={isLoading}
			currentPage={filters.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			addClass="basic-header"
			TitlePage="Danh sách yêu cầu hoàn tiền"
			dataSource={refundList}
			columns={columns}
			expandable={expandableObj}
			Extra={
				<div className="extra-table">
					<InvoiceVoucherFilter optionBranchList={optionBrachList} handleFilter={onFilter} handleResetFilter={onResetSearch} />
					<SortBox handleSort={onSort} dataOption={sortOptionList} />
				</div>
			}
		/>
	);
};
export default FinanceRefund;
