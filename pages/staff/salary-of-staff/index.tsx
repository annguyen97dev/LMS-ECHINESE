import { InputNumber, Spin, Tooltip, Select, Popconfirm } from 'antd';
import { useSession } from 'next-auth/client';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'react-feather';
import { payRollApi } from '~/apiBase/staff-manage/pay-roll';
import { staffSalaryApi } from '~/apiBase/staff-manage/staff-salary';
import { teacherSalaryApi } from '~/apiBase/staff-manage/teacher-salary';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import SortBox from '~/components/Elements/SortBox';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useDebounce } from '~/context/useDebounce';
import { useWrap } from '~/context/wrap';
import { month, year } from '~/lib/month-year';
import { Roles } from '~/lib/roles/listRoles';
import { numberWithCommas } from '~/utils/functions';
import ConfirmForm from '../../../components/Global/StaffList/StaffSalary/staff-confirm-salary';

const SalaryStaffReview = () => {
	const [totalPage, setTotalPage] = useState(null);
	const [payRoll, setPayRoll] = useState<IStaffSalary[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [roleID, setRoleID] = useState(null);
	const { showNoti, userInformation, pageSize } = useWrap();
	const [session, loading] = useSession();
	const [visible, setVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	});

	const { Option } = Select;
	const months = [
		'Tháng 1',
		'Tháng 2',
		'Tháng 3',
		'Tháng 4',
		'Tháng 5',
		'Tháng 6',
		'Tháng 7',
		'Tháng 8',
		'Tháng 9',
		'Tháng 10',
		'Tháng 11',
		'Tháng 12'
	];
	const paramDefault = {
		pageIndex: currentPage,
		pageSize: pageSize,
		sortType: null,
		sort: null,
		Year: new Date().getFullYear(),
		Month: new Date().getMonth(),
		StaffName: null,
		// selectAll: true,
		StaffID: null,
		StatusID: null
	};
	const [params, setParams] = useState(paramDefault);

	let listFieldSearch = {
		pageIndex: 1,
		StaffName: null
	};
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
			text: 'Lương tổng giảm dần'
		},
		{
			dataSort: {
				sort: 1,
				sortType: true
			},
			value: 4,
			text: 'Lương tổng tăng dần '
		},
		{
			dataSort: {
				sort: 2,
				sortType: false
			},
			value: 5,
			text: 'Ngày nghỉ giảm dần'
		},
		{
			dataSort: {
				sort: 2,
				sortType: true
			},
			value: 6,
			text: 'Ngày nghỉ tăng dần '
		}
	];

	let refValue = useRef({
		pageIndex: 1,
		pageSize: pageSize,
		sort: -1,
		sortType: false
	});

	// ------------ ON SEARCH -----------------------

	const checkField = (valueSearch, dataIndex) => {
		let newList = { ...listFieldSearch };
		Object.keys(newList).forEach(function (key) {
			if (key != dataIndex) {
				if (key != 'pageIndex') {
					newList[key] = null;
				}
			} else {
				newList[key] = valueSearch;
			}
		});

		return newList;
	};

	const onSearch = (valueSearch, dataIndex) => {
		let clearKey = checkField(valueSearch, dataIndex);

		setParams({
			...params,
			...clearKey
		});
	};

	// HANDLE RESET
	const resetListFieldSearch = () => {
		Object.keys(listFieldSearch).forEach(function (key) {
			if (key != 'pageIndex') {
				listFieldSearch[key] = null;
			}
		});
	};

	const handleReset = () => {
		setParams({
			...paramDefault,
			pageIndex: 1
		});
		setCurrentPage(1), resetListFieldSearch();
	};

	// SORT
	const onSort = (option) => {
		refValue.current = {
			...refValue.current,
			sort: option.title.sort,
			sortType: option.title.sortType
		};
		setParams({ ...params, sort: option.title.sort, sortType: option.title.sortType });
		// setFilters({
		// 	...listFieldInit,
		// 	...refValue.current
		// });
	};

	useEffect(() => {
		if (session !== undefined) {
			let token = session.accessToken;
			let userInfor = parseJwt(token);
			setRoleID(userInfor.roleID);
		}
	}, []);

	const columns = [
		{
			title: 'Nhân viên',
			width: 150,
			dataIndex: 'StaffName',
			render: (price, record: IStaffSalary) => <p className="font-weight-blue">{price}</p>,
			...FilterColumn('StaffName', onSearch, handleReset, 'text')
		},
		{
			title: 'Năm',
			width: 80,
			dataIndex: 'Year',
			render: (price, record: IStaffSalary) => <p>{price}</p>
		},
		{
			title: 'Tháng',
			width: 80,
			dataIndex: 'Month',
			render: (price, record: IStaffSalary) => <p>{price}</p>
		},
		{
			title: 'Ngày nghỉ',
			width: 100,
			dataIndex: 'CountOff',
			render: (price, record: IStaffSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Thưởng',
			width: 150,
			dataIndex: 'Bonus',
			render: (price, record: IStaffSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Ghi Chú',
			width: 250,
			dataIndex: 'NoteBonus',
			render: (price, record: any) => <p>{price}</p>
		},
		{
			title: 'Trạng Thái',
			width: 200,
			dataIndex: 'StatusName',
			filters: roleID == 5 && [
				{
					text: 'Chưa chốt lương',
					value: 1
				},
				{
					text: 'Đã gửi yêu cầu xác nhận',
					value: 3
				},
				{
					text: 'Đã xác nhận',
					value: 4
				},
				{
					text: 'Đã nhận lương',
					value: 5
				}
			],
			onFilter: (value, record) => record.StatusID === value,
			render: (price, record: any) => (
				<>
					{record.StatusID == 1 && <span className="tag red">{price}</span>}
					{record.StatusID == 3 && <span className="tag yellow">{price}</span>}
					{record.StatusID == 4 && <span className="tag blue">{price}</span>}
					{record.StatusID == 5 && <span className="tag green">{price}</span>}
				</>
			)
		},
		{
			title: 'Tăng Lương',
			width: 150,
			dataIndex: 'AdvanceSalary',
			render: (price, record: IStaffSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Lương Tháng',
			width: 150,
			dataIndex: 'Salary',
			render: (price, record: IStaffSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Lương Tổng',
			width: 150,
			dataIndex: 'TotalSalary',
			render: (price, record: IStaffSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Cập Nhật',
			width: 100,
			render: (text, record) => (
				<ConfirmForm isLoading={isLoading} roleID={roleID} record={record} setParams={setParams} params={params} />
			)
		}
	];

	const getDataPayroll = async (page: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await staffSalaryApi.getAll({ ...params, pageIndex: page });
			if (res.status == 200) {
				setPayRoll(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status == 204) {
				setPayRoll([]);
			}
		} catch (error) {
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const postSalaryOfTeacherClosing = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await staffSalaryApi.postSalaryClosing();
			setParams({ ...params });
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setVisible(false);
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setParams({
			...params,
			pageIndex: currentPage
		});
	};

	const onChangeMonth = (value) => {
		setParams({ ...params, Month: Number(value) });
	};

	function daysInMonth(month, year) {
		return new Date(year, month, 0).getDate();
	}

	const showPopconfirm = () => {
		setVisible(true);
	};

	const handleCancel = () => {
		setVisible(false);
	};

	const renderTitle = () => {
		return (
			<p className="font-weight-blue">
				Xác nhận tình lương từ 01-{params.Month}-{params.Year} đến {daysInMonth(params.Month, params.Year)}-{params.Month}-
				{params.Year} ?
			</p>
		);
	};

	useEffect(() => {
		getDataPayroll(currentPage);
	}, [params, userInformation]);

	function parseJwt(token) {
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		var jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join('')
		);

		return JSON.parse(jsonPayload);
	}

	return (
		<PowerTable
			currentPage={currentPage}
			loading={isLoading}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			addClass="basic-header"
			TitlePage="Bảng lương nhân viên"
			dataSource={payRoll}
			columns={columns}
			TitleCard={
				roleID == 5 && (
					<Popconfirm
						title={renderTitle}
						visible={visible}
						onConfirm={postSalaryOfTeacherClosing}
						onCancel={handleCancel}
						okButtonProps={{ loading: isLoading.status }}
					>
						<button onClick={showPopconfirm} className="btn btn-warning add-new">
							Tính lương tháng trước
						</button>
					</Popconfirm>
				)
			}
			Extra={
				<div className="extra-table">
					<Select
						onChange={onChangeMonth}
						style={{ width: 200 }}
						disabled={false}
						className="style-input"
						defaultValue={months[new Date().getMonth() - 1]}
					>
						{months.map((item, index) => (
							<Option key={index} value={index + 1}>
								{item}
							</Option>
						))}
					</Select>
					{roleID == 5 && <SortBox space={true} width={200} handleSort={onSort} dataOption={sortOptionList} />}
				</div>
			}
		/>
	);
};
SalaryStaffReview.layout = LayoutBase;
export default SalaryStaffReview;
