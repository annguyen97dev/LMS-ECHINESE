import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {packageApi, packageStudentApi, studentApi} from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import {useWrap} from '~/context/wrap';
import {fmSelectArr, numberWithCommas} from '~/utils/functions';
import PackagePaymentForm from './PackagePaymentForm/PackagePaymentForm';

function PackagePayment() {
	const [packagePaymentList, setPackagePaymentList] = useState<
		IPackageStudent[]
	>([]);
	const [dataToSearch, setDataToSearchList] = useState<{
		studentList: IOptionCommon[];
		packageList: IOptionCommon[];
	}>({
		studentList: [],
		packageList: [],
	});
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const {showNoti} = useWrap();
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,

		Type: 2,
		SetPackageID: null,
		StudentID: null,
		formDate: '',
		toDate: '',
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,
	});
	const [filters, setFilters] = useState(listFieldInit);
	const approvalOptionList = [
		{
			value: 1,
			title: 'Chưa thanh toán',
		},
		{
			value: 2,
			title: 'Chờ duyệt',
		},
		{
			value: 3,
			title: 'Đã duyệt',
		},
	];
	// SORT OPTION
	const sortOptionList = [
		{
			dataSort: {
				sort: 0,
				sortType: true,
			},
			value: 1,
			text: 'Level tăng dần',
		},
		{
			dataSort: {
				sort: 0,
				sortType: false,
			},
			value: 2,
			text: 'Level giảm dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: true,
			},
			value: 3,
			text: 'Giá tăng dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: false,
			},
			value: 4,
			text: 'Giá giảm dần',
		},
	];
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
		if (dataIndex === 'CreatedOn') {
			setFilters({
				...listFieldInit,
				...refValue.current,
				pageIndex: 1,
				...valueSearch,
			});
		} else {
			setFilters({
				...listFieldInit,
				...refValue.current,
				pageIndex: 1,
				[dataIndex]: valueSearch,
			});
		}
	};
	// GET DATA IN FIRST TIME
	const fetchDataToSearchList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			const [studentList, packageList] = await Promise.all([
				studentApi.getAll({selectAll: true}),
				packageApi.getAll({selectAll: true}),
			]).then((res) => {
				return res.map((r) => r.data.data);
			});
			if (studentList.length && packageList.length) {
				const fmOptionStudentList = fmSelectArr(
					studentList,
					'FullNameUnicode',
					'UserInformationID'
				);
				const fmOptionPackageList = fmSelectArr(packageList, 'Name', 'ID');
				setDataToSearchList({
					studentList: fmOptionStudentList,
					packageList: fmOptionPackageList,
				});
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
	const fetchPackagePaymentList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			let res = await packageStudentApi.getAll(filters);
			if (res.status === 200) {
				if (res.data.totalRow && res.data.data.length) {
					setPackagePaymentList(res.data.data);
					setTotalPage(res.data.totalRow);
				}
			} else if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
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
		fetchDataToSearchList();
	}, []);

	useEffect(() => {
		fetchPackagePaymentList();
	}, [filters]);

	// UPDATE
	const onUpdatePackagePayment = (idx: number) => {
		return async (packagePaymentItem: IPackageStudent) => {
			setIsLoading({
				type: 'ADD_DATA',
				status: true,
			});
			try {
				const {ID, Approval} = packagePaymentItem;
				const newPackagePaymentUpdateApi: {
					ID: number;
					Approval: number;
					Enable: boolean;
				} = {
					ID,
					Approval,
					Enable: true,
				};
				const newPackagePaymentUpdate: IPackageStudent = {
					...packagePaymentItem,
					Approval,
					ApprovalName: approvalOptionList.find((a) => a.value === Approval)
						.title,
				};
				const res = await packageStudentApi.update(newPackagePaymentUpdateApi);
				if (res.status === 200) {
					const newPackagePaymentList = [...packagePaymentList];
					newPackagePaymentList.splice(idx, 1, newPackagePaymentUpdate);
					setPackagePaymentList(newPackagePaymentList);
					showNoti('success', res.data.message);
				}
				return res;
			} catch (error) {
				showNoti('danger', error.message);
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
			title: 'Học viên',
			dataIndex: 'StudentName',
			...FilterColumn(
				'StudentID',
				onSearch,
				onResetSearch,
				'select',
				dataToSearch.studentList
			),
			className:
				activeColumnSearch === 'StudentID' ? 'active-column-search' : '',
		},
		{
			title: 'Tên bộ đề',
			dataIndex: 'SetPackageName',
			...FilterColumn(
				'SetPackageID',
				onSearch,
				onResetSearch,
				'select',
				dataToSearch.packageList
			),
			className:
				activeColumnSearch === 'SetPackageID' ? 'active-column-search' : '',
		},
		{
			title: 'Level',
			dataIndex: 'Level',
			render: (level) => `HSK ${level}`,
		},
		{
			title: 'Loại',
			dataIndex: 'TypeName',
		},

		{
			title: 'Giá',
			dataIndex: 'Price',
			render: (price) => (price ? numberWithCommas(price) : 0),
		},
		{
			title: 'Ngày mua',
			dataIndex: 'CreatedOn',
			...FilterColumn('CreatedOn', onSearch, onResetSearch, 'date-range'),
			render: (date) => moment(date).format('DD/MM/YYYY'),
			className:
				activeColumnSearch === 'CreatedOn' ? 'active-column-search' : '',
		},
		{
			title: 'Phương thức',
			dataIndex: 'PaymentMethodsName',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'ApprovalName',
			render: (status) => (status ? status : 'Trống'),
		},
		{
			align: 'center',
			render: (packageItem: IPackageStudent, record, idx) => (
				<>
					{packageItem.Approval !== 3 && (
						<PackagePaymentForm
							isLoading={isLoading}
							approvalOptionList={approvalOptionList}
							updateObj={packageItem}
							handleUpdatePackagePayment={onUpdatePackagePayment(idx)}
						/>
					)}
				</>
			),
		},
	];

	return (
		<>
			<PowerTable
				currentPage={filters.pageIndex}
				totalPage={totalPage}
				getPagination={getPagination}
				loading={isLoading}
				Size="package-list-table"
				addClass="basic-header"
				dataSource={packagePaymentList}
				columns={columns}
				TitlePage="Danh sách học viên mua bộ đề"
				Extra={
					<div className="extra-table">
						<SortBox dataOption={sortOptionList} handleSort={onSort} />
					</div>
				}
			/>
		</>
	);
}

export default PackagePayment;
