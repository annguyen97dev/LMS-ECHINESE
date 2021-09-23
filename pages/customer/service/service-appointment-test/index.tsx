import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { branchApi, studentApi, testCustomerApi } from '~/apiBase';
import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import SortBox from '~/components/Elements/SortBox';
import ExpandTable from '~/components/ExpandTable';
import TestCustomerForm from '~/components/Global/Customer/Service/TestCustomerForm';
import LayoutBase from '~/components/LayoutBase';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import TestCustomerPoint from './TestCustomerPoint';

let pageIndex = 1;

let listFieldSearch = {
	pageIndex: 1,
	FullNameUnicode: null,
};

let listFieldFilter = {
	pageIndex: 1,
	BranchID: null, // lọc
	UserInformationID: null,
	Status: null,
	AppointmentDate: null,
};

const listTodoApi = {
	pageSize: 10,
	pageIndex: pageIndex,
	sort: null,
	sortType: null,
	FullNameUnicode: null,
	BranchID: null, // lọc
	UserInformationID: null,
	Status: null,
	AppointmentDate: null,
};

const dataOption = [
	{
		dataSort: {
			sort: 2,
			sortType: true,
		},
		text: 'Tên A - Z ',
	},
	{
		dataSort: {
			sort: 2,
			sortType: false,
		},
		text: 'Tên Z - A',
	},

	{
		dataSort: {
			sort: 0,
			sortType: true,
		},
		text: 'Ngày hẹn A - Z',
	},
	{
		dataSort: {
			sort: 0,
			sortType: false,
		},
		text: 'Ngày hẹn Z - A',
	},
];

// -- FOR DIFFERENT VIEW --
interface optionObj {
	title: string;
	value: number;
}

interface studentObj {
	title: string;
	value: number;
	counselorsName: string;
}

interface listDataForm {
	Branch: Array<optionObj>;
	Student: Array<studentObj>;
}

const listApi = [
	{
		api: branchApi,
		text: 'Trung tâm',
		name: 'Branch',
	},
	{
		api: studentApi,
		text: 'Học viên',
		name: 'Student',
	},
];

