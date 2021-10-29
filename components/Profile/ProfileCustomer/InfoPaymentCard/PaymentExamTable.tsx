import moment from 'moment';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { invoiceApi } from '~/apiBase';
import { studentExamServicesApi } from '~/apiBase/customer/student/student-exam-services';
import { ExpandPaymentRow } from '~/components/Elements/ExpandBox';
import ExpandTable from '~/components/ExpandTable';
import { useWrap } from '~/context/wrap';
import { numberWithCommas } from '~/utils/functions';

PaymentExamTable.propTypes = {
	studentID: PropTypes.number
};
PaymentExamTable.defaultProps = {
	studentID: 0
};

function PaymentExamTable(props) {
	const { studentID } = props;
	const { showNoti, pageSize } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: null,
		status: false
	});
	const [paymentHistoryList, setPaymentHistoryList] = useState<IStudentExamServices[]>([]);
	const [totalPage, setTotalPage] = useState(null);
	const [infoInvoiceList, setInfoInvoiceList] = useState<IInvoice[]>([]);

	const listFieldInit = {
		pageIndex: 1,
		pageSize: pageSize,

		UserInformationID: studentID
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10
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

	const getExamOfStudent = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			const res = await studentExamServicesApi.getAll(filters);
			if (res.status === 200) {
				setPaymentHistoryList(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status === 204) {
				setPaymentHistoryList([]);
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
		getExamOfStudent();
	}, [filters]);

	const columns = [
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			render: (date) => <p className="font-weight-black">{moment(date).format('DD/MM/YYYY')}</p>
		},
		{
			title: 'Dịch vụ',
			dataIndex: 'ServiceName'
		},
		{
			title: 'Tổng thanh toán',
			dataIndex: 'Price',
			render: (price) => {
				return <p>{numberWithCommas(price)}</p>;
			}
		},
		{
			title: 'Giảm giá',
			dataIndex: 'Reduced',
			render: (price) => {
				return <p>{numberWithCommas(price)}</p>;
			}
		},
		{
			title: '	Đã thanh toán',
			dataIndex: 'Paid',
			render: (price) => {
				return <p>{numberWithCommas(price)}</p>;
			}
		},
		{
			title: 'Hình thức',
			dataIndex: 'PaymentMethodsName'
		}
	];

	//
	const fetchInfoInvoice = async (ID: number) => {
		try {
			setIsLoading({
				type: 'FETCH_INFO_INVOICE',
				status: true
			});
			const res = await invoiceApi.getAll({
				PayID: ID,
				StyleID: 2
			});
			if (res.status === 200) {
				setInfoInvoiceList(res.data.data);
			}
			if (res.status === 204) {
				setInfoInvoiceList(null);
			}
		} catch (error) {
			console.log(fetchInfoInvoice, error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_INFO_INVOICE',
				status: false
			});
		}
	};

	const expandableObj = {
		expandedRowRender: (record) => (
			<ExpandPaymentRow isLoading={isLoading} key={record.ID} dataRow={record} infoInvoiceList={infoInvoiceList} />
		),
		onExpand: (expanded, record) => {
			if (expanded) {
				fetchInfoInvoice(record.ID);
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
			dataSource={paymentHistoryList}
			columns={columns}
			Extra={<h5>Lịch sử thanh toán dịch vụ</h5>}
			expandable={expandableObj}
		/>
	);
}
export default PaymentExamTable;
