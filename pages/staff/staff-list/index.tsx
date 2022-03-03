import { RetweetOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
	areaApi,
	branchApi,
	jobApi,
	parentsApi,
	puroseApi,
	resetPasswordApi,
	sourceInfomationApi,
	staffApi,
	staffSalaryApi,
	userInformationApi
} from '~/apiBase';

import FilterBase from '~/components/Elements/FilterBase/FilterBase';
import NotiModal from '~/components/Elements/NotiModal/NotiModal';
import SortBox from '~/components/Elements/SortBox';
import ExpandTable from '~/components/ExpandTable';
import ResetPassForm from '~/components/Global/StaffList/ResetPassForm';
import SalaryStaffNested from '~/components/Global/StaffList/SalaryStaffNested';
// import { Roles } from "~/lib/roles/listRoles";
import StaffForm from '~/components/Global/StaffList/StaffForm';
import PromoteTeacher from '~/components/Global/Teacher/Teacher/PromoteTeacher';
import LayoutBase from '~/components/LayoutBase';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import Link from 'next/link';
import { Eye } from 'react-feather';

let pageIndex = 1;

interface dataRoles {
	title: string;
	value: number;
}

let listFieldSearch = {
	pageIndex: 1,
	FullNameUnicode: null
};

let listFieldFilter = {
	pageIndex: 1,
	fromDate: null,
	toDate: null,
	RoleID: null,
	BranchID: null,
	AreaID: null,
	StatusID: null
};

const dataOption = [
	{
		dataSort: {
			sort: 0,
			sortType: false
		},
		text: 'Tên Z-A'
	},
	{
		dataSort: {
			sort: 0,
			sortType: true
		},
		text: 'Tên A-Z '
	}
];

// -- FOR DIFFERENT VIEW --

interface objData {
	title: string;
	value: number;
}

interface listDataForm {
	Area: Array<objData>;
	DistrictID: Array<objData>;
	WardID: Array<objData>;
	Role: Array<objData>;
	Branch: Array<objData>;
	Purposes: Array<objData>;
	SourceInformation: Array<objData>;
	Parent: Array<objData>;
	Counselors: Array<objData>;
}

const optionGender = [
	{
		value: 0,
		title: 'Nữ'
	},
	{
		value: 1,
		title: 'Nam'
	},
	{
		value: 0,
		title: 'Khác'
	}
];

const listApi = [
	{
		api: areaApi,
		text: 'Tỉnh/Tp',
		name: 'Area'
	},

	{
		api: jobApi,
		text: 'Công việc',
		name: 'Job'
	},
	{
		api: puroseApi,
		text: 'Mục đích học',
		name: 'Purposes'
	},
	{
		api: branchApi,
		text: 'Trung tâm',
		name: 'Branch'
	},
	{
		api: parentsApi,
		text: 'Phụ huynh',
		name: 'Parent'
	},
	{
		api: sourceInfomationApi,
		text: 'Nguồn khách hàng',
		name: 'SourceInformation'
	},
	{
		api: userInformationApi,
		text: 'Nguồn khách hàng',
		name: 'Role'
	},
	{
		api: staffApi,
		text: 'Nguồn khách hàng',
		name: 'Counselors'
	}
];

