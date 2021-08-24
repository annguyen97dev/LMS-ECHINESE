import moment from 'moment';
import {useEffect, useRef, useState} from 'react';
import {
	staffOfTaskGroupApi,
	taskApi,
	taskGroupApi,
	userInformationApi,
} from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import {useDebounce} from '~/context/useDebounce';
import {useWrap} from '~/context/wrap';
import {fmSelectArr, mathRound} from '~/utils/functions';
import StaffOfTaskGroupForm from './StaffOfTaskGroup/StaffOfTaskGroupForm';
import TaskForm from './Task/TaskForm';
import TaskGroupDelete from './TaskGroup/TaskGroupDelete';
import TaskGroupFilterDate from './TaskGroup/TaskGroupFilterDate';
import TaskGroupForm from './TaskGroup/TaskGroupForm';

const ManageTask = () => {
	// ----------STATE----------
	const [taskGroupList, setTaskGroupList] = useState<ITaskGroup[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const {showNoti, userInformation} = useWrap();
	const [optionStaffList, setOptionStaffList] = useState<IOptionCommon[]>([]);
	const [staffOfTaskGroup, setStaffOfTaskGroup] = useState<IStaffOfTaskGroup[]>(
		[]
	);
	const [taskList, setTaskList] = useState<ITask[]>([]);
	const [optionTaskList, setOptionTaskList] = useState<IOptionCommon[]>([]);
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,

		DoneTaskGroup: '',
		TaskGroupName: '',
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

	// ----------TASK GROUP----------
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
				sort: 1,
				sortType: true,
			},
			value: 1,
			text: 'Thời hạn tăng dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: false,
			},
			value: 2,
			text: 'Thời hạn giảm dần',
		},
		{
			dataSort: {
				sort: 2,
				sortType: true,
			},
			value: 3,
			text: 'Tiến độ tăng dần',
		},
		{
			dataSort: {
				sort: 2,
				sortType: false,
			},
			value: 4,
			text: 'Tiến độ giảm dần',
		},
	];
	// FILTER
	const onFilter = (arr: string[]) => {
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			fromDate: arr[0],
			toDate: arr[1],
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
		setFilters({
			...listFieldInit,
			pageSize: refValue.current.pageSize,
		});
	};
	// ACTION SEARCH
	const onSearch = (valueSearch, dataIndex) => {
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			[dataIndex]: valueSearch,
		});
	};
	// CREATE
	const onCreateTaskGroup = async (data: {
		TaskGroupName: string;
		Note: string;
		Deadline: string;
	}) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		let res;
		try {
			res = await taskGroupApi.add(data);
			if (res.status === 200) {
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
	const onUpdateTaskGroup = async (newObj: ITaskGroup, idx: number) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		let res;
		try {
			const {ID, TaskGroupName, Note, Deadline, Enable} = newObj;
			const newTaskGroup = {
				ID,
				TaskGroupName,
				Note,
				Deadline,
				Enable,
			};
			res = await taskGroupApi.update(newTaskGroup);
			if (res.status === 200) {
				const newTaskGroupList = [...taskGroupList];
				newTaskGroupList.splice(idx, 1, {
					...newObj,
				});
				setTaskGroupList(newTaskGroupList);
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
	const onDeleteTaskGroup = async (idx: number) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			const delObj = taskGroupList[idx];
			const {ID, TaskGroupName, Note, Deadline} = delObj;
			const newDelObj = {
				ID,
				TaskGroupName,
				Note,
				Deadline,
				Enable: false,
			};
			const res = await taskGroupApi.delete(newDelObj);
			res.status === 200 && showNoti('success', res.data.message);
			if (taskGroupList.length === 1) {
				filters.pageIndex === 1
					? (setFilters({
							...listFieldInit,
							...refValue.current,
							pageIndex: 1,
					  }),
					  setTaskGroupList([]))
					: setFilters({
							...filters,
							...refValue.current,
							pageIndex: filters.pageIndex - 1,
					  });
				return;
			}
			fetchGroupTask();
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};
	const fetchGroupTask = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			let res = await taskGroupApi.getAll(filters);
			if (res.status === 200) {
				if (res.data.totalRow && res.data.data.length) {
					setTaskGroupList(res.data.data);
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
	const onDebounceFetchGroupTask = useDebounce(fetchGroupTask, 500, []);
	useEffect(() => {
		fetchGroupTask();
	}, [filters]);
	// ----------STAFF OF TASK GROUP----------
	const optionRoleList = [
		{
			title: 'Admin',
			value: 1,
		},
		{
			title: 'Giáo viên',
			value: 2,
		},
		{
			title: 'Nhân viên quản lý',
			value: 5,
		},
		{
			title: 'Sale',
			value: 6,
		},
		{
			title: 'Học vụ',
			value: 7,
		},
		{
			title: 'Quản lý chuyên môn',
			value: 8,
		},
		{
			title: 'Kế toán',
			value: 9,
		},
	];
	const fetchStaffListByRole = async (RoleID: number) => {
		setIsLoading({type: 'FETCH_STAFF', status: true});
		try {
			const res = await userInformationApi.getAllParams({
				RoleID,
				pageSize: 999,
			});
			if (res.status === 200) {
				const fmOptionStaffList = fmSelectArr(
					res.data.data,
					'FullNameUnicode',
					'UserInformationID'
				);
				setOptionStaffList(fmOptionStaffList);
			}
			if (res.status === 204) {
				setOptionStaffList([]);
			}
		} catch (error) {
			console.log('fetchStaffListByRole', error);
		} finally {
			setIsLoading({type: 'FETCH_STAFF', status: false});
		}
	};
	const fetchStaffOfTaskGroup = async (TaskGroupID: number) => {
		setIsLoading({type: 'GET_ALL', status: true});
		try {
			const res = await staffOfTaskGroupApi.getAll({
				TaskGroupID,
				pageSize: 99,
			});
			if (res.status === 200) {
				const addKeyToStaff = res.data.data.map((s, idx) => ({...s, key: idx}));
				setStaffOfTaskGroup(addKeyToStaff);
			}
			if (res.status === 204) {
				setStaffOfTaskGroup([]);
			}
		} catch (error) {
			console.log('fetchStaffOfTaskGroup', error);
		} finally {
			setIsLoading({type: 'GET_ALL', status: false});
		}
	};
	const middlewareCreateStaffOfTaskGroup = (ID: number) => {
		return async (obj: {
			RoleID: number;
			StaffID: number;
			isAddTask: boolean;
			TaskID?: number;
		}) => {
			const {StaffID, isAddTask, TaskID} = obj;
			let isDone = true;
			await onCreateStaffOfTaskGroup({
				TaskGroupID: ID,
				StaffID,
			}).then((res) => {
				if (res?.status !== 200) isDone = false;
			});
			if (isAddTask && isDone) {
				await onUpdateTask({ID: TaskID, StaffID}).then((res) => {
					if (res?.status !== 200) isDone = false;
				});
			}
			return isDone;
		};
	};
	const onCreateStaffOfTaskGroup = async (obj: {
		TaskGroupID: number;
		StaffID: number;
	}) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		let res;
		try {
			res = await staffOfTaskGroupApi.add(obj);
			if (res.status === 200) {
				const newStaff = {
					...res.data.data,
					key: staffOfTaskGroup.length,
				};
				setStaffOfTaskGroup([newStaff, ...staffOfTaskGroup]);
				showNoti('success', res.data.message);
			}
			if (res.status === 204) {
				showNoti('danger', res.data.message);
			}
		} catch (error) {
			showNoti('danger', error.message);
			console.log('fetchTask', error);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false,
			});
		}
		return res;
	};
	const onDeleteStaffOfTaskGroup = async (idx: number) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			const delObj = staffOfTaskGroup[idx];
			const newDelObj = {
				ID: delObj.ID,
				Enable: false,
			};
			const res = await staffOfTaskGroupApi.delete(newDelObj);
			if (res.status === 200) {
				showNoti('success', res.data.message);
				const newStaffOfTaskGroup = [...staffOfTaskGroup];
				newStaffOfTaskGroup.splice(idx, 1);
				setStaffOfTaskGroup(newStaffOfTaskGroup);
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
	// ----------TASK----------
	const fetchTask = async (TaskGroupID: number) => {
		setIsLoading({
			type: 'FETCH_TASK',
			status: true,
		});
		try {
			const res = await taskApi.getAll({
				TaskGroupID,
			});
			if (res.status === 200) {
				const fmOptionTaskList = fmSelectArr(
					res.data.data,
					'WorkContent',
					'ID',
					['DoneTask', 'StaffID']
				).filter((s) => !s.options.StaffID && s.options.DoneTask === false);
				setTaskList(res.data.data);
				setOptionTaskList(fmOptionTaskList);
			}
			if (res.status === 204) {
				setTaskList([]);
				setOptionTaskList([]);
			}
		} catch (error) {
			console.log('fetchTask', error);
		} finally {
			setIsLoading({
				type: 'FETCH_TASK',
				status: false,
			});
		}
	};
	const middlewareCreateTask = (ID: number) => {
		return async (obj: {
			WorkContent: number;
			isAddStaff: boolean;
			RoleID?: number;
			StaffID?: number;
		}) => {
			const {WorkContent, isAddStaff, StaffID} = obj;
			let isDone = true;
			if (isAddStaff) {
				await onCreateStaffOfTaskGroup({
					TaskGroupID: ID,
					StaffID,
				}).then((res) => {
					if (res?.status !== 200) isDone = false;
				});
			}
			if (isDone) {
				const checkStaffID = isAddStaff ? StaffID : null;
				await onCreateTask({
					TaskGroupID: ID,
					WorkContent,
					StaffID: checkStaffID,
				}).then((res) => {
					if (res?.status !== 200) isDone = false;
				});
			}
			return isDone;
		};
	};
	const onCreateTask = async (obj: {
		TaskGroupID: number;
		WorkContent: number;
		StaffID?: number;
	}) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		let res;
		try {
			res = await taskApi.add(obj);
			if (res.status === 200) {
				setTaskList([res.data.data, ...taskList]);
				showNoti('success', res.data.message);
			}
			if (res.status === 204) {
				showNoti('danger', res.data.message);
			}
		} catch (error) {
			showNoti('danger', error.message);
			console.log('fetchTask', error);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false,
			});
		}
		return res;
	};
	const onUpdateTask = async (
		obj: {
			ID: number;
			StaffID?: number;
			WorkContent?: string;
			DoneTask?: boolean;
			Enable?: boolean;
		},
		idx?: number
	) => {
		setIsLoading({
			type: 'FETCH_TASK',
			status: true,
		});
		let res;
		try {
			res = await taskApi.update(obj);
			if (res.status === 200) {
				if (idx >= 0) {
					const {StaffName, StaffID, DoneTask, WorkContent, RoleID, RoleName} =
						res.data.data;
					const newTaskList = [...taskList];
					const newTask = {
						...newTaskList[idx],
						StaffName,
						StaffID,
						DoneTask,
						WorkContent,
						RoleID,
						RoleName,
					};
					newTaskList.splice(idx, 1, newTask);
					setTaskList(newTaskList);
				}
				showNoti('success', res.data.message);
			}
			if (res.status === 204) {
				showNoti('danger', res.data.message);
			}
		} catch (error) {
			showNoti('danger', error.message);
			console.log('fetchTask', error);
		} finally {
			setIsLoading({
				type: 'FETCH_TASK',
				status: false,
			});
		}
		return res;
	};
	const onDebounceActionOfStaff = useDebounce(onUpdateTask, 500, []);
	const onDeleteTask = async (idx: number) => {
		setIsLoading({
			type: 'FETCH_TASK',
			status: true,
		});
		try {
			const delObj = taskList[idx];
			const newDelObj = {
				ID: delObj.ID,
				Enable: false,
			};
			const res = await taskApi.delete(newDelObj);
			if (res.status === 200) {
				showNoti('success', res.data.message);
				const newTaskList = [...taskList];
				newTaskList.splice(idx, 1);
				setTaskList(newTaskList);
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'FETCH_TASK',
				status: false,
			});
		}
	};
	// ----------COLUMN----------
	const checkAuthorization = (StaffID?: number) => {
		if (!userInformation) return;
		const role = userInformation['RoleID'];
		const uid = userInformation.UserInformationID;
		if (role === 1 || role === 5 || +StaffID === +uid) {
			return 'Accept';
		}
		return 'Ignore';
	};
	const columns = [
		{
			title: 'Nhóm công việc',
			dataIndex: 'TaskGroupName',
			...FilterColumn('TaskGroupName', onSearch, onResetSearch, 'text'),
		},
		{
			title: 'Ghi chú',
			dataIndex: 'Note',
		},
		{
			title: 'Thời hạn',
			dataIndex: 'Deadline',
			render: (text) => moment(text).format('DD/MM/YYYY'),
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			render: (text) => moment(text).format('DD/MM/YYYY'),
		},
		{
			title: 'Tiến độ',
			dataIndex: 'DonePercent',
			render: (text) => mathRound(text) + '%  ',
		},
		{
			align: 'center',
			render: (value: ITaskGroup, _, idx) => (
				<div onClick={(e) => e.stopPropagation()}>
					<TaskForm
						isLoading={isLoading}
						handleFetchTask={() => fetchTask(value.ID)}
						taskList={taskList}
						handleFetchStaffListByRole={fetchStaffListByRole}
						optionRoleList={optionRoleList}
						optionStaffList={optionStaffList}
						handleSubmit={middlewareCreateTask(value.ID)}
						handleUpdateTask={onUpdateTask}
						handleDeleteTask={onDeleteTask}
						handleActionOfStaff={onDebounceActionOfStaff}
						checkAuthorization={checkAuthorization}
						userInformation={userInformation}
						handleFetchGroupTask={onDebounceFetchGroupTask}
					/>
					{checkAuthorization() === 'Accept' && (
						<>
							<StaffOfTaskGroupForm
								isLoading={isLoading}
								optionRoleList={optionRoleList}
								optionStaffList={optionStaffList}
								staffOfTaskGroup={staffOfTaskGroup}
								optionTaskList={optionTaskList}
								handleFetchStaffOfTaskGroup={() =>
									fetchStaffOfTaskGroup(value.ID)
								}
								handleFetchStaffListByRole={fetchStaffListByRole}
								handleFetchTask={() => fetchTask(value.ID)}
								handleSubmit={middlewareCreateStaffOfTaskGroup(value.ID)}
								//
								handleDeleteStaffOfTaskGroup={onDeleteStaffOfTaskGroup}
							/>
							<TaskGroupForm
								isLoading={isLoading}
								isUpdate={true}
								updateObj={value}
								indexUpdateObj={idx}
								handleUpdateTaskGroup={onUpdateTaskGroup}
							/>
							<TaskGroupDelete
								handleDeleteTaskGroup={onDeleteTaskGroup}
								index={idx}
							/>
						</>
					)}
				</div>
			),
		},
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
				dataSource={taskGroupList}
				TitlePage="Danh sách giáo viên"
				TitleCard={
					checkAuthorization() === 'Accept' && (
						<TaskGroupForm
							isLoading={isLoading}
							handleCreateTaskGroup={onCreateTaskGroup}
						/>
					)
				}
				Extra={
					<div className="extra-table">
						<div className="filter-datetime">
							<TaskGroupFilterDate handleFilter={onFilter} />
						</div>
						<SortBox handleSort={onSort} dataOption={sortOptionList} />
					</div>
				}
			></PowerTable>
		</>
	);
};

ManageTask.layout = LayoutBase;
export default ManageTask;
