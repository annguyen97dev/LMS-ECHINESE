import {Tooltip} from 'antd';
import moment from 'moment';
import Link from 'next/link';
import React, {useEffect, useRef, useState} from 'react';
import {Info} from 'react-feather';
import {
	areaApi,
	branchApi,
	districtApi,
	staffSalaryApi,
	studentApi,
	teacherApi,
	userInformationApi,
	wardApi,
} from '~/apiBase';
import DeleteTableRow from '~/components/Elements/DeleteTableRow/DeleteTableRow';
import SortBox from '~/components/Elements/SortBox';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import {useWrap} from '~/context/wrap';
import {fmSelectArr} from '~/utils/functions';
import StaffSalaryForm from '../../Option/StaffSalaryForm';
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
		wardList: [],
	});
	const [branchList, setBranchList] = useState([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const {showNoti} = useWrap();
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,
		AreaID: '',
		FullNameUnicode: '',
		fromDate: '',
		toDate: '',
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,
	});
	const [filters, setFilters] = useState(listFieldInit);
	// ADD SALARY TO NEW TEACHER
	const [isClearForm, setIsClearForm] = useState(false);
	const [openSalaryForm, setOpenSalaryForm] = useState(false);
	const [dataStaff, setDataStaff] = useState([]);
	const optionGenderList = [
		{title: 'Nữ', value: 0},
		{title: 'Nam', value: 1},
		{title: 'Khác', value: 2},
	];
	const optionStatusList = [
		{title: 'Hoạt động', value: 0},
		{title: 'Khóa', value: 1},
	];
	// SORT OPTION
	const sortOptionList = [
		{
			dataSort: {
				sort: 0,
				sortType: true,
			},
			value: 1,
			text: 'Tên tăng dần',
		},
		{
			dataSort: {
				sort: 0,
				sortType: false,
			},
			value: 2,
			text: 'Tên giảm dần',
		},
		{
			dataSort: {
				sort: 2,
				sortType: true,
			},
			value: 3,
			text: 'Ngày nhận việc tăng dần',
		},
		{
			dataSort: {
				sort: 2,
				sortType: false,
			},
			value: 4,
			text: 'Ngày nhận việc giảm dần',
		},
	];
	// FILTER
	const onFilter = (obj) => {
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			fromDate: moment(obj.fromDate).format('YYYY/MM/DD'),
			toDate: moment(obj.toDate).format('YYYY/MM/DD'),
		});
	};
	// PAGINATION
	const getPagination = (pageIndex: number, pageSize: number) => {
		if (!pageSize) pageSize = 10;
		refValue.current = {
			...refValue.current,
			pageSize,
			pageIndex,
		};
		setFilters({
			...filters,
			...refValue.current,
		});
	};
	// SORT
	const onSort = (option) => {
		refValue.current = {
			...refValue.current,
			sort: option.title.sort,
			sortType: option.title.sortType,
		};
		setFilters({
			...listFieldInit,
			...refValue.current,
		});
	};
	// RESET SEARCH
	const onResetSearch = () => {
		setActiveColumnSearch('');
		setFilters({
			...listFieldInit,
			pageSize: refValue.current.pageSize,
		});
	};
	// ACTION SEARCH
	const onSearch = (valueSearch, dataIndex) => {
		setActiveColumnSearch(dataIndex);
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			[dataIndex]: valueSearch,
		});
	};
	// GET AREA
	const fetchAreaList = async () => {
		try {
			const res = await areaApi.getAll({
				selectAll: true,
			});
			if (res.status === 200 && res.data.totalRow && res.data.data.length) {
				const newAreaList = fmSelectArr(res.data.data, 'AreaName', 'AreaID');
				setOptionAreaSystemList({
					...optionAreaSystemList,
					areaList: newAreaList,
				});
			}
		} catch (error) {
			showNoti('danger', error.message);
		}
	};
	useEffect(() => {
		fetchAreaList();
	}, []);
	// DISTRICT BY AREA
	const fetchDistrictByAreaID = async (id: number) => {
		try {
			const res = await districtApi.getAll({
				AreaID: id,
			});
			if (res.status === 200 && res.data.totalRow && res.data.data.length) {
				const newDistrictList = fmSelectArr(
					res.data.data,
					'DistrictName',
					'ID'
				);
				setOptionAreaSystemList({
					...optionAreaSystemList,
					districtList: newDistrictList,
					wardList: [],
				});
			}
		} catch (error) {
			showNoti('danger', error.message);
		}
	};
	// WARD BY DISTRICT
	const fetchWardByDistrictID = async (id: number) => {
		setIsLoading({type: 'FETCH_WARD_BY_DISTRICT', status: true});
		try {
			const res = await wardApi.getAll({
				DistrictID: id,
			});
			if (res.status === 200 && res.data.totalRow && res.data.data.length) {
				const newWardList = fmSelectArr(res.data.data, 'WardName', 'ID');
				setOptionAreaSystemList({
					...optionAreaSystemList,
					wardList: newWardList,
				});
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({type: 'FETCH_WARD_BY_DISTRICT', status: false});
		}
	};
	// BRANCH BY AREA
	const fetchBranchByAreaId = async (id: number) => {
		setIsLoading({type: 'FETCH_DATA_BY_AREA', status: true});
		try {
			let res = await branchApi.getAll({
				areaID: id,
			});
			if (res.status === 200 && res.data.totalRow) {
				const newBranchList = fmSelectArr(res.data.data, 'BranchName', 'ID');
				setBranchList(newBranchList);
			}
			if (res.status === 204) {
				setBranchList([]);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({type: 'FETCH_DATA_BY_AREA', status: false});
		}
	};
	// GET DATA IN FIRST TIME
	const fetchTeacherList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			let res = await teacherApi.getAll(filters);
			if (res.status === 200) {
				if (res.data.totalRow && res.data.data.length) {
					setTeacherList(res.data.data);
					setTotalPage(res.data.totalRow);
				}
			} else if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
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
			status: true,
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
				status: false,
			});
		}
		return res;
	};
	const onUploadImage = async (file) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			const res = await studentApi.uploadImage(file);
			return res;
		} catch (error) {
			showNoti('danger', error.Message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};
	// CREATE
	const onCreateTeacher = async (data: any) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		let res;
		try {
			const newTeacher = {
				...data,
				Branch: data.Branch.join(','),
			};
			res = await teacherApi.add(newTeacher);
			if (res.status === 200) {
				onOpenSalaryForm(res.data.data.UserInformationID);
				showNoti('success', res.data.message);
				onResetSearch(); // <== khi tạo xong r reset search để trở về trang đầu tiên
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false,
			});
		}
		return res;
	};
	// UPDATE
	const onUpdateTeacher = async (newObj: any, idx: number) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		let res;
		try {
			const newTeacherAPI = {
				...newObj,
				Branch: newObj.Branch.join(','),
			};
			res = await teacherApi.update(newTeacherAPI);
			if (res.status === 200) {
				const newTeacherList = [...teacherList];
				const newBranch = branchList
					.filter((ob) => newObj.Branch.some((nb) => nb === ob.value))
					.map((b) => ({
						ID: b.value,
						BranchName: b.title,
					}));
				newTeacherList.splice(idx, 1, {
					...newObj,
					// AreaName: areaList.find((a) => a.value === newObj.AreaID).title,
					Branch: newBranch,
				});
				setTeacherList(newTeacherList);
				showNoti('success', res.data.message);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false,
			});
			return res;
		}
	};
	// DELETE
	const onDeleteTeacher = (idx: number) => {
		return async () => {
			setIsLoading({
				type: 'GET_ALL',
				status: true,
			});
			try {
				const delObj = teacherList[idx];
				const newDelObj = {
					...delObj,
					Branch: delObj['Branch'].map((o) => o.ID).join(','),
					Enable: false,
				};
				const res = await teacherApi.delete(newDelObj);
				res.status === 200 && showNoti('success', res.data.message);
				if (teacherList.length === 1) {
					filters.pageIndex === 1
						? (setFilters({
								...listFieldInit,
								...refValue.current,
								pageIndex: 1,
						  }),
						  setTeacherList([]))
						: setFilters({
								...filters,
								...refValue.current,
								pageIndex: filters.pageIndex - 1,
						  });
					return;
				}
				fetchTeacherList();
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false,
				});
			}
		};
	};

	const columns = [
		{
			title: 'Tỉnh/Thành phố',
			dataIndex: 'AreaName',
			...FilterColumn(
				'AreaID',
				onSearch,
				onResetSearch,
				'select',
				optionAreaSystemList.areaList
			),
			className: activeColumnSearch === 'AreaID' ? 'active-column-search' : '',
		},
		{
			title: 'Họ và tên',
			dataIndex: 'FullNameUnicode',
			...FilterColumn('FullNameUnicode', onSearch, onResetSearch, 'text'),
			className:
				activeColumnSearch === 'FullNameUnicode' ? 'active-column-search' : '',
		},
		{
			title: 'SĐT',
			dataIndex: 'Mobile',
		},
		{
			title: 'Email',
			dataIndex: 'Email',
		},
		{
			title: 'Ngày nhận việc',
			dataIndex: 'Jobdate',
			render: (date) => moment(date).format('DD/MM/YYYY'),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusID',
			align: 'center',
			filters: [
				{
					text: 'Active',
					value: 0,
				},
				{
					text: 'Inactive',
					value: 2,
				},
			],
			onFilter: (value, record) => record.StatusID === value,
			render: (status) =>
				status ? (
					<span className="tag gray">Inactive</span>
				) : (
					<span className="tag green">Active</span>
				),
		},

		{
			align: 'center',
			render: (value, _, idx) => (
				<div onClick={(e) => e.stopPropagation()}>
					<Link
						href={{
							pathname: '/staff/teacher-list/teacher-detail/[slug]',
							query: {slug: _.UserInformationID},
						}}
					>
						<Tooltip title="Xem giáo viên">
							<a className="btn btn-icon">
								<Info />
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
						handleUploadImage={onUploadImage}
						handleFetchDistrict={fetchDistrictByAreaID}
						handleFetchWard={fetchWardByDistrictID}
						optionBranchList={branchList}
						handleFetchBranch={fetchBranchByAreaId}
					/>
					<DeleteTableRow
						handleDelete={onDeleteTeacher(idx)}
						text="giáo viên"
					/>
				</div>
			),
		},
	];

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
			<PowerTable
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
						// optionAreaList={areaList}
						optionAreaSystemList={optionAreaSystemList}
						optionBranchList={branchList}
						handleCreateTeacher={onCreateTeacher}
						handleFetchBranch={fetchBranchByAreaId}
					/>
				}
				Extra={
					<div className="extra-table">
						<TeacherFilterForm
							handleFilter={onFilter}
							handleResetFilter={onResetSearch}
						/>
						<SortBox handleSort={onSort} dataOption={sortOptionList} />
					</div>
				}
			/>
		</>
	);
};

export default Teacher;
