import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { areaApi, branchApi, districtApi, staffApi, wardApi } from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import { fmSelectArr } from '~/utils/functions';
import TeacherFilterForm from '../../Teacher/Teacher/TeacherFilterForm';
import SalerListForm from './SalerListForm';

const SalerList = () => {
	const [salerList, setSalerList] = useState<IStaff[]>([]);
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
	const { showNoti } = useWrap();
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: 1,
		sortType: false,

		AreaID: '',
		FullNameUnicode: '',
		fromDate: '',
		toDate: '',
		StatusID: null,
		RoleID: 6
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: 1,
		sortType: false
	});
	const [filters, setFilters] = useState(listFieldInit);
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
			// showNoti('danger', error.message);
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
			// showNoti('danger', error.message);
		} finally {
			setIsLoading({ type: 'FETCH_WARD_BY_DISTRICT', status: false });
		}
	};
	// BRANCH BY AREA
	const fetchBranchByAreaId = async (id: number) => {
		setIsLoading({ type: 'FETCH_DATA_BY_AREA', status: true });
		try {
			let res = await branchApi.getAll({
				areaID: id
			});
			if (res.status === 200 && res.data.totalRow) {
				const newBranchList = fmSelectArr(res.data.data, 'BranchName', 'ID');
				setBranchList(newBranchList);
			}
			if (res.status === 204) {
				setBranchList([]);
			}
		} catch (error) {
			// showNoti('danger', error.message);
		} finally {
			setIsLoading({ type: 'FETCH_DATA_BY_AREA', status: false });
		}
	};

	// GET DATA IN FIRST TIME
	const fetchSalerList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await staffApi.getAll(filters);
			if (res.status === 200) {
				if (res.data.totalRow && res.data.data.length) {
					setSalerList(res.data.data);
					setTotalPage(res.data.totalRow);
				}
			}
			if (res.status === 204) {
				setSalerList([]);
				setTotalPage(0);
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
		fetchSalerList();
	}, [filters]);
	// CREATE
	const onCreateTeacher = async (data) => {
		try {
			setIsLoading({
				type: 'ADD_DATA',
				status: true
			});
			const newSaler = {
				...data,
				Branch: data.Branch.join(','),
				RoleID: 6
			};
			const res = await staffApi.add(newSaler);
			if (res.status === 200) {
				showNoti('success', res.data.message);
				onResetSearch(); // <== khi tạo xong r reset search để trở về trang đầu tiên
				return true;
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};
	// UPDATE
	const onUpdateTeacher = async (newObj: any, idx: number) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res;
		try {
			const newSalerAPI = {
				...newObj,
				Branch: newObj.Branch.join(',')
			};
			res = await staffApi.update(newSalerAPI);
			if (res.status === 200) {
				const newSalerList = [...salerList];
				const newBranch = branchList
					.filter((ob) => newObj.Branch.some((nb) => nb === ob.value))
					.map((b) => ({
						ID: b.value,
						BranchName: b.title
					}));
				newSalerList.splice(idx, 1, {
					...newObj,
					Branch: newBranch
				});
				setSalerList(newSalerList);
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
	const columns = [
		{
			title: 'Họ và tên',
			dataIndex: 'FullNameUnicode',
			...FilterColumn('FullNameUnicode', onSearch, onResetSearch, 'text'),
			className: activeColumnSearch === 'FullNameUnicode' ? 'active-column-search' : '',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Tỉnh/Thành phố',
			dataIndex: 'AreaName',
			...FilterColumn('AreaID', onSearch, onResetSearch, 'select', optionAreaSystemList.areaList),
			className: activeColumnSearch === 'AreaID' ? 'active-column-search' : '',
			render: (text) => <p className="font-weight-black">{text}</p>
		},
		{
			title: 'Giới tính',
			dataIndex: 'Gender',
			render: (genderID) => optionGenderList.find((o) => o.value === genderID).title
		},
		{
			title: 'SĐT',
			dataIndex: 'Mobile'
			// ...FilterColumn('Mobile', onSearch, onResetSearch, 'text')
		},
		{
			title: 'Email',
			dataIndex: 'Email'
			// ...FilterColumn('Email', onSearch, onResetSearch, 'text')
		},
		{
			title: 'Ngày nhận việc',
			dataIndex: 'Jobdate',
			render: (date) => date && moment(date).format('DD/MM/YYYY')
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusID',
			align: 'center',
			...FilterColumn('StatusID', onSearch, onResetSearch, 'select', optionStatusList),
			render: (status) => (status ? <span className="tag gray">Khóa</span> : <span className="tag green">Hoạt động</span>)
		},
		{
			align: 'center',
			render: (value, _, idx) => (
				<SalerListForm
					isLoading={isLoading}
					isUpdate={true}
					updateObj={value}
					//
					optionStatusList={optionStatusList}
					optionGenderList={optionGenderList}
					optionAreaSystemList={optionAreaSystemList}
					handleFetchDistrict={fetchDistrictByAreaID}
					handleFetchWard={fetchWardByDistrictID}
					optionBranchList={branchList}
					handleFetchBranch={fetchBranchByAreaId}
					//
					handleSubmit={onUpdateTeacher}
				/>
			)
		}
	];

	return (
		<>
			<PowerTable
				currentPage={filters.pageIndex}
				totalPage={totalPage}
				getPagination={getPagination}
				loading={isLoading}
				addClass="basic-header"
				columns={columns}
				dataSource={salerList}
				TitlePage="Danh sách tư vấn viên"
				TitleCard={
					<SalerListForm
						isLoading={isLoading}
						//
						optionStatusList={optionStatusList}
						optionGenderList={optionGenderList}
						optionAreaSystemList={optionAreaSystemList}
						handleFetchDistrict={fetchDistrictByAreaID}
						handleFetchWard={fetchWardByDistrictID}
						optionBranchList={branchList}
						handleFetchBranch={fetchBranchByAreaId}
						//
						handleSubmit={onCreateTeacher}
					/>
				}
				Extra={
					<div className="extra-table">
						<TeacherFilterForm handleFilter={onFilter} handleResetFilter={onResetSearch} />
						<SortBox handleSort={onSort} dataOption={sortOptionList} />
					</div>
				}
			/>
		</>
	);
};

export default SalerList;
