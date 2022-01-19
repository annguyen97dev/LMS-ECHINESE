import { InputNumber, Spin, Tooltip, Select, Popconfirm, DatePicker } from 'antd';
import moment from 'moment';
import React, { Fragment, useEffect, useState } from 'react';
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
import ConfirmForm from '../../../components/Global/Teacher/TeacherSalary/teacher-confirm-form';
import TecherFixExam from '../../../components/Global/Teacher/TeacherSalary/teacher-fix-exam';

const now = new Date();

const SalaryReview = () => {
	const [totalPage, setTotalPage] = useState(null);
	const [payRoll, setPayRoll] = useState<ITeacherSalary[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const { showNoti, userInformation, pageSize } = useWrap();
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

	const getLastYear = () => {
		return now.getMonth() == 0 ? now.getFullYear() - 1 : now.getFullYear();
	};

	const getDateNumber = (number) => {
		return number > 10 ? number : number == 0 ? '12' : '0' + number;
	};

	const paramDefault = {
		pageIndex: currentPage,
		pageSize: pageSize,
		sortType: true,
		selectAll: true,
		Year: getLastYear(),
		Month: getDateNumber(now.getMonth()),
		TeacherName: null,
		TeacherID: null,
		StatusID: null
	};
	const [params, setParams] = useState(paramDefault);

	const columns = [
		{
			title: 'Giáo viên',
			width: 150,
			dataIndex: 'TeacherName',
			render: (price, record: ITeacherSalary) => <p className="font-weight-primary">{price}</p>
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
			render: (price, record: ITeacherSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Ghi Chú',
			width: 113,
			dataIndex: 'NoteBonus',
			render: (price, record: any) => <p>{price}</p>
		},
		{
			title: 'Trạng Thái',
			width: 200,
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
			title: 'Trừ tạm ứng',
			width: 150,
			dataIndex: 'AdvanceSalary',
			render: (price, record: ITeacherSalary) => <p>{price}</p>
		},
		{
			title: 'Lương cơ bản',
			width: 150,
			dataIndex: 'BasicSalary',
			render: (price, record: ITeacherSalary) => <p>{numberWithCommas(price)}</p>
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
			render: (price, record: ITeacherSalary) => <p>{numberWithCommas(price)}</p>
		},
		{
			title: 'Cập Nhật',
			width: 100,
			render: (text, record) => <ConfirmForm isLoading={isLoading} record={record} setParams={setParams} params={params} />
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
			let res = await teacherSalaryApi.postSalaryClosing();
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
		console.log(value);
		setParams({ ...params, Month: Number(value.getMonth() + 1), Year: Number(value.getFullYear()) });
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
				Xác nhận tình lương từ 01-{params.Month}-{params.Year} đến {daysInMonth(params.Month, params.Year)}-{params.Month}-
				{params.Year} ?
			</p>
		);
	};

	useEffect(() => {
		// if (userInformation) {
		// 	getDataPayroll(currentPage);
		// }
		getDataPayroll(currentPage);
	}, [params, userInformation]);

	// useEffect(() => {
	// 	if (userInformation) {
	// 		setParams({
	// 			...params,
	// 			TeacherID: userInformation.UserInformationID
	// 		});
	// 	}
	// }, [userInformation]);

	return (
		<PowerTable
			currentPage={currentPage}
			loading={isLoading}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			addClass="basic-header"
			TitlePage="Bảng lương giáo viên"
			dataSource={payRoll}
			columns={columns}
			Extra={
				<DatePicker
					defaultValue={moment(new Date(getLastYear() + '-' + getDateNumber(now.getMonth())), 'MM/yyyy')}
					onChange={(e, a) => {
						// @ts-ignore
						onChangeMonth(e._d);
					}}
					picker="month"
					style={{ borderRadius: 6, height: 34 }}
				/>
			}
		/>
	);
};
SalaryReview.layout = LayoutBase;
export default SalaryReview;
