import moment from 'moment';
import PropTypes from 'prop-types';
import {useEffect, useRef, useState} from 'react';
import {courseOfStudentPriceApi} from '~/apiBase';
import {ExpandPaymentRow} from '~/components/Elements/ExpandBox';
import ExpandTable from '~/components/ExpandTable';
import {useWrap} from '~/context/wrap';
import {numberWithCommas} from '~/utils/functions';

PaymentTable.propTypes = {
	studentID: PropTypes.number,
};
PaymentTable.defaultProps = {
	studentID: 0,
};

function PaymentTable(props) {
	const {studentID} = props;
	const {showNoti} = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: null,
		status: false,
	});
	const [paymentHistoryList, setPaymentHistoryList] = useState<
		ICourseOfStudentPrice[]
	>([]);
	const [totalPage, setTotalPage] = useState(null);
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,

		UserInformationID: studentID,
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

	const getCourseOfStudentPrice = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true,
			});
			const res = await courseOfStudentPriceApi.getAll(filters);
			if (res.status === 200) {
				setPaymentHistoryList(res.data.data);
				setTotalPage(res.data.totalRow);
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
		getCourseOfStudentPrice();
	}, [filters]);

	const columns = [
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			render: (date) => (
				<p className="font-weight-black">{moment(date).format('DD/MM/YYYY')}</p>
			),
		},
		{
			title: 'Tổng thanh toán',
			dataIndex: 'Price',
			render: (price) => {
				return <p>{numberWithCommas(price)}</p>;
			},
		},
		{
			title: 'Giảm giá',
			dataIndex: 'Reduced',
			render: (price) => {
				return <p>{numberWithCommas(price)}</p>;
			},
		},
		{
			title: '	Đã thanh toán',
			dataIndex: 'Paid',
			render: (price) => {
				return <p>{numberWithCommas(price)}</p>;
			},
		},
		{
			title: 'Số tiền còn lại',
			dataIndex: 'MoneyInDebt',
			render: (price) => {
				return <p className="font-weight-blue">{numberWithCommas(price)}</p>;
			},
		},
		{
			title: 'Hình thức',
			dataIndex: 'PaymentMethodsName',
		},
		{
			title: 'Ngày hẹn trả',
			dataIndex: 'PayDate',
			render: (date) => <p>{moment(date).format('DD/MM/YYYY')}</p>,
		},
	];
	const expandedRowRender = (record) => <ExpandPaymentRow dataRow={record} />;
	return (
		<ExpandTable
			loading={isLoading}
			currentPage={filters.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			noScroll
			dataSource={paymentHistoryList}
			columns={columns}
			Extra={<h5>Lịch sử thanh toán</h5>}
			expandable={{expandedRowRender}}
		/>
	);
}
export default PaymentTable;
