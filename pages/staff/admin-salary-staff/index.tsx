import React, { useRef, useEffect, useState } from 'react';
import { DatePicker, Tooltip, Select, Popconfirm, Dropdown, Card, Spin } from 'antd';
import { staffSalaryApi } from '~/apiBase/staff-manage/staff-salary';
import SortBox from '~/components/Elements/SortBox';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import { numberWithCommas } from '~/utils/functions';
import ConfirmForm from '../../../components/Global/StaffList/StaffSalary/admin-confirm-salary';
import { Input } from 'antd';
import { Form } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import moment from 'moment';
import XLSX from 'xlsx';

const now = new Date();

const SalaryReview = () => {
	const [totalPage, setTotalPage] = useState(null);
	const [visible, setVisible] = React.useState(false);
	const [dropDownVisible, setDropDownVisible] = useState(false);
	const [payRoll, setPayRoll] = useState<IStaffSalary[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const { showNoti, userInformation, pageSize } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	});
	const [workDays, setWorkDays] = useState({
		days: 0,
		messError: ''
	});

	const getLastYear = () => {
		return now.getMonth() == 0 ? now.getFullYear() - 1 : now.getFullYear();
	};

	const getDateNumber = (number) => {
		return number > 10 ? number : number == 0 ? '12' : '0' + number;
	};

	const paramDefault = {
		pageIndex: currentPage,
		pageSize: pageSize,
		Year: getLastYear(),
		Month: getDateNumber(now.getMonth()),
		StaffName: null,
		StaffID: null,
		// selectAll: true,
		StatusID: null,
		sort: null,
		sortType: null
	};

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

	const [params, setParams] = useState(paramDefault);

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
	};

	const columns = [
		{
			title: 'Nhân viên',
			width: 150,
			dataIndex: 'StaffName',
			render: (price, record: IStaffSalary) => <p className="font-weight-primary">{price}</p>,
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
			title: 'Thưởng',
			width: 150,
			dataIndex: 'Bonus',
			render: (price, record: IStaffSalary) => <p className="font-weight-green">{numberWithCommas(price)}</p>
		},
		{
			title: 'Ghi Chú',
			width: 160,
			dataIndex: 'NoteBonus',
			render: (price, record: any) => (
				<Tooltip title={price} className="limit-text">
					<p>{price}</p>
				</Tooltip>
			)
		},
		{
			title: 'Ngày nghỉ',
			width: 90,
			dataIndex: 'CountOff',
			render: (price, record: any) => <p>{price}</p>
		},
		{
			title: 'Lương ngày nghỉ',
			width: 150,
			dataIndex: 'SalaryOff',
			render: (price, record: any) => <p className="font-weight-primary">{numberWithCommas(price)}</p>
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
			title: 'Lương cơ bản',
			width: 150,
			dataIndex: 'BasicSalary',
			render: (price, record: IStaffSalary) => <p className="font-weight-green">{numberWithCommas(price)}</p>
		},
		{
			title: 'Trừ tạm ứng',
			width: 150,
			dataIndex: 'AdvanceSalary',
			render: (price, record: IStaffSalary) => <p className="font-weight-primary">{numberWithCommas(price)}</p>
		},
		{
			title: 'Lương Tổng',
			width: 150,
			dataIndex: 'TotalSalary',
			render: (price, record: IStaffSalary) => <p className="font-weight-green">{numberWithCommas(price)}</p>
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
			let res = await staffSalaryApi.getAll({ ...params, pageIndex: page });
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
			let res = await staffSalaryApi.postSalaryClosing(workDays.days);
			setParams({ ...params });
			if (res.status == 200) {
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
		setParams({ ...params, Month: Number(value.getMonth() + 1), Year: Number(value.getFullYear()) });
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
			<p className="font-weight-primary">
				Xác nhận tính lương từ 01-{getDateNumber(now.getMonth())}-{getLastYear()} đến{' '}
				{daysInMonth(getDateNumber(now.getMonth()), getLastYear())}-{getDateNumber(now.getMonth())}-{getLastYear()} ?
			</p>
		);
	};

	const menu = () => {
		return (
			<div className=" d-xl-none">
				<Card title="Thao tác" style={{ width: 300 }}>
					<Input
						onChange={(event) => {
							setWorkDays({ ...workDays, days: Number(event.target.value) });
						}}
						className="style-input w-100 mb-4"
						name="wordDays"
						placeholder="Nhập ngày công"
					/>

					{userInformation && (userInformation.RoleID === 1 || userInformation.RoleID === 2) && (
						<button
							className="btn btn-success mb-4 w-100"
							disabled={isLoading.type === 'EXCEL' && isLoading.status}
							onClick={() => {
								exportExcelFile();
							}}
						>
							{isLoading.type === 'EXCEL' && isLoading.status ? <Spin /> : 'Xuất file Excel'}
						</button>
					)}

					<Popconfirm
						className="w-100 mb-4"
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
					<DatePicker
						className="w-100 style-input mb-4"
						defaultValue={moment(new Date(getLastYear() + '-' + getDateNumber(now.getMonth())), 'MM/yyyy')}
						onChange={(e, a) => {
							// @ts-ignore
							onChangeMonth(e._d);
						}}
						picker="month"
					/>
					<div className="w-100 d-md-none">
						<SortBox space={false} width={278} handleSort={onSort} dataOption={sortOptionList} />
					</div>
				</Card>
			</div>
		);
	};

	const exportExcelFile = async () => {
		setIsLoading({ type: 'EXCEL', status: true });
		try {
			let res = await staffSalaryApi.exportExcel({ year: params.Year, month: params.Month });
			if (res.status === 200) {
				let temp = [];
				res.data.data.forEach((item, index) =>
					temp.push({
						A: index + 1,
						B: item.BankAccountNumber,
						C: item.BankAccountHolderName,
						D: `${item.Bank}/${item.BankBranch}`,
						E: item.Salary,
						F: item.Reason,
						G: item.RoleName
					})
				);
				createExcelFile1(temp);
			}
			if (res.status === 204) {
				showNoti('danger', 'Không có dự liệu lương!');
			}
		} catch (error) {
		} finally {
			setIsLoading({ type: 'EXCEL', status: false });
		}
	};

	const createExcelFile1 = async (data) => {
		let wb = XLSX.utils.book_new();

		/* Initial row */
		var ws = XLSX.utils.json_to_sheet([], {
			header: ['DANH SÁCH GIAO DỊCH (LIST OF TRANSACTIONS)'],
			skipHeader: false
		});
		/* Write data starting at E2 */
		XLSX.utils.sheet_add_json(
			ws,
			[
				{
					A: 'STT (1)',
					B: 'Số  Số tài khoản (2)',
					C: 'Tên đơn vị thụ hưởng (3)',
					D: 'Ngân hàng thụ hưởng/Chi nhánh (4)',
					E: 'Số tiền (5)',
					F: 'Chi tiết thanh toán (6)',
					G: 'Chức vụ (7)'
				}
			],
			{ skipHeader: true, origin: 'A2' }
		);

		/* Write data starting at A2 */
		XLSX.utils.sheet_add_json(ws, data, { skipHeader: true, origin: 'A3' });

		// set width
		let wscols = [{ wch: 8 }, { wch: 20 }, { wch: 22 }, { wch: 32 }, { wch: 18 }, { wch: 24 }, { wch: 22 }, { wch: 22 }];
		let wsrows = [{ hpt: 22 }];
		ws['!cols'] = wscols;
		ws['!rows'] = wsrows;
		// });
		XLSX.utils.book_append_sheet(wb, ws, 'Bảng lương nhân viên');
		XLSX.writeFile(wb, 'bangluong.xlsx', { type: 'binary', bookType: 'xlsx' });
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
			TitlePage="Duyệt lương nhân viên"
			dataSource={payRoll}
			columns={columns}
			TitleCard={
				<>
					<div className="d-none d-xl-inline-block">
						<div className="d-flex justify-content-end align-items-center ">
							{userInformation && (userInformation.RoleID === 1 || userInformation.RoleID === 2) && (
								<button
									className="btn btn-success mr-1"
									style={{ width: 130 }}
									disabled={isLoading.type === 'EXCEL' && isLoading.status}
									onClick={() => {
										exportExcelFile();
									}}
								>
									{isLoading.type === 'EXCEL' && isLoading.status ? <Spin /> : 'Xuất file Excel'}
								</button>
							)}

							<Input
								onChange={(event) => {
									setWorkDays({ ...workDays, days: Number(event.target.value) });
								}}
								className="style-input"
								style={{ width: 150, marginRight: 5 }}
								name="wordDays"
								placeholder="Nhập ngày công"
							/>

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
					</div>
					<div className="d-inline-block d-xl-none col-md-3 w-25">
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
				<div className="d-none d-md-inline-block">
					<div className="extra-table">
						<DatePicker
							defaultValue={moment(new Date(getLastYear() + '-' + getDateNumber(now.getMonth())), 'MM/yyyy')}
							onChange={(e, a) => {
								// @ts-ignore
								onChangeMonth(e._d);
							}}
							picker="month"
						/>
						<SortBox space={true} width={200} handleSort={onSort} dataOption={sortOptionList} />
					</div>
				</div>
			}
		/>
	);
};
SalaryReview.layout = LayoutBase;
export default SalaryReview;
