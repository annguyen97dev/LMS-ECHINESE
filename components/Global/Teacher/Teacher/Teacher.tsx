import { Tooltip } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { Eye } from 'react-feather';
import { areaApi, branchApi, districtApi, staffSalaryApi, teacherApi, userInformationApi, wardApi } from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import ExpandTable from '~/components/ExpandTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import { fmSelectArr } from '~/utils/functions';
import StaffSalaryForm from '../../Option/StaffSalaryForm';
import PromoteTeacher from './PromoteTeacher';
import SalaryTeacherNested from './SalaryTeacherNested';
import TeacherFilterForm from './TeacherFilterForm';
import TeacherForm from './TeacherForm';

const Teacher = () => {
	const [teacherList, setTeacherList] = useState<ITeacher[]>([]);
	const [optionAreaSystemList, setOptionAreaSystemList] = useState<{
		areaList: IOptionCommon[];
		districtList: IOptionCommon[];
		wardList: IOptionCommon[];
	}>({
		areaList: [],
		districtList: [],
		wardList: []
	});
	const [branchList, setBranchList] = useState([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const { showNoti, pageSize, userInformation } = useWrap();
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: pageSize,
		sort: 1,
		sortType: false,
		AreaID: '',
		FullNameUnicode: '',
		fromDate: '',
		toDate: '',
		StatusID: null
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: 1,
		sortType: false
	});
	const [filters, setFilters] = useState(listFieldInit);
	// ADD SALARY TO NEW TEACHER
	const [isClearForm, setIsClearForm] = useState(false);
	const [openSalaryForm, setOpenSalaryForm] = useState(false);
	const [dataStaff, setDataStaff] = useState([]);
	const optionGenderList = [
		{ title: 'Nữ', value: 0 },
		{ title: 'Nam', value: 1 },
		{ title: 'Khác', value: 2 }
	];
	const optionStatusList = [
		{ title: 'Hoạt động', value: 0 },
		{ title: 'Khóa', value: 1 }
	];
	// SORT OPTION
	const sortOptionList = [
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
				sort: 2,
				sortType: true
			},
			value: 3,
			text: 'Ngày nhận việc tăng dần'
		},
		{
			dataSort: {
				sort: 2,
				sortType: false
			},
			value: 4,
			text: 'Ngày nhận việc giảm dần'
		}
	];
	// FILTER
	const onFilter = (obj) => {
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			fromDate: moment(obj.fromDate).format('YYYY/MM/DD'),
			toDate: moment(obj.toDate).format('YYYY/MM/DD')
		});
	};
	// PAGINATION
	const getPagination = (pageIndex: number, pageSize: number) => {
		if (!pageSize) pageSize = 10;
		refValue.current = {
			...refValue.current,
			pageSize,
			pageIndex
		};
		setFilters({
			...filters,
			...refValue.current
		});
	};
	// SORT
	const onSort = (option) => {
		refValue.current = {
			...refValue.current,
			sort: option.title.sort,
			sortType: option.title.sortType
		};
		setFilters({
			...listFieldInit,
			...refValue.current
		});
	};
	// RESET SEARCH
	const onResetSearch = () => {
		setActiveColumnSearch('');
		setFilters({
			...listFieldInit,
			pageSize: refValue.current.pageSize
		});
	};
	// ACTION SEARCH
	const onSearch = (valueSearch, dataIndex) => {
		setActiveColumnSearch(dataIndex);
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			[dataIndex]: valueSearch
		});
	};
	// GET AREA
	const fetchAreaList = async () => {
		try {
			const res = await areaApi.getAll({
				selectAll: true
			});
			if (res.status === 200 && res.data.totalRow && res.data.data.length) {
				const newAreaList = fmSelectArr(res.data.data, 'AreaName', 'AreaID');
				setOptionAreaSystemList({
					...optionAreaSystemList,
					areaList: newAreaList
				});
			}
		} catch (error) {
			// showNoti('danger', error.message);
		}
	};
	useEffect(() => {
		fetchAreaList();
	}, []);
	// DISTRICT BY AREA
	const fetchDistrictByAreaID = async (id: number) => {
		try {
			const res = await districtApi.getAll({
				AreaID: id
			});
			if (res.status === 200 && res.data.totalRow && res.data.data.length) {
				const newDistrictList = fmSelectArr(res.data.data, 'DistrictName', 'ID');
				setOptionAreaSystemList({
					...optionAreaSystemList,
					districtList: newDistrictList,
					wardList: []
				});
			}
		} catch (error) {
			showNoti('danger', error.message);
		}
	};
	// WARD BY DISTRICT
	const fetchWardByDistrictID = async (id: number) => {
		setIsLoading({ type: 'FETCH_WARD_BY_DISTRICT', status: true });
		try {
			const res = await wardApi.getAll({
				DistrictID: id
			});
			if (res.status === 200 && res.data.totalRow && res.data.data.length) {
				const newWardList = fmSelectArr(res.data.data, 'WardName', 'ID');
				setOptionAreaSystemList({
					...optionAreaSystemList,
					wardList: newWardList
				});
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({ type: 'FETCH_WARD_BY_DISTRICT', status: false });
		}
	};
	// BRANCH BY AREA
	const fetchBranchByAreaId = async (id: number) => {
		setIsLoading({ type: 'FETCH_DATA_BY_AREA', status: true });
		try {
			let res = await branchApi.getAll({
				areaID: id,
				Enable: true
			});
			if (res.status === 200 && res.data.totalRow) {
				const newBranchList = res.data.data.map((item) => ({
					title: item.BranchName,
					value: item.ID
				}));

				setBranchList(newBranchList);
			}
			if (res.status === 204) {
				setBranchList([]);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({ type: 'FETCH_DATA_BY_AREA', status: false });
		}
	};
	// GET DATA IN FIRST TIME
	const fetchTeacherList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await teacherApi.getAll(filters);
			if (res.status === 200) {
				if (res.data.totalRow && res.data.data.length) {
					setTeacherList(res.data.data);
					setTotalPage(res.data.totalRow);
				}
			} else if (res.status === 204) {
				setTeacherList([]);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};
	useEffect(() => {
		fetchTeacherList();
	}, [filters]);

	// SALARY
	const onOpenSalaryForm = (userID) => {
		setIsClearForm(false);
		setOpenSalaryForm(true);
		getInfoTeacherToAddSalary(userID);
	};
	const onCloseSalaryForm = () => {
		setIsClearForm(true);
		setOpenSalaryForm(false);
		setDataStaff([]);
	};
	const getInfoTeacherToAddSalary = async (userID) => {
		try {
			const res = await userInformationApi.getByID(userID);
			res.status === 200 && setDataStaff([res.data.data]);
		} catch (error) {
			showNoti('danger', error.message);
		}
	};

	const saveSalary = async (obj) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res;
		try {
			res = await staffSalaryApi.add(obj);
			if (res.status === 200) {
				onCloseSalaryForm();
				showNoti('success', res.data.message);
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
	// CREATE
	const onCreateTeacher = async (data: any) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res;
		try {
			const newTeacher = {
				...data,
				Branch: data.Branch.join(',')
			};
			res = await teacherApi.add(newTeacher);
			if (res.status === 200) {
				console.log(res.data);
				onOpenSalaryForm(res.data.data.UserInformationID);
				showNoti('success', res.data.message);
				onResetSearch(); // <== khi tạo xong r reset search để trở về trang đầu tiên
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
	// UPDATE
	const onUpdateTeacher = async (newObj: any, idx: number) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res;
		try {
			const newTeacherAPI = {
				...newObj,
				Branch: newObj.Branch.join(',')
			};
			res = await teacherApi.update(newTeacherAPI);
			if (res.status === 200) {
				const newTeacherList = [...teacherList];
				const newBranch = branchList
					.filter((ob) => newObj.Branch.some((nb) => nb === ob.value))
					.map((b) => ({
						ID: b.value,
						BranchName: b.title
					}));
				newTeacherList.splice(idx, 1, {
					...newObj,
					// AreaName: areaList.find((a) => a.value === newObj.AreaID).title,
					Branch: newBranch
				});
				setTeacherList(newTeacherList);
				showNoti('success', res.data.message);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
			return res;
		}
	};

	const _onSubmitPromoteTeacher = async (data) => {
		setIsLoading({ type: 'PROMOTE', status: true });
		try {
			let res = await teacherApi.updateRole({ RoleID: 5, UserInformationID: data });
			if (res.status == 200) {
				setFilters({ ...filters });
				showNoti('success', 'Thăng cấp thành công!');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({ type: 'PROMOTE', status: false });
		}
	};

	const columns = [
		{
			title: 'Mã giáo viên',
			dataIndex: 'UserCode',
			fixed: 'left',
			render: (code) => <p className="font-weight-black">{code}</p>
		},
		{
			title: 'Họ và tên',
			dataIndex: 'FullNameUnicode',
			...FilterColumn('FullNameUnicode', onSearch, onResetSearch, 'text'),
			className: activeColumnSearch === 'FullNameUnicode' ? 'active-column-search' : '',
			render: (text) => <p className="font-weight-primary">{text}</p>,
			fixed: 'left'
		},
		{
			width: 120,
			title: 'Tên tiếng Trung',
			dataIndex: 'ChineseName',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Tỉnh/TP',
			dataIndex: 'AreaName',
			...FilterColumn('AreaID', onSearch, onResetSearch, 'select', optionAreaSystemList.areaList),
			className: activeColumnSearch === 'AreaID' ? 'active-column-search' : ''
		},
		{
			width: 120,
			title: 'Giới tính',
			dataIndex: 'Gender',
			render: (genderID) => optionGenderList.find((o) => o.value === genderID).title
		},
		{
			title: 'SĐT',
			width: 120,
			dataIndex: 'Mobile'
		},
		{
			title: 'Email',
			width: 180,
			dataIndex: 'Email'
		},
		{
			title: 'Ngày nhận việc',
			width: 150,
			dataIndex: 'Jobdate',
			render: (date) => date && moment(date).format('DD/MM/YYYY')
		},
		{
			title: 'Facebook',
			width: 150,
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
			width: 150,
			dataIndex: 'StatusID',
			align: 'center',
			...FilterColumn('StatusID', onSearch, onResetSearch, 'select', optionStatusList),
			render: (status) => (status ? <span className="tag gray">Khóa</span> : <span className="tag green">Hoạt động</span>)
		},

		{
			width: 180,
			align: 'center',
			render: (value, _, idx) => (
				<div onClick={(e) => e.stopPropagation()}>
					<Link
						href={{
							pathname: '/staff/teacher-list/teacher-detail/[slug]',
							query: { slug: _.UserInformationID }
						}}
					>
						<Tooltip title="Chi tiết giảng dạy">
							<a className="btn btn-icon">
								<Eye />
							</a>
						</Tooltip>
					</Link>
					<TeacherForm
						isLoading={isLoading}
						isUpdate={true}
						updateObj={value}
						indexUpdateObj={idx}
						handleUpdateTeacher={onUpdateTeacher}
						//
						optionStatusList={optionStatusList}
						optionGenderList={optionGenderList}
						optionAreaSystemList={optionAreaSystemList}
						handleFetchDistrict={fetchDistrictByAreaID}
						handleFetchWard={fetchWardByDistrictID}
						optionBranchList={branchList}
						handleFetchBranch={fetchBranchByAreaId}
					/>
					{userInformation && userInformation.RoleID == 1 && (
						<PromoteTeacher
							isLoading={isLoading}
							type="teacher"
							record={_}
							_onSubmitPromoteTeacher={() => {
								_onSubmitPromoteTeacher(_.UserInformationID);
							}}
						/>
					)}
				</div>
			)
		}
	];

	const expandedRowRender = (item: ITeacher) => {
		return <SalaryTeacherNested teacherID={item.UserInformationID} />;
	};

	return (
		<>
			<StaffSalaryForm
				showInTeacherView={true}
				isLoading={isLoading}
				isOpenModalFromOutSide={openSalaryForm}
				openModalFromOutSide={onCloseSalaryForm}
				dataStaff={dataStaff}
				dataIDStaff={dataStaff[0]?.UserInformationID}
				_onSubmit={(data: any) => saveSalary(data)}
			/>
			<ExpandTable
				currentPage={filters.pageIndex}
				totalPage={totalPage}
				getPagination={getPagination}
				loading={isLoading}
				addClass="basic-header"
				columns={columns}
				dataSource={teacherList}
				TitlePage="Danh sách giáo viên"
				TitleCard={
					<TeacherForm
						isClearForm={isClearForm}
						isLoading={isLoading}
						optionAreaSystemList={optionAreaSystemList}
						optionBranchList={branchList}
						handleCreateTeacher={onCreateTeacher}
						handleFetchBranch={fetchBranchByAreaId}
					/>
				}
				Extra={
					<div className="extra-table">
						<TeacherFilterForm handleFilter={onFilter} handleResetFilter={onResetSearch} />
						<SortBox handleSort={onSort} dataOption={sortOptionList} />
					</div>
				}
				expandable={{ expandedRowRender }}
			/>
		</>
	);
};

export default Teacher;
