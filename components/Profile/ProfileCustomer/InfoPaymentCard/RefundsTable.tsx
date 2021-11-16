import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { Check } from 'react-feather';
import { refundsApi, voucherApi } from '~/apiBase';
import { ExpandRefundRow } from '~/components/Elements/ExpandBox';
import ExpandTable from '~/components/ExpandTable';
import { useWrap } from '~/context/wrap';
import { numberWithCommas } from '~/utils/functions';

RefundsTable.propTypes = {
	studentID: PropTypes.number
};
RefundsTable.defaultProps = {
	studentID: 0
};
function RefundsTable(props) {
	const { studentID } = props;
	const { showNoti, pageSize } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: null,
		status: false
	});
	const [refundList, setRefundList] = useState<IRefunds[]>([]);
	const [totalPage, setTotalPage] = useState(null);
	const [infoVoucherList, setInfoVoucherList] = useState<IVoucher[]>([]);

	const listFieldInit = {
		pageIndex: 1,
		pageSize: pageSize,
		sort: -1,
		sortType: false,
		UserInformationID: studentID
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false
	});
	const [filters, setFilters] = useState(listFieldInit);

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

	const getRefundList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			const res = await refundsApi.getAll(filters);
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
		getRefundList();
	}, [filters]);

	const columns = [
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			render: (date) => <p className="font-weight-black">{moment(date).format('DD/MM/YYYY')}</p>
		},
		{
			title: 'Trung tâm',
			dataIndex: 'BranchName'
		},
		{
			title: 'Số tiền',
			dataIndex: 'Price',
			render: (price) => {
				return <p className="font-weight-primary">{numberWithCommas(price)}</p>;
			}
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusName',
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
			}
		},
		{
			title: 'Xóa khỏi lớp',
			dataIndex: 'isExpulsion',
			align: 'center',
			render: (isExpulsion) => {
				return <p>{isExpulsion ? <Check color="#0da779" /> : ''}</p>;
			}
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
			noScroll
			dataSource={refundList}
			columns={columns}
			Extra={<h5>Lịch sử hoàn tiền</h5>}
			expandable={expandableObj}
		/>
	);
}
export default RefundsTable;