export default function AppointmentServiceTest() {
	const [listDataForm, setListDataForm] = useState<listDataForm>({
		Branch: [],
		Student: [],
	});

	// ------ BASE USESTATE TABLE -------
	const [dataSource, setDataSource] = useState<ITestCustomer[]>([]);
	const {showNoti} = useWrap();
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const [indexRow, setIndexRow] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [todoApi, setTodoApi] = useState(listTodoApi);

	// ------ LIST FILTER -------
	const [dataFilter, setDataFilter] = useState([
		{
			name: 'BranchID',
			title: 'Trung tâm',
			col: 'col-md-12 col-12',
			type: 'select',
			optionList: null, // Gọi api xong trả data vào đây
			value: null,
		},

		{
			name: 'Status',
			title: 'Trạng thái',
			col: 'col-md-12 col-12',
			type: 'select',
			optionList: [
				{
					title: 'Chưa đăng kí',
					value: 0,
				},
				{
					title: 'Đã đăng kí',
					value: 1,
				},
			],
			value: null,
		},
		{
			name: 'AppointmentDate',
			title: 'Ngày hẹn test',
			col: 'col-md-12 col-12',
			type: 'date-single',
			value: null,
		},
		{
			name: 'date-range',
			title: 'Từ - đến',
			col: 'col-12',
			type: 'date-range',
			value: null,
		},
	]);

	const makeNewData = (data, name) => {
		let newData = null;
		switch (name) {
			case 'Branch':
				newData = data.map((item) => ({
					title: item.BranchName,
					value: item.ID,
				}));
				setDataFunc('BranchID', newData);
				break;

			case 'Student':
				newData = data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID,
					counselorsName:
						item.CounselorsName == null ? '' : item.CounselorsName,
				}));

				break;
			default:
				break;
		}

		return newData;
	};

	const getDataTolist = (data: any, name: any) => {
		let newData = makeNewData(data, name);

		Object.keys(listDataForm).forEach(function (key) {
			if (key == name) {
				listDataForm[key] = newData;
			}
		});
		setListDataForm({...listDataForm});
	};

	// ----------- GET DATA SOURCE ---------------
	const getDataAll = (arrApi) => {
		arrApi.forEach((item, index) => {
			(async () => {
				let res = null;
				try {
					if (item.name == 'Counselors') {
						res = await item.api.getAll({
							pageIndex: 1,
							pageSize: 99999,
							RoleID: 6,
							StatusID: 0,
							Enable: true,
						});
					} else {
						res = await item.api.getAll({
							pageIndex: 1,
							pageSize: 99999,
							Enable: true,
						});
					}

					res.status == 200 && getDataTolist(res.data.data, item.name);

					res.status == 204 &&
						showNoti('danger', item.text + ' Không có dữ liệu');
				} catch (error) {
					showNoti('danger', error.message);
				} finally {
				}
			})();
		});
	};

	// GET DATA SOURCE
	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});

		try {
			let res = await testCustomerApi.getAll(todoApi);
			if (res.status == 200) {
				setDataSource(res.data.data);
				setTotalPage(res.data.totalRow), showNoti('success', 'Thành công');
			}
			res.status == 204 && showNoti('danger', 'Không có dữ liệu');
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};

	// ------ SET DATA FUN ------
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

	// ---------------- AFTER SUBMIT -----------------
	const afterPost = (mes) => {
		// showNoti("success", mes);
		setTodoApi({
			...listTodoApi,
			pageIndex: 1,
		});
		setCurrentPage(1);
	};

	// ----------------- ON SUBMIT --------------------
	const _onSubmit = async (dataSubmit: any) => {
		console.log('Data submit: ', dataSubmit);
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});

		let res = null;

		try {
			if (dataSubmit.ID) {
				res = await testCustomerApi.update(dataSubmit);

				if (res.status == 200) {
					let newDataSource = [...dataSource];
					newDataSource.splice(indexRow, 1, {
						...dataSubmit,
						FullNameUnicode: listDataForm.Student.find(
							(item) => item.value == dataSubmit.UserInformationID
						).title,
						BranchName: listDataForm.Branch.find(
							(item) => item.value == dataSubmit.BranchID
						).title,
					});
					setDataSource(newDataSource);
					showNoti('success', res.data.message);
				}
			} else {
				res = await testCustomerApi.add(dataSubmit);
				res?.status == 200 && afterPost(res.data.message);
			}
		} catch (error) {
			console.log('error: ', error);
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false,
			});
		}

		return res;
	};

	// -------------- HANDLE FILTER ------------------
	const handleFilter = (listFilter) => {
		console.log('List Filter when submit: ', listFilter);

		let newListFilter = {...listFieldFilter};
		listFilter.forEach((item, index) => {
			let key = item.name;
			Object.keys(newListFilter).forEach((keyFilter) => {
				if (keyFilter == key) {
					newListFilter[key] = item.value;
				}
			});
		});
		setTodoApi({...listTodoApi, ...newListFilter, pageIndex: 1});
	};

	// --------------- HANDLE SORT ----------------------
	const handleSort = async (option) => {
		let newTodoApi = {
			...listTodoApi,
			pageIndex: 1,
			sort: option.title.sort,
			sortType: option.title.sortType,
		};
		setCurrentPage(1), setTodoApi(newTodoApi);
	};

	// ------------ ON SEARCH -----------------------

	const checkField = (valueSearch, dataIndex) => {
		let newList = {...listFieldSearch};
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

		setTodoApi({
			...todoApi,
			...clearKey,
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
		setTodoApi({
			...listTodoApi,
			pageIndex: 1,
		});
		setCurrentPage(1), resetListFieldSearch();
	};

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		setCurrentPage(pageNumber);
		console.log('Todoapi: ', todoApi);
		setTodoApi({
			...todoApi,
			// ...listFieldSearch,
			pageIndex: pageIndex,
		});
	};

	// ============== USE EFFECT - FETCH DATA ===================
	useEffect(() => {
		getDataSource();
	}, [todoApi]);

	useEffect(() => {
		getDataAll(listApi);
	}, []);

	const expandedRowRender = (record) => {
		// return record.Note ? record.Note : "Không có ghi chú";
		return <TestCustomerPoint ID={record.ID} />;
	};

	const columns = [
		{
			title: 'Học viên',
			dataIndex: 'FullNameUnicode',

			render: (a) => <p className="font-weight-blue">{a}</p>,
			...FilterColumn('FullNameUnicode', onSearch, handleReset, 'text'),
		},

		{
			title: 'Trung tâm',
			dataIndex: 'BranchName',

			render: (a) => <p className="font-weight-black">{a}</p>,
		},
		{
			title: 'Ngày hẹn',
			dataIndex: 'AppointmentDate',
			render: (date: any) => moment(date).format('DD/MM/YYYY'),
		},
		{
			title: 'Giờ hẹn',
			dataIndex: 'Time',
		},
		{
			title: 'Tư vấn viên',
			dataIndex: 'CounselorsName',
		},
		// {
		//   title: "Xong",
		//   dataIndex: "UserInformationID",
		//   align: "center",
		//   render: (apmStatus) => {
		//     let color = apmStatus == 0 ? "red" : "green";
		//     if (apmStatus == "Xong") {
		//       return <CheckCircle color={color} />;
		//     } else return <XCircle color={color} />;
		//   },
		// },
		{
			title: 'Trạng thái',
			dataIndex: 'Status',
			align: 'center',
			render: (apmReg) => {
				return (
					<>
						{apmReg == 1 ? (
							<span className="tag blue">Chưa đăng kí khóa học</span>
						) : apmReg == 2 ? (
							<span className="tag green">Đã đăng kí khóa học</span>
						) : (
							<span className="tag red">Chưa test</span>
						)}
					</>
				);
			},
		},
		{
			title: '',
			render: (text, data, index) => (
				<>
					<TestCustomerForm
						getIndex={() => setIndexRow(index)}
						index={index}
						rowData={data}
						rowID={data.ID}
						listData={listDataForm}
						isLoading={isLoading}
						_onSubmit={(data: any) => _onSubmit(data)}
					/>
				</>
			),
		},
	];

	return (
		<ExpandTable
			currentPage={currentPage}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			loading={isLoading}
			addClass="basic-header"
			TitlePage="DS khách hẹn test"
			// TitleCard={
			//   <StudentAdviseForm
			//     listData={listDataForm}
			//     isLoading={isLoading}
			//     _onSubmit={(data: any) => _onSubmit(data)}
			//   />
			// }
			dataSource={dataSource}
			columns={columns}
			Extra={
				<div className="extra-table">
					<FilterBase
						dataFilter={dataFilter}
						handleFilter={(listFilter: any) => handleFilter(listFilter)}
						handleReset={handleReset}
					/>
					<SortBox
						handleSort={(value) => handleSort(value)}
						dataOption={dataOption}
					/>
				</div>
			}
			expandable={{expandedRowRender}}
		/>
	);
}
AppointmentServiceTest.layout = LayoutBase;
