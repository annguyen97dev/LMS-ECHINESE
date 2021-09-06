import {Tooltip} from 'antd';
import moment from 'moment';
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import {Eye} from 'react-feather';
import {branchApi, courseApi, courseStudentApi, refundsApi} from '~/apiBase';
import {courseStudentPriceApi} from '~/apiBase/customer/student/course-student-price';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import SortBox from '~/components/Elements/SortBox';
import CourseOfStudentPriceForm from '~/components/Global/Customer/Finance/CourseStudentPriceForm';
import RequestRefundForm from '~/components/Global/Customer/Finance/RequestRefundForm';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import {useWrap} from '~/context/wrap';
import {fmSelectArr} from '~/utils/functions';
const CourseStudentPrice = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const {showNoti} = useWrap();
	const [totalPage, setTotalPage] = useState(null);
	const [courseStudentPrice, setCourseStudentPrice] = useState<
		ICourseOfStudentPrice[]
	>([]);
	const [courseListOfStudent, setCourseListOfStudent] = useState<
		ICourseOfStudent[]
	>([]);
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false,
	});
	// FILTER
	const [dataFilter, setDataFilter] = useState([
		{
			name: 'PayBranchID',
			title: 'Trung tâm thanh toán',
			col: 'col-12',
			type: 'select',
			optionList: null,
			value: null,
		},
		{
			name: 'CourseID',
			title: 'Khóa học',
			col: 'col-12',
			type: 'select',
			optionList: null,
			value: null,
		},
		{
			name: 'date-range',
			title: 'Ngày tạo',
			col: 'col-12',
			type: 'date-range',
			value: null,
		},
	]);
	const listParamsDefault = {
		pageSize: 10,
		pageIndex: currentPage,
		sort: null,
		sortType: null,
		fromDate: null,
		toDate: null,
		PayBranchID: null,
		CourseID: null,
		FullNameUnicode: null,
		DonePaid: null,
	};
	const [params, setParams] = useState(listParamsDefault);
	const sortOption = [
		{
			dataSort: {
				sortType: null,
			},
			value: 1,
			text: 'Mới cập nhật',
		},
		{
			dataSort: {
				sortType: true,
			},
			value: 2,
			text: 'Từ dưới lên',
		},
	];
	const paymentMethodOptionList = [
		{
			label: 'Tiền mặt',
			value: 1,
		},
		{
			label: 'Chuyển khoản',
			value: 2,
		},
	];
	const handleSort = async (option) => {
		setParams({
			...listParamsDefault,
			sortType: option.title.sortType,
		});
	};
	const handleFilter = (listFilter) => {
		console.log('List Filter when submit: ', listFilter);
		let newListFilter = {
			pageIndex: 1,
			fromDate: null,
			toDate: null,
			BranchID: null,
			CourseID: null,
			DonePaid: null,
		};
		listFilter.forEach((item, index) => {
			let key = item.name;
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = item.value;
				}
			});
		});
		setParams({...listParamsDefault, ...newListFilter, pageIndex: 1});
	};
	const onSearch = (data) => {
		setCurrentPage(1);
		setParams({
			...listParamsDefault,
			FullNameUnicode: data,
		});
	};
	const handleReset = () => {
		setCurrentPage(1);
		setParams(listParamsDefault);
	};
	const setDataFunc = (name, data) => {
		dataFilter.every((item, index) => {
			if (item.name == name) {
				item.optionList = data;
				return false;
			}
			return true;
		});
		setDataFilter([...dataFilter]);
	};
	const getDataCenter = async () => {
		try {
			let res = await branchApi.getAll({pageSize: 99999, pageIndex: 1});
			if (res.status === 200) {
				const newData = fmSelectArr(res.data.data, 'BranchName', 'ID');
				setDataFunc('PayBranchID', newData);
			}

			res.status == 204 && showNoti('danger', 'Trung tâm Không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		}
	};
	const getDataCourse = async () => {
		try {
			let res = await courseApi.getAll({pageSize: 99999, pageIndex: 1});
			if (res.status === 200) {
				const newData = fmSelectArr(res.data.data, 'CourseName', 'ID');
				setDataFunc('CourseID', newData);
			}

			res.status == 204 && showNoti('danger', 'Trung tâm Không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		}
	};
	useEffect(() => {
		getDataCenter();
		getDataCourse();
	}, []);
	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setParams({
			...params,
			pageIndex: currentPage,
		});
	};
	const getDataCourseStudentPrice = (page: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		(async () => {
			try {
				let res = await courseStudentPriceApi.getAll({
					...params,
					pageIndex: page,
				});
				res.status == 200 && setCourseStudentPrice(res.data.data);
				if (res.status == 204) {
					showNoti('danger', 'Không tìm thấy dữ liệu!');
					setCurrentPage(1);
					setParams(listParamsDefault);
				} else setTotalPage(res.data.totalRow);
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false,
				});
			}
		})();
	};

	useEffect(() => {
		getDataCourseStudentPrice(currentPage);
	}, [params]);
	const getInfoCourse = async (CourseOfStudentPriceID: number) => {
		setIsLoading({
			type: 'FETCH_INFO_COURSE',
			status: true,
		});
		try {
			const res = await courseStudentApi.getAll({CourseOfStudentPriceID});
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
				status: false,
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
			status: true,
		});
		try {
			const {Price} = data;
			const newData = {
				...data,
				Price: parseInt(Price.replace(/\D/g, '')),
			};
			const res = await refundsApi.add(newData);
			if (res.status === 200) {
				showNoti('success', res.data.message);
				return res;
			}
		} catch (error) {
			console.log('onCreateRequestRefund', error);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false,
			});
		}
	};

	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'FullNameUnicode',
			...FilterColumn('FullNameUnicode', onSearch, handleReset, 'text'),
			render: (text) => <p className="font-weight-blue">{text}</p>,
		},
		{
			title: 'Khóa học',
			dataIndex: 'Course',
			render: (Course: ICourse[]) => (
				<>
					{Course.map((item) => (
						<Link
							key={item.ID}
							href={{
								pathname: '/course/course-list/course-list-detail/[slug]',
								query: {slug: item.ID},
							}}
						>
							<a
								title={item.CourseName}
								className="finance-course-name font-weight-black d-block"
							>
								{item.CourseName}
							</a>
						</Link>
					))}
				</>
			),
		},
		{
			title: 'Trung tâm',
			dataIndex: 'PayBranchName',
			render: (text) => <p className="font-weight-black">{text}</p>,
		},
		{
			title: 'Tổng thanh toán',
			dataIndex: 'Price',
			render: (price) => (
				<p className="font-weight-blue">
					{Intl.NumberFormat('en-US').format(price)}
				</p>
			),
		},
		{
			title: 'Giảm giá',
			dataIndex: 'Reduced',
			render: (price) => (
				<p className="font-weight-blue">
					{Intl.NumberFormat('en-US').format(price)}
				</p>
			),
		},
		{
			title: 'Đã thanh toán',
			dataIndex: 'Paid',
			render: (price) => (
				<p className="font-weight-blue">
					{Intl.NumberFormat('en-US').format(price)}
				</p>
			),
		},
		{
			title: 'Số tiền còn lại',
			dataIndex: 'MoneyInDebt',
			render: (price) => (
				<p className="font-weight-blue">
					{Intl.NumberFormat('en-US').format(price)}
				</p>
			),
		},
		{
			title: 'Hình thức',
			dataIndex: 'PaymentMethodsName',
		},
		{
			title: 'Ngày hẹn trả',
			dataIndex: 'PayDate',
			render: (date) => (date ? moment(date).format('DD/MM/YYYY') : ''),
		},

		{
			render: (data, record: ICourseOfStudentPrice) => (
				<div onClick={(e) => e.stopPropagation()}>
					<Link
						href={{
							pathname:
								'/customer/finance/finance-customer-debts/student-detail/[slug]',
							query: {slug: 2},
						}}
					>
						<Tooltip title="Xem thông tin học viên">
							<button className="btn btn-icon">
								<Eye />
							</button>
						</Tooltip>
					</Link>
					{!record.DonePaid && (
						<CourseOfStudentPriceForm
							infoDetail={data}
							infoId={data.ID}
							reloadData={(firstPage) => {
								getDataCourseStudentPrice(firstPage);
							}}
							currentPage={currentPage}
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
			),
		},
	];
	return (
		<PowerTable
			currentPage={currentPage}
			loading={isLoading}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			addClass="basic-header"
			TitlePage="Cổng thông tin thanh toán"
			dataSource={courseStudentPrice}
			columns={columns}
			Extra={
				<div className="extra-table">
					<FilterBase
						dataFilter={dataFilter}
						handleFilter={(listFilter: any) => handleFilter(listFilter)}
						handleReset={handleReset}
					/>
					<SortBox
						dataOption={sortOption}
						handleSort={(value) => handleSort(value)}
					/>
				</div>
			}
		/>
	);
};
CourseStudentPrice.layout = LayoutBase;
export default CourseStudentPrice;
