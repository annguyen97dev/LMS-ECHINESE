import React, { useEffect, useState } from 'react';
import { teacherApi } from '~/apiBase';
import { payrollFixApi } from '~/apiBase/package/payroll-fix';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import SortBox from '~/components/Elements/SortBox';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import { numberWithCommas } from '~/utils/functions';

const PayrollFix = () => {
	let listFieldFilter = {
		pageIndex: 1,
		fromDate: null,
		toDate: null,
		TeacherID: null,
		StatusID: null,
		Month: null,
		Year: null
	};
	const dataOption = [
		{
			dataSort: {
				sort: 0,
				sortType: true
			},
			text: 'Tên A-Z'
		},
		{
			dataSort: {
				sort: 0,
				sortType: false
			},
			text: 'Tên Z-A'
		},
		{
			dataSort: {
				sort: 1,
				sortType: true
			},
			text: 'Level A-Z'
		},
		{
			dataSort: {
				sort: 1,
				sortType: false
			},
			text: 'Level Z-A'
		}
	];

	let listFieldSearch = {
		pageIndex: 1,
		TeacherName: null
	};

	// ------ LIST FILTER -------
	function generateArrayOfYears() {
		var max = new Date().getFullYear();
		var min = max - 9;
		var years = [];

		for (var i = max; i >= min; i--) {
			years.push({
				title: i,
				value: i
			});
		}
		return years;
	}

	function listMonth() {
		let months = [];
		for (let i = 1; i < 13; i++) {
			months.push({
				title: `Tháng ${i}`,
				value: i
			});
		}
		return months;
	}

	const [dataFilter, setDataFilter] = useState([
		{
			name: 'TeacherID',
			title: 'Giáo viên',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: null, // Gọi api xong trả data vào đây
			value: null
		},
		{
			name: 'StatusID',
			title: 'Trạng thái',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: [
				{
					title: 'Chưa chốt',
					value: 1
				},
				{
					title: 'Đã chốt lương',
					value: 2
				}
			],
			value: null
		},
		{
			name: 'Month',
			title: 'Tháng',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: listMonth(),
			value: null
		},
		{
			name: 'Year',
			title: 'Năm',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: generateArrayOfYears()
		},
		{
			name: 'date-range',
			title: 'Từ - đến',
			col: 'col-12',
			type: 'date-range',
			value: null
		}
	]);

	const [dataTeacher, setDataTeacher] = useState<ITeacher[]>([]);
	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<IPayrollFix[]>([]);
	const { showNoti, pageSize, userInformation } = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: currentPage,
		sort: null,
		sortType: null,
		fromDate: null,
		toDate: null,
		TeacherID: null,
		StatusID: null,
		Month: null,
		Year: null,
		TeacherName: null
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	// GET DATA TEACHER
	const getDataTeacher = async () => {
		try {
			let res = await teacherApi.getAll({ selectAll: true, StatusID: 0, RoleID: 2 });
			if (res.status == 200) {
				const newData = res.data.data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}));
				setDataFunc('TeacherID', newData);
			}
		} catch (error) {
			console.log('Error Teacher: ', error.message);
		}
	};

	// GET DATA SOURCE
	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});

		try {
			let res = await payrollFixApi.getAll(todoApi);
			res.status == 200 && (setDataSource(res.data.data), setTotalPage(res.data.totalRow));

			res.status == 204 && (showNoti('danger', 'Không có dữ liệu'), setDataSource([]));
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	const onFetchData = () => {
		setCurrentPage(1);
		setTodoApi(listTodoApi);
	};

	const onUpdateData = (index) => {
		setTodoApi({ ...todoApi });
	};

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			pageIndex: pageNumber
		});
	};

	// --------------- HANDLE SORT ----------------------
	const handleSort = (option) => {
		let newTodoApi = {
			...listTodoApi,
			pageIndex: 1,
			sort: option.title.sort,
			sortType: option.title.sortType
		};
		setCurrentPage(1), setTodoApi(newTodoApi);
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

	// -------------- HANDLE FILTER ------------------
	const handleFilter = (listFilter) => {
		console.log('List Filter: ', listFilter);
		let newListFilter = { ...listFieldFilter };
		listFilter.forEach((item, index) => {
			let key = item.name;
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = item.value;
				}
			});
		});
		setTodoApi({ ...listTodoApi, ...newListFilter, pageIndex: 1 });
	};

	const handleReset = () => {
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		});
		setCurrentPage(1);
	};

	// -------------- CHECK FIELD ---------------------
	const checkField = (valueSearch, dataIndex) => {
		let newList = { ...listFieldSearch };
		Object.keys(newList).forEach(function (key) {
			console.log('key: ', key);
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

	// ------------ ON SEARCH -----------------------
	const onSearch = (valueSearch, dataIndex) => {
		let clearKey = checkField(valueSearch, dataIndex);

		setTodoApi({
			...todoApi,
			...clearKey
		});
	};

	const columns = [
		{
			title: 'Giáo viên',
			dataIndex: 'TeacherName',
			render: (text) => <p className="font-weight-primary">{text}</p>,
			...FilterColumn('TeacherName', onSearch, handleReset, 'text')
		},

		{
			title: 'Số lượt chấm',
			dataIndex: 'Amount',
			align: 'center'
		},
		{
			title: 'Số tiền',
			dataIndex: 'Salary',
			render: (value) => <p className="font-weight-black">{numberWithCommas(value)}</p>
		},
		{
			title: 'Thời gian chốt lương',
			render: (text, data) => <p>{data.Month + '/' + data.Year}</p>
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusID',
			render: (status) => {
				return (
					<>
						{status == 1 && <span className="tag gray">Chưa chốt lương</span>}
						{status == 2 && <span className="tag green">Đã chốt lương</span>}
					</>
				);
			}
		},
		{
			title: 'Thời gian thanh toán',
			dataIndex: 'PaymentDate'
		}
	];

	useEffect(() => {
		getDataSource();
		getDataTeacher();
	}, [todoApi]);

	return (
		<>
			<PowerTable
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				addClass="basic-header"
				TitlePage="Bảng lương chấm bài"
				TitleCard={null}
				dataSource={dataSource}
				columns={columns}
				Extra={
					<div className="extra-table">
						<FilterBase
							dataFilter={dataFilter}
							handleFilter={(listFilter: any) => handleFilter(listFilter)}
							handleReset={handleReset}
						/>
						<SortBox handleSort={(value) => handleSort(value)} dataOption={dataOption} />
					</div>
				}
			/>
		</>
	);
};

export default PayrollFix;