const StaffList = () => {
	const [listDataForm, setListDataForm] = useState<listDataForm>({
		Area: [],
		DistrictID: [],
		WardID: [],
		Role: [],
		Branch: [],
		Purposes: [],
		SourceInformation: [],
		Parent: [],
		Counselors: []
	});

	const [isOpenReset, setIsOpenReset] = useState(false);

	// ------ BASE USESTATE TABLE -------

	const [dataSource, setDataSource] = useState<IStaff[]>([]);
	const { showNoti, pageSize, userInformation } = useWrap();
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		fromDate: null,
		toDate: null,
		FullNameUnicode: null,
		RoleID: null,
		BranchID: null,
		AreaID: null
	};
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [indexRow, setIndexRow] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [todoApi, setTodoApi] = useState(listTodoApi);
	// GET LIST ROLES

	const [dataFilter, setDataFilter] = useState([
		{
			name: 'AreaID',
			title: 'Tỉnh/TP',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: null, // Gọi api xong trả data vào đây
			value: null
		},
		{
			name: 'BranchID',
			title: 'Trung tâm',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: null,
			value: null
		},
		{
			name: 'RoleID',
			title: 'Chức vụ',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: null,
			value: null
		},
		{
			name: 'StatusID',
			title: 'Trạng thái',
			col: 'col-md-6 col-12',
			type: 'select',
			optionList: [
				{
					value: 0,
					title: 'Hoạt động'
				},
				{
					value: 1,
					title: 'Không Hoạt động'
				}
			],
			value: null
		},
		{
			name: 'date-range',
			title: 'Từ - đến',
			col: 'col-12',
			type: 'date-range',
			value: null
		}
	]);

	// FOR STUDENT FORM
	// ------------- ADD data to list --------------

	const makeNewData = (data, name) => {
		let newData = null;
		switch (name) {
			case 'Area':
				newData = data.map((item) => ({
					title: item.AreaName,
					value: item.AreaID
				}));
				setDataFunc('AreaID', newData);
				break;
			case 'DistrictID':
				newData = data.map((item) => ({
					title: item.DistrictName,
					value: item.ID
				}));
				break;
			case 'WardID':
				newData = data.map((item) => ({
					title: item.WardName,
					value: item.ID
				}));
				break;
			case 'Branch':
				newData = data.map((item) => ({
					title: item.BranchName,
					value: item.ID
				}));
				setDataFunc('BranchID', newData);
				break;
			case 'Job':
				newData = data.map((item) => ({
					title: item.JobName,
					value: item.JobID
				}));
				break;
			case 'Purposes':
				newData = data.map((item) => ({
					title: item.PurposesName,
					value: item.PurposesID
				}));
				break;
			case 'Parent':
				newData = data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}));
				break;
			case 'SourceInformation':
				newData = data.map((item) => ({
					title: item.SourceInformationName,
					value: item.SourceInformationID
				}));
				setDataFunc('SourceInformationID', newData);
				break;
			case 'Counselors':
				newData = data.map((item) => ({
					title: item.FullNameUnicode,
					value: item.UserInformationID
				}));
				break;
			case 'Role':
				newData = data.map((item) => ({
					title: item.name,
					value: item.ID
				}));
				setDataFunc('RoleID', newData);
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
		setListDataForm({ ...listDataForm });
	};

	// ----------- GET DATA SOURCE ---------------
	const getDataStudentForm = (arrApi) => {
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
							Enable: true
						});
					} else if (item.name == 'Role') {
						res = await item.api.getRole(1);
						if (res.status === 200) {
							console.log('🚀 ~ file: index.tsx ~ line 368 ~ res.data.data', res.data.data);
						}
					} else {
						res = await item.api.getAll({
							pageIndex: 1,
							pageSize: 99999,
							Enable: true
						});
					}

					res.status == 200 && getDataTolist(res.data.data, item.name);

					res.status == 204 && console.log(item.text + ' Không có dữ liệu');
				} catch (error) {
					console.log(error);
				} finally {
				}
			})();
		});
	};

	// GET DATA SOURCE
	const getDataSource = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});

		try {
			let res = await staffApi.getAll(todoApi);
			res.status == 200 && (setDataSource(res.data.data), setTotalPage(res.data.totalRow));
			res.status == 204 && setDataSource([]);
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
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
		// showNoti("success", "Thêm nhân viên thành công");
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		});
		setCurrentPage(1);
	};

	// ----------- SUBMI FORM ------------
	const returnBranchName = (branchID) => {
		let newArr = [];
		let listID = branchID.split(',');

		listID.forEach((item) => {
			let newObj = {
				ID: parseInt(item),
				BranchName: listDataForm?.Branch.find((a) => a.value === parseInt(item)).title
			};

			newObj && newArr.push(newObj);
		});

		return newArr;
	};

	const onSubmitSalary = async (data: any) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res = null;
		try {
			res = await staffSalaryApi.update(data);
			if (res.status == 200) {
				showNoti('success', 'Thêm lương thành công');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}

		return res;
	};

	const onSubmit = async (data: any) => {
		if (typeof data.Branch != 'undefined') {
			data.Branch = data.Branch.toString();
		} else {
			data.Branch = '';
		}

		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res = null;
		try {
			if (data.UserInformationID) {
				res = await staffApi.update(data);
				if (res.status == 200) {
					// let newDataSource = [...dataSource];
					// newDataSource.splice(indexRow, 1, {
					// 	...data,
					// 	Branch: returnBranchName(data.Branch),
					// 	RoleName: dataRoles.find((item) => item.value == data.RoleID)?.title
					// });
					// setDataSource(newDataSource);
					setTodoApi({ ...todoApi });
					showNoti('success', res.data.message);
				}
			} else {
				res = await staffApi.add(data);
				res?.status == 200 && afterPost(res.data.message);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}

		return res;
	};

	// -------------- CHECK FIELD ---------------------
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

	// -------------- HANDLE FILTER ------------------
	const handleFilter = (listFilter) => {
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

	// --------------- HANDLE SORT ----------------------
	const handleSort = async (option) => {
		let newTodoApi = {
			...listTodoApi,
			pageIndex: 1,
			sort: option.title.sort,
			sortType: option.title.sortType
		};
		setCurrentPage(1), setTodoApi(newTodoApi);
	};

	// ------------ ON SEARCH -----------------------
	const onSearch = (valueSearch, dataIndex) => {
		let clearKey =
			dataIndex == 'FullNameUnicode'
				? { FullNameUnicode: valueSearch }
				: dataIndex == 'ChineseName'
				? { ChineseName: valueSearch }
				: dataIndex == 'Mobile'
				? { Mobile: valueSearch }
				: { Email: valueSearch };

		setTodoApi({
			...todoApi,
			...clearKey,
			...listFieldFilter
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
			pageIndex: 1
		});
		setCurrentPage(1), resetListFieldSearch();
	};

	// -------------- GET PAGE_NUMBER -----------------
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			...listFieldSearch,
			...listFieldFilter,
			pageIndex: pageIndex
		});
	};

	// ============== USE EFFECT - FETCH DATA ===================
	useEffect(() => {
		getDataSource();
	}, [todoApi]);

	useEffect(() => {
		getDataStudentForm(listApi);
	}, []);

	const _onSubmitPromoteStaff = async (data) => {
		setIsLoading({ type: 'PROMOTE', status: true });
		try {
			let res = await staffApi.update({ RoleID: 2, UserInformationID: data });
			if (res.status == 200) {
				setTodoApi({ ...todoApi });
				showNoti('success', 'Chuyển vị trí thành công!');
				return true;
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({ type: 'PROMOTE', status: false });
		}
	};

	const columns = [
		{
			width: 120,
			title: 'Mã',
			dataIndex: 'UserCode',
			fixed: 'left'
		},
		{
			title: 'Họ tên',
			dataIndex: 'FullNameUnicode',
			fixed: 'left',
			width: 200,
			...FilterColumn('FullNameUnicode', onSearch, handleReset, 'text'),
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			width: 200,
			title: 'Tên tiếng Trung',
			dataIndex: 'ChineseName',
			fixed: 'left',
			...FilterColumn('ChineseName', onSearch, handleReset, 'text'),
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			width: 180,
			title: 'Trung tâm',
			dataIndex: 'Branch',
			render: (branch) => (
				<>
					{branch.map((item) => (
						<p className="font-weight-primary d-block">{item.BranchName}</p>
					))}
				</>
			)
		},
		{
			width: 100,
			title: 'Giới tính',
			dataIndex: 'Gender',
			render: (gender) => <>{gender == 0 ? 'Nữ' : gender == 1 ? 'Nam' : 'Khác'}</>
		},
		{
			title: 'Tài khoản',
			dataIndex: 'UserName'
		},
		{
			title: 'Email',
			dataIndex: 'Email',
			// ...FilterColumn('Email', onSearch, handleReset, 'text'),
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Vị trí',
			width: 100,
			dataIndex: 'RoleName'
		},
		{
			width: 150,
			title: 'Ngày nhận việc',
			dataIndex: 'Jobdate',
			render: (date: any) => date && moment(date).format('DD/MM/YYYY')
		},
		{
			width: 150,
			title: 'Facebook',
			dataIndex: 'LinkFaceBook',
			render: (link) =>
				link && (
					<a className="font-weight-black" href={link} target="_blank">
						Link
					</a>
				)
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusID',
			className: 'text-center',
			render: (status) => <>{<span className={`tag ${status == 0 ? 'green' : 'gray'}`}>{status == 0 ? 'Hoạt động' : 'Khóa'}</span>}</>
		},
		{
			title: '',
			dataIndex: '',
			width: userInformation !== null && userInformation?.RoleID === 5 ? 0 : 180,
			render: (text, data, index) => (
				<>
					{userInformation !== null && userInformation?.RoleID !== 5 && (
						<div onClick={(e) => e.stopPropagation()}>
							<StaffForm
								getIndex={() => setIndexRow(index)}
								index={index}
								rowData={data}
								rowID={data.UserInformationID}
								isLoading={isLoading}
								onSubmit={(data: any) => onSubmit(data)}
								onSubmitSalary={(data: any) => onSubmitSalary(data)}
								listDataForm={listDataForm}
							/>
							<ResetPassForm dataRow={data} />
							{data.RoleID === 5 && (
								<Link
									href={{
										pathname: '/staff/teacher-list/teacher-detail/[slug]',
										query: { slug: data.UserInformationID }
									}}
								>
									<Tooltip title="Chi tiết giảng dạy">
										<a className="btn btn-icon">
											<Eye />
										</a>
									</Tooltip>
								</Link>
							)}
							{userInformation && userInformation?.RoleID == 1 && data.RoleID == 5 && (
								<PromoteTeacher
									isLoading={isLoading}
									type="staff"
									record={data}
									_onSubmitPromoteStaff={() => _onSubmitPromoteStaff(data.UserInformationID)}
								/>
							)}
						</div>
					)}
				</>
			)
		}
	];

	const expandedRowRender = (data) => {
		return (
			<>
				<SalaryStaffNested staffID={data.UserInformationID} />
			</>
		);
	};

	return (
		<>
			<ExpandTable
				currentPage={currentPage}
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				loading={isLoading}
				addClass="basic-header"
				columns={columns}
				dataSource={dataSource}
				TitlePage="Danh sách nhân viên"
				TitleCard={
					userInformation !== null && userInformation?.RoleID !== 5 ? (
						<StaffForm isLoading={isLoading} onSubmit={(data: any) => onSubmit(data)} listDataForm={listDataForm} />
					) : null
				}
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
				expandable={{ expandedRowRender }}
			/>
		</>
	);
};
StaffList.layout = LayoutBase;

export default StaffList;
