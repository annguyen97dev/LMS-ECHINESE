import { InputNumber, Spin } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { payRollApi } from '~/apiBase/staff-manage/pay-roll';
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

const SalaryReview = () => {
	const { showNoti, pageSize } = useWrap();
	const onSearch = (data) => {
		setCurrentPage(1);
		setParams({
			...listParamsDefault,
			FullNameUnicode: data
		});
	};

	const handleReset = () => {
		setCurrentPage(1);
		setParams(listParamsDefault);
	};
	const columns = [
		{
			title: 'Nhân viên',
			dataIndex: 'FullNameUnicode',
			...FilterColumn('FullNameUnicode', onSearch, handleReset, 'text'),
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'Mobile'
		},
		{
			title: 'Role',
			dataIndex: 'RoleName',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Loại lương',
			dataIndex: 'styleName',
			render: (type) => (
				<Fragment>
					{type == 'Lương theo tháng' && <span className="tag blue">{type}</span>}
					{type == 'Lương theo giờ' && <span className="tag green">{type}</span>}
				</Fragment>
			)
		},
		{
			title: 'Lương tháng',
			render: (text) => (
				<p className="font-weight-primary">
					{text.Month}-{text.Year}
				</p>
			)
		},
		{
			title: 'Số giờ dạy',
			dataIndex: 'TeachingTime'
		},
		{
			title: 'Lương',
			dataIndex: 'ActualSalary',
			render: (price) => numberWithCommas(price)
		},
		{
			title: 'Thưởng',
			dataIndex: 'Bonus',
			render: (price) => numberWithCommas(price) || 0
		},
		{
			title: 'Tổng lương',
			dataIndex: 'TotalSalary',
			render: (price, record: IPayRoll) => (
				<p className="font-weight-primary">
					{price ? numberWithCommas(price) : numberWithCommas(record.ActualSalary + record.Bonus)}
				</p>
			)
		}
	];
	const [currentPage, setCurrentPage] = useState(1);

	const listParamsDefault = {
		pageSize: pageSize,
		pageIndex: currentPage,
		sort: null,
		sortType: null,
		fromDate: null,
		toDate: null,
		FullNameUnicode: null,
		RoleID: null,
		Month: null,
		Year: null,
		Style: null
	};

	const sortOption = [
		{
			dataSort: {
				sort: 0,
				sortType: true
			},
			value: 1,
			text: 'Tên tăng dần'
		},
		{
			dataSort: {
				sort: 0,
				sortType: false
			},
			value: 2,
			text: 'Tên giảm dần'
		},
		{
			dataSort: {
				sort: 1,
				sortType: true
			},
			value: 3,
			text: 'Số giờ dạy tăng dần'
		},
		{
			dataSort: {
				sort: 1,
				sortType: false
			},
			value: 4,
			text: 'Số giờ dạy giảm dần'
		},
		{
			dataSort: {
				sort: 2,
				sortType: true
			},
			value: 5,
			text: 'Tổng lương tăng dần'
		},
		{
			dataSort: {
				sort: 2,
				sortType: false
			},
			value: 6,
			text: 'Tổng lương giảm dần'
		}
	];

	const [dataFilter, setDataFilter] = useState([
		{
			name: 'RoleID',
			title: 'Chọn Role',
			col: 'col-12',
			type: 'select',
			optionList: null,
			value: null
		},
		{
			name: 'Month',
			title: 'Tháng',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: month,
			value: null
		},
		{
			name: 'Year',
			title: 'Năm',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: year,
			value: null
		},
		{
			name: 'Style',
			title: 'Loại lương',
			col: 'col-12',
			type: 'select',
			optionList: [
				{
					value: 1,
					title: 'Lương theo tháng'
				},
				{
					value: 2,
					title: 'Lương theo giờ'
				}
			],
			value: null
		},
		{
			name: 'date-range',
			title: 'Ngày tạo',
			col: 'col-12',
			type: 'date-range',
			value: null
		}
	]);

	const handleFilter = (listFilter) => {
		let newListFilter = {
			pageIndex: 1,
			fromDate: null,
			toDate: null,
			RoleID: null,
			Style: null,
			Month: null,
			Year: null
		};
		listFilter.forEach((item, index) => {
			let key = item.name;
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = item.value;
				}
			});
		});
		setParams({ ...listParamsDefault, ...newListFilter, pageIndex: 1 });
	};

	const handleSort = async (option) => {
		setParams({
			...listParamsDefault,
			sortType: option.title.sortType
		});
	};

	const [params, setParams] = useState(listParamsDefault);

	const [totalPage, setTotalPage] = useState(null);
	const [payRoll, setPayRoll] = useState<IPayRoll[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	});

	const [loadingSalaryDate, setLoadingSalaryDate] = useState(false);
	const [salaryDate, setSalaryDate] = useState(1);

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

	const getDataRole = () => {
		const newData = Roles.map((item) => ({
			title: item.RoleName,
			value: item.id
		}));
		setDataFunc('RoleID', newData);
	};

	useEffect(() => {
		getDataRole();
	}, []);

	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setParams({
			...params,
			pageIndex: currentPage
		});
	};

	const getDataPayRoll = (page: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await payRollApi.getAll({ ...params, pageIndex: page });
				//@ts-ignore
				res.status == 200 && setPayRoll(res.data.data);
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
					status: false
				});
			}
		})();
	};

	const getDataSalaryDate = () => {
		setLoadingSalaryDate(true);
		(async () => {
			try {
				let res = await payRollApi.closingSalarDate();
				//@ts-ignore
				res.status == 200 && setSalaryDate(res.data.data.Date);
				if (res.status == 204) {
					showNoti('danger', 'Không tìm thấy dữ liệu ngày tính lương!');
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setLoadingSalaryDate(false);
			}
		})();
	};

	useEffect(() => {
		getDataSalaryDate();
	}, []);

	const handleChangeSalaryDate = (value: any) => {
		setLoadingSalaryDate(true);
		let date = { Date: value };
		(async () => {
			try {
				//@ts-ignore
				let res = await payRollApi.changClosingSalarDate(date);
				showNoti('success', 'Cập nhật ngày tính lương thành công!!');
				setLoadingSalaryDate(false);
				getDataSalaryDate();
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setLoadingSalaryDate(false);
			}
		})();
	};
	const onDebounceChangeSalaryDate = useDebounce(handleChangeSalaryDate, 300, []);
	useEffect(() => {
		getDataPayRoll(currentPage);
	}, [params]);
	return (
		<PowerTable
			currentPage={currentPage}
			loading={isLoading}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			addClass="basic-header"
			TitlePage="Duyệt lương office"
			dataSource={payRoll}
			columns={columns}
			TitleCard={
				<div className="d-flex align-items-center justify-content-end ">
					<div className="font-weight-black">Ngày tính lương: </div>
					<InputNumber
						style={{ width: '100px', marginLeft: '10px' }}
						className="style-input"
						onChange={(value: number) => {
							onDebounceChangeSalaryDate(value);
							setSalaryDate(value);
						}}
						value={salaryDate}
						min={1}
						max={28}
					/>
					<Spin style={{ marginLeft: '10px' }} spinning={loadingSalaryDate} />
				</div>
			}
			Extra={
				<div className="extra-table">
					<FilterBase
						dataFilter={dataFilter}
						handleFilter={(listFilter: any) => handleFilter(listFilter)}
						handleReset={handleReset}
					/>

					<SortBox dataOption={sortOption} handleSort={(value) => handleSort(value)} />
				</div>
			}
		/>
	);
};
SalaryReview.layout = LayoutBase;
export default SalaryReview;
