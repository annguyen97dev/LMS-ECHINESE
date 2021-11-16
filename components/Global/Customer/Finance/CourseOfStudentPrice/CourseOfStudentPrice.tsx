import { Tooltip } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { Eye } from 'react-feather';
import { branchApi, courseApi, courseStudentApi, invoiceApi, refundsApi } from '~/apiBase';
import { courseStudentPriceApi } from '~/apiBase/customer/student/course-student-price';
import { ExpandPaymentRow } from '~/components/Elements/ExpandBox';
import SortBox from '~/components/Elements/SortBox';
import ExpandTable from '~/components/ExpandTable';
import CourseOfStudentPriceForm from '~/components/Global/Customer/Finance/CourseOfStudentPrice/CourseStudentPriceForm';
import RequestRefundForm from '~/components/Global/Customer/Finance/Refunds/RequestRefundsForm';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import { fmSelectArr, numberWithCommas } from '~/utils/functions';
import CourseOfStudentPriceFilter from './CourseOfStudentPriceFilter';

const CourseOfStudentPrice = () => {
	const { showNoti, pageSize } = useWrap();
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
	const [totalPage, setTotalPage] = useState(null);
	const [courseStudentPrice, setCourseStudentPrice] = useState<ICourseOfStudentPrice[]>([]);
	const [courseListOfStudent, setCourseListOfStudent] = useState<ICourseOfStudent[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	});
	const [optionListForFilter, setOptionListForFilter] = useState<{
		optionBranchList: IOptionCommon[];
		optionCourseList: IOptionCommon[];
	}>({
		optionBranchList: [],
		optionCourseList: []
	});
	const [infoInvoiceList, setInfoInvoiceList] = useState<IInvoice[]>([]);
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: pageSize,
		sort: -1,
		sortType: false,

		fromDate: null,
		toDate: null,
		PayBranchID: null,
		CourseID: null,
		FullNameUnicode: null,
		DonePaid: null
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false
	});
	const [filters, setFilters] = useState(listFieldInit);
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
		},
		{
			dataSort: {
				sort: 2,
				sortType: false
			},
			value: 5,
			text: 'Số tiền còn lại giảm dần'
		},
		{
			dataSort: {
				sort: 2,
				sortType: true
			},
			value: 6,
			text: 'Số tiền còn lại tăng dần '
		},
		{
			dataSort: {
				sort: 3,
				sortType: false
			},
			value: 7,
			text: 'Hạn thanh toán giảm dần'
		},
		{
			dataSort: {
				sort: 3,
				sortType: true
			},
			value: 8,
			text: 'Hạn thanh toán tăng dần '
		}
	];
	const paymentMethodOptionList = [
		{
			label: 'Tiền mặt',
			value: 1
		},
		{
			label: 'Chuyển khoản',
			value: 2
		}
	];
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

	const fetchDataFilter = async () => {
		try {
			const [branchRes, courseRes] = await Promise.all([
				branchApi.getAll({ pageSize: 99999, pageIndex: 1 }),
				courseApi.getAll({ pageSize: 99999, pageIndex: 1 })
			]);
			const rs = {
				optionBranchList: [],
				optionCourseList: []
			};
			if (branchRes.status === 200) {
				rs.optionBranchList = fmSelectArr(branchRes.data.data, 'BranchName', 'ID');
			}
			if (courseRes.status === 200) {
				rs.optionCourseList = fmSelectArr(courseRes.data.data, 'CourseName', 'ID');
			}
			setOptionListForFilter(rs);
		} catch (error) {
			showNoti('danger', error.message);
		}
	};

	useEffect(() => {
		fetchDataFilter();
	}, []);

	const getDataCourseStudentPrice = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			const res = await courseStudentPriceApi.getAll(filters);
			if (res.status === 200) {
				setTotalPage(res.data.totalRow);
				setCourseStudentPrice(res.data.data);
			}
			if (res.status == 204) {
				setCourseStudentPrice([]);
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
		getDataCourseStudentPrice();
	}, [filters]);

	// UPDATE COURSE OF STUDENT PRICE => CREATE NEW INVOICE
	const onUpdateCourseOfStudentPrice = (ID: number) => {
		return async (data: {
			FullNameUnicode: string;
			MoneyInDebt: string;
			Paid: string;
			PaymentMethodsID: number;
			PayBranchID: number;
			PayDate: string;
		}) => {
			try {
				setIsLoading({
					type: 'ADD_DATA',
					status: true
				});
				const { FullNameUnicode, PaymentMethodsID, PayBranchID, Paid, PayDate } = data;
				const newData = {
					ID,
					FullNameUnicode,
					PaymentMethodsID,
					PayBranchID,
					Paid: parseInt(Paid.replace(/\D/g, '')),
					PayDate: moment(PayDate).format('YYYY/MM/DD')
				};
				const res = await courseStudentPriceApi.update(newData);
				if (res.status === 200) {
					showNoti('success', res.data.message);
					getDataCourseStudentPrice();
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
	// REQUEST REFUND
	const getInfoCourse = async (CourseOfStudentPriceID: number) => {
		setIsLoading({
			type: 'FETCH_INFO_COURSE',
			status: true
		});
		try {
			const res = await courseStudentApi.getAll({ CourseOfStudentPriceID });
			if (res.status === 200) {
				setCourseListOfStudent(res.data.data);
			}
			if (res.status === 204) {
				setCourseListOfStudent([]);
			}
		} catch (error) {
			console.log('getInfoCourse', error);
		} finally {
			setIsLoading({
				type: 'FETCH_INFO_COURSE',
				status: false
			});
		}
	};

	const onCreateRequestRefund = async (data: {
		ListCourseOfStudentID: number[];
		Price: string;
		PaymentMethodsID: number;
		Reason: string;
		isExpulsion: boolean;
	}) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		try {
			const { Price } = data;
			const newData = {
				...data,
				Price: parseInt(Price.replace(/\D/g, ''))
			};
			const res = await refundsApi.add(newData);
			if (res.status === 200) {
				showNoti('success', res.data.message);
				return res;
			}
		} catch (error) {
			console.log('onCreateRequestRefund', error);
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};

	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'FullNameUnicode',
			...FilterColumn('FullNameUnicode', onSearch, onResetSearch, 'text'),
			className: activeColumnSearch === 'FullNameUnicode' ? 'active-column-search' : '',
			render: (name) => <p className="font-weight-black">{name}</p>
		},
		{
			title: 'Trung tâm thanh toán',
			dataIndex: 'PayBranchName'
		},
		{
			title: 'Tổng thanh toán',
			dataIndex: 'Price',
			render: (price) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Giảm giá',
			dataIndex: 'Reduced',
			render: (price) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Đã thanh toán',
			dataIndex: 'Paid',
			render: (price) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Số tiền còn lại',
			dataIndex: 'MoneyInDebt',
			render: (price) => <p className="font-weight-primary">{numberWithCommas(price)}</p>
		},
		{
			title: 'Hình thức',
			dataIndex: 'PaymentMethodsName'
		},
		{
			title: 'Ngày hẹn trả',
			dataIndex: 'PayDate',
			render: (date) => (date ? moment(date).format('DD/MM/YYYY') : '')
		},

		{
			width: 130,
			render: (data, record: any) => (
				<div onClick={(e) => e.stopPropagation()}>
					<Link
						href={{
							pathname: '/customer/student/student-list/student-detail/[slug]',
							query: { slug: record.UserInformationID }
						}}
					>
						<Tooltip title="Xem chi tiết">
							<button className="btn btn-icon">
								<Eye />
							</button>
						</Tooltip>
					</Link>
					{!record.DonePaid && (
						<CourseOfStudentPriceForm
							isPayTuition={true}
							isLoading={isLoading}
							isUpdate={true}
							updateObj={record}
							optionBranchList={optionListForFilter.optionBranchList}
							paymentMethodOptionList={paymentMethodOptionList}
							handleSubmit={onUpdateCourseOfStudentPrice(record.ID)}
						/>
					)}
					<RequestRefundForm
						isLoading={isLoading}
						studentObj={data}
						getInfoCourse={getInfoCourse}
						paymentMethodOptionList={paymentMethodOptionList}
						courseListOfStudent={courseListOfStudent}
						onSubmit={onCreateRequestRefund}
					/>
				</div>
			)
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
				PayID: ID
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
			currentPage={filters.pageIndex}
			loading={isLoading}
			totalPage={totalPage}
			getPagination={getPagination}
			addClass="basic-header"
			TitlePage="Cổng thông tin thanh toán"
			dataSource={courseStudentPrice}
			columns={columns}
			Extra={
				<div className="extra-table">
					<CourseOfStudentPriceFilter
						optionListForFilter={optionListForFilter}
						handleFilter={onFilter}
						handleResetFilter={onResetSearch}
					/>
					<SortBox dataOption={sortOptionList} handleSort={onSort} />
				</div>
			}
			expandable={expandableObj}
		/>
	);
};

export default CourseOfStudentPrice;
