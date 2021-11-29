import { InputNumber, Spin, Tooltip, Select, Popconfirm, Input, Dropdown, Card } from 'antd';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'react-feather';
import { payRollApi } from '~/apiBase/staff-manage/pay-roll';
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
import SalaryOfTeacherDetail from '../../../components/Global/Teacher/TeacherSalary/salary-of-teacher-detail';
import TecherFixExam from '../../../components/Global/Teacher/TeacherSalary/teacher-fix-exam';
import ConfirmForm from '../../../components/Global/Teacher/TeacherSalary/confirm-form';
import { isBuffer } from 'util';
import { EllipsisOutlined } from '@ant-design/icons';

const SalaryReview = () => {
	const [totalPage, setTotalPage] = useState(null);
	const [visible, setVisible] = React.useState(false);
	const [dropDownVisible, setDropDownVisible] = useState(false);
	const [payRoll, setPayRoll] = useState<ITeacherSalary[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const { showNoti, userInformation, pageSize } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	});
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
	const { Option } = Select;
	const paramDefault = {
		pageIndex: currentPage,
		pageSize: pageSize,
		// selectAll: true,
		Year: new Date().getFullYear(),
		Month: new Date().getMonth(),
		TeacherName: null,
		TeacherID: null,
		StatusID: null,
		sort: null,
		sortType: null
	};
	const [params, setParams] = useState(paramDefault);

	let listFieldSearch = {
		pageIndex: 1,
		TeacherName: null
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

	const columns = [
		{
			title: 'Giáo viên',
			width: 150,
			dataIndex: 'TeacherName',
			render: (price, record: ITeacherSalary) => <p className="font-weight-primary">{price}</p>,
			...FilterColumn('TeacherName', onSearch, handleReset, 'text')
		},
		{
			title: 'Năm',
			width: 80,
			dataIndex: 'Year',
			render: (price, record: ITeacherSalary) => <p>{price}</p>
		},
		{
			title: 'Tháng',
			width: 80,
			dataIndex: 'Month',
			render: (price, record: ITeacherSalary) => <p>{price}</p>
		},
		{
			title: 'Thưởng',
			width: 150,
			dataIndex: 'Bonus',
			render: (price, record: ITeacherSalary) => <p className="font-weight-green">{numberWithCommas(price)}</p>
		},
		{
			title: 'Ghi Chú',
			width: 107,
			dataIndex: 'NoteBonus',
			render: (price, record: any) => <p>{price}</p>
		},
		{
			title: 'Trạng Thái',
			width: 200,
			dataIndex: 'StatusName',
			filters: [
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
			title: 'Lương tạm ứng',
			width: 150,
			dataIndex: 'AdvanceSalary',
			render: (price, record: ITeacherSalary) => <p className="font-weight-primary">{numberWithCommas(price)}</p>
		},
		{
			title: 'Lương cơ bản',
			width: 150,
			dataIndex: 'BasicSalary',
			render: (price, record: ITeacherSalary) => <p className="font-weight-green">{numberWithCommas(price)}</p>
		},
		{
			title: 'Lương Tháng',
			width: 150,
			dataIndex: 'Salary',
			render: (price, record: ITeacherSalary) => <SalaryOfTeacherDetail price={price} record={record} />
		},
		{
			title: 'Lương Chấm Bài',
			width: 150,
			dataIndex: 'SalaryFixExam',
			render: (price, record: ITeacherSalary) => <TecherFixExam price={price} record={record} />
		},
		{
			title: 'Lương Tổng',
			width: 150,
			dataIndex: 'TotalSalary',
			render: (price, record: ITeacherSalary) => <p className="font-weight-green">{numberWithCommas(price)}</p>
		},
		{
			title: 'Cập Nhật',
			width: 100,
			render: (text, record) => (
				<ConfirmForm
					isLoading={isLoading}
					record={record}
					userInformationID={userInformation.UserInformationID}
					setParams={setParams}
					params={params}
				/>
			)
		}
	];

	const getDataPayroll = async (page: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await teacherSalaryApi.getAll({ ...params, pageIndex: page });
			if (res.status == 200) {
				setPayRoll(res.data.data);
				setTotalPage(res.data.totalRow);
				setDropDownVisible(false);
			}
			if (res.status == 204) {
				setPayRoll([]);
				setDropDownVisible(false);
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
			let res = await teacherSalaryApi.postSalaryClosing();
			if (res.status == 200) {
				setParams({ ...params });
				showNoti('success', 'Thành công!');
				setDropDownVisible(false);
			}
			if (res.status == 204) {
				showNoti('success', 'Lương đã được tính rồi!');
				setDropDownVisible(false);
			}
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
		console.log(value);
		setParams({ ...params, Month: Number(value) });
	};

	function daysInMonth(month, year) {
		return new Date(year, month, 0).getDate();
	}

	const showPopconfirm = () => {
		setVisible(true);
	};

	const handleCancel = () => {
		console.log('Clicked cancel button');
		setVisible(false);
	};

	const renderTitle = () => {
		return (
			<p className="font-weight-primary">
				Xác nhận tính lương từ 01-{params.Month}-{params.Year} đến {daysInMonth(params.Month, params.Year)}-{params.Month}-
				{params.Year} ?
			</p>
		);
	};

	const menu = () => {
		return (
			<>
				<div className="d-md-none">
					<Card title="Thao tác" style={{ width: 300 }}>
						<Popconfirm
							title={renderTitle}
							visible={visible}
							className="style-input w-100 mb-4"
							onConfirm={postSalaryOfTeacherClosing}
							onCancel={handleCancel}
							okButtonProps={{ loading: isLoading.status }}
						>
							<button onClick={showPopconfirm} className="btn btn-warning add-new">
								Tính lương tháng trước
							</button>
						</Popconfirm>
						<Select
							onChange={onChangeMonth}
							style={{ width: 200 }}
							disabled={false}
							className="style-input w-100 mb-4"
							defaultValue={months[new Date().getMonth() - 1]}
						>
							{months.map((item, index) => (
								<Option key={index} value={index + 1}>
									{item}
								</Option>
							))}
						</Select>
						<div className="d-md-none">
							<SortBox space={false} width={278} handleSort={onSort} dataOption={sortOptionList} />
						</div>
					</Card>
				</div>
			</>
		);
	};

	useEffect(() => {
		getDataPayroll(currentPage);
	}, [params]);

	return (
		<PowerTable
			currentPage={currentPage}
			loading={isLoading}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			addClass="basic-header"
			TitlePage="Duyệt lương giáo viên"
			dataSource={payRoll}
			columns={columns}
			TitleCard={
				<>
					<div className="d-none d-sm-inline-block">
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
					</div>
					<div className="d-inline-block d-sm-none col-md-3 w-25">
						<Dropdown overlay={menu} trigger={['click']} visible={dropDownVisible}>
							<a
								className="ant-dropdown-link"
								onClick={(e) => {
									e.preventDefault();
									setDropDownVisible(!dropDownVisible);
								}}
							>
								<EllipsisOutlined />
							</a>
						</Dropdown>
					</div>
				</>
			}
			Extra={
				<div className="extra-table d-none d-sm-inline-block">
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
					<SortBox space={true} width={200} handleSort={onSort} dataOption={sortOptionList} />
				</div>
			}
		/>
	);
};
SalaryReview.layout = LayoutBase;
export default SalaryReview;
