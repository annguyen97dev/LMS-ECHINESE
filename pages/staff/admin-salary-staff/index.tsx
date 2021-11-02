import { InputNumber, Spin, Tooltip, Select, Popconfirm } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
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
import ConfirmForm from '../../../components/Global/StaffList/StaffSalary/admin-confirm-salary';

const SalaryReview = () => {
	const [totalPage, setTotalPage] = useState(null);
	const [visible, setVisible] = React.useState(false);
	const [payRoll, setPayRoll] = useState<IStaffSalary[]>([]);
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
		sortType: true,
		selectAll: true,
		sort: null,
		Year: new Date().getFullYear(),
		Month: new Date().getMonth() + 1,
		StaffName: null,
		StaffID: null,
		StatusID: null
	};
	const [params, setParams] = useState(paramDefault);

	const columns = [
		{
			title: 'Nhân viên',
			dataIndex: 'StaffName',
			render: (price, record: IStaffSalary) => <p className="font-weight-blue">{price}</p>
		},
		{
			title: 'Năm',
			dataIndex: 'Year',
			render: (price, record: IStaffSalary) => <p>{price}</p>
		},
		{
			title: 'Tháng',
			dataIndex: 'Month',
			render: (price, record: IStaffSalary) => <p>{price}</p>
		},
		{
			title: 'Thưởng',
			dataIndex: 'Bonus',
			render: (price, record: IStaffSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Ghi Chú',
			dataIndex: 'NoteBonus',
			render: (price, record: any) => <p>{price}</p>
		},
		{
			title: 'Ngày nghỉ',
			dataIndex: 'CountOff',
			render: (price, record: any) => <p>{price}</p>
		},
		{
			title: 'Trạng Thái',
			dataIndex: 'StatusName',
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
			dataIndex: 'AdvanceSalary',
			render: (price, record: IStaffSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Lương Tháng',
			dataIndex: 'Salary',
			render: (price, record: IStaffSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Lương Tổng',
			dataIndex: 'TotalSalary',
			render: (price, record: IStaffSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Cập Nhật',
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
			console.log(res);
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
			}
			Extra={
				<Select
					onChange={onChangeMonth}
					disabled={false}
					style={{ width: 200 }}
					className="style-input"
					defaultValue={months[new Date().getMonth()]}
				>
					{months.map((item, index) => (
						<Option key={index} value={index + 1}>
							{item}
						</Option>
					))}
				</Select>
			}
		/>
	);
};
SalaryReview.layout = LayoutBase;
export default SalaryReview;
