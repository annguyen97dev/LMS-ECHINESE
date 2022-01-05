import { Image, Tooltip } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { File } from 'react-feather';
import { branchApi, invoiceApi } from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import InvoiceVoucherForm from '~/components/Global/Customer/Finance/InvoiceVoucher/InvoiceVoucherForm';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import { fmSelectArr, numberWithCommas } from '~/utils/functions';
import InvoiceVoucherFilter from '../InvoiceVoucher/InvoiceVoucherFilter';

function FinanceInvoice() {
	const [invoiceList, setInvoiceList] = useState<IInvoice[]>([]);
	const { showNoti, pageSize, userInformation } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
	const [optionBrachList, setOptionBranchList] = useState<IOptionCommon[]>([]);
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

	const route = useRouter();

	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: pageSize,
		sort: -1,
		sortType: false,
		FullNameUnicode: null,
		StyleID: route.query === {} ? 1 : null,
		PayID: route.query === {} ? '' : route.query.detail
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
	const fetchInvoiceList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			const res = await invoiceApi.getAll(filters);
			if (res.status === 200) {
				setInvoiceList(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status == 204) {
				setInvoiceList([]);
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
		fetchInvoiceList();
	}, [filters]);

	console.log('Loading: ', isLoading);

	const fetchBrach = async () => {
		try {
			// setIsLoading({
			// 	type: 'FETCH_BRANCH',
			// 	status: true
			// });
			const res = await branchApi.getAll({ selectAll: true });
			if (res.status === 200) {
				const fmOpTionBranch = fmSelectArr(res.data.data, 'BranchName', 'ID');
				setOptionBranchList(fmOpTionBranch);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			// setIsLoading({
			// 	type: 'FETCH_BRANCH',
			// 	status: false
			// });
		}
	};
	useEffect(() => {
		fetchBrach();
	}, []);

	const onUpdateInvoice = (ID: number, idx: number) => {
		return async (data: { Reason: string; Qrcode: string }) => {
			try {
				setIsLoading({
					type: 'ADD_DATA',
					status: true
				});
				const res = await invoiceApi.update({
					...data,
					ID
				});
				if (res.status === 200) {
					const newInvoiceList = [...invoiceList];
					newInvoiceList.splice(idx, 1, { ...newInvoiceList[idx], ...data });
					setInvoiceList(newInvoiceList);
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
			render: (a) => <p className="font-weight-black">{a}</p>,
			...FilterColumn('FullNameUnicode', onSearch, onResetSearch, 'text'),
			className: activeColumnSearch === 'FullNameUnicode' ? 'active-column-search' : ''
		},
		{
			title: 'Trung tâm',
			dataIndex: 'BranchName'
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'Mobile'
		},
		{
			title: 'Số tiền',
			dataIndex: 'Price',
			render: (a) => {
				return <p className="font-weight-black">{numberWithCommas(a)}</p>;
			}
		},
		{
			title: 'Lý do',
			dataIndex: 'Reason',
			render: (a) => <p style={{ width: 100 }}>{a}</p>
		},
		{
			title: 'Loại phiếu thu',
			dataIndex: 'StyleName',
			render: (a) => <p style={{ width: 100 }}>{a}</p>
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			render: (a) => <p>{moment(a).format('DD/MM/YYYY')}</p>
		},
		{
			title: 'Người tạo',
			dataIndex: 'CreatedBy'
		},
		// {
		// 	title: 'QR Code',
		// 	render: (record: IInvoice) => <div style={{ width: 100 }}>{record.Qrcode && <Image width={50} src={record.Qrcode} />}</div>
		// },
		{
			render: (record: IInvoice, _, idx) => (
				<>
					{(userInformation?.RoleID == 1 || userInformation?.RoleID == 5 || userInformation?.RoleID == 9) && (
						<InvoiceVoucherForm
							title="Chỉnh sửa phiếu thu"
							isLoading={isLoading}
							isUpdate={true}
							updateObj={record}
							handleSubmit={onUpdateInvoice(record.ID, idx)}
						/>
					)}
					<Link
						href={{
							pathname: '/customer/finance/finance-cashier-invoice/invoice-detail/[slug]',
							query: { slug: record.ID, type: 'invoice' }
						}}
					>
						<Tooltip title="Xem phiếu thu">
							<button className="btn btn-icon exchange">
								<File />
							</button>
						</Tooltip>
					</Link>
				</>
			)
		}
	];

	return (
		<PowerTable
			loading={isLoading}
			currentPage={filters.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			addClass="basic-header"
			TitlePage="Danh sách phiếu thu"
			dataSource={invoiceList}
			columns={columns}
			Extra={
				<div className="extra-table">
					<InvoiceVoucherFilter optionBranchList={optionBrachList} handleFilter={onFilter} handleResetFilter={onResetSearch} />
					<SortBox handleSort={onSort} dataOption={sortOptionList} />
				</div>
			}
		/>
	);
}
export default FinanceInvoice;
