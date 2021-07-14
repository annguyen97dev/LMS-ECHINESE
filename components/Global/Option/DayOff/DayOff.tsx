import moment from 'moment';
import React, {useEffect, useState} from 'react';
import dayOffApi from '~/apiBase/options/day-off';
import SortBox from '~/components/Elements/SortBox';
import DayOffForm from '~/components/Global/Option/DayOff/DayOffForm';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import {useWrap} from '~/context/wrap';
import DayOffDelete from './DayOffDelete';
import DayOffFilterForm from './DayOffFilterForm';

const DayOff = () => {
	const [dayOffList, setDayOffList] = useState<IDayOff[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const {showNoti} = useWrap();

	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: 0,
		sortType: false,
		DayOff: '',
		DayOffName: '',
		fromDate: '',
		toDate: '',
		searchCreateby: '',
	};
	const [filter, setFilter] = useState(listFieldInit);
	// FILTER OPTION
	const [filterOptionList, setFilterOptionList] = useState([]);
	// SORT OPTION
	const sortOptionList = [
		{
			dataSort: {
				sort: 1,
				sortType: false,
			},
			value: 1,
			text: 'Ngày tăng dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: true,
			},
			value: 2,
			text: 'Ngày giảm dần',
		},
		{
			dataSort: {
				sort: 2,
				sortType: true,
			},
			value: 3,
			text: 'Tên tăng dần',
		},
		{
			dataSort: {
				sort: 2,
				sortType: false,
			},
			value: 4,
			text: 'Tên giảm dần',
		},
	];
	// FILTER
	const fetchCreated = async () => {
		try {
			let res = await dayOffApi.getAll({
				selectAll: true,
			});
			if (res.status === 200) {
				const data = res.data.data;
				const createdList = data.map((x) => ({
					title: x.CreatedBy,
					value: x.CreatedBy,
				}));
				const clearCreatedList = createdList.reduce((arr, obj) => {
					if (!arr.some((arrInObj) => arrInObj.value === obj.value)) {
						arr.push(obj);
					}
					return arr;
				}, []);
				setFilterOptionList([
					{title: 'Tất cả', value: ''},
					...clearCreatedList,
				]);
			}
		} catch (error) {
			showNoti('danger', error.message);
		}
	};
	const onFilterDayOff = (value) => {
		// setIsLoading({
		// 	type: 'FILTER_CREATED',
		// 	status: true,
		// });
		setFilter({
			...listFieldInit,
			searchCreateby: value.createdBy,
		});
	};
	// PAGINATION
	const getPagination = (pageIndex: number) => {
		const newFilter = {
			...filter,
			pageIndex,
		};
		setFilter(newFilter);
	};
	// SORT
	const onSort = (option) => {
		setFilter({
			...listFieldInit,
			sort: option.title.sort,
			sortType: option.title.sortType,
		});
	};
	// RESET SEARCH
	const onResetSearch = () => {
		setFilter({
			...listFieldInit,
		});
	};
	// CHECK KEY AND VALUE IN LIST FIELD
	const checkField = (valueSearch, dataIndex) => {
		Object.keys(listFieldInit).forEach(function (key) {
			if (key !== dataIndex) {
				listFieldInit[key] = listFieldInit[key];
			} else {
				listFieldInit[key] = valueSearch;
			}
			if (dataIndex == 'CreatedOn') {
				listFieldInit.fromDate = valueSearch.fromDate;
				listFieldInit.toDate = valueSearch.toDate;
			}
		});

		return listFieldInit;
	};
	// ACTION SEARCH
	const onSearch = (valueSearch, dataIndex) => {
		let clearKey = checkField(valueSearch, dataIndex);

		setFilter({
			...filter,
			...clearKey,
		});
	};

	// GET DATA IN FIRST TIME
	const fetchDayOffList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			let res = await dayOffApi.getAll(filter);

			if (res.status === 200) {
				setDayOffList(res.data.data);
				setTotalPage(res.data.totalRow);
				res.data.data.length > 0
					? showNoti('success', res.data.message)
					: showNoti('danger', 'Không tìm thấy');
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
		fetchCreated();
	};

	useEffect(() => {
		fetchDayOffList();
	}, [filter]);

	// CREATE
	const onCreateDayOff = async (data: any) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		let res;
		try {
			res = await dayOffApi.add({
				...data,
				Enable: true,
			});
			fetchDayOffList();
			// onResetSearch <== nên thử khi tạo xong r reset search để trở về trang
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
	const onUpdateDayOff = async (newObj: any) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		let res;
		try {
			res = await dayOffApi.update(newObj);
			fetchDayOffList();
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
	const onDeleteDayOff = async (id: number, idx: number) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			const delObj = dayOffList[idx];
			await dayOffApi.delete({
				...delObj,
				Enable: false,
			});
			if (dayOffList.length === 1) {
				onResetSearch();
				return;
			}
			fetchDayOffList();
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false,
			});
		}
	};
	// COLUMN FOR TABLE
	const columns = [
		{
			title: 'Ngày nghỉ',
			dataIndex: 'DayOff',
			...FilterColumn('DayOff', onSearch, onResetSearch, 'date'),
			render: (date) => moment(date).format('DD/MM/YYYY'),
		},
		{
			title: 'Ghi chú',
			dataIndex: 'DayOffName',
			...FilterColumn('DayOffName', onSearch, onResetSearch, 'text'),
		},
		{
			title: 'Ngày khởi tạo',
			dataIndex: 'CreatedOn',
			//   ...FilterColumn("CreatedOn", onSearch, onResetSearch, "date-range"),
			render: (date) => moment(date).format('DD/MM/YYYY'),
		},
		{
			title: 'Được tạo bởi',
			dataIndex: 'CreatedBy',
		},
		{
			render: (value, _, idx) => (
				<>
					<DayOffForm
						isLoading={isLoading}
						isUpdate={true}
						updateObj={value}
						handleUpdateDayOff={onUpdateDayOff}
					/>
					<DayOffDelete
						handleDeleteDayOff={onDeleteDayOff}
						deleteIDObj={value.ID}
						index={idx}
					/>
				</>
			),
		},
	];
	// RETURN
	return (
		<PowerTable
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			loading={isLoading}
			addClass="basic-header"
			TitlePage="Day Off"
			TitleCard={
				<DayOffForm
					isLoading={isLoading}
					isUpdate={false}
					handleCreateDayOff={onCreateDayOff}
				/>
			}
			dataSource={dayOffList}
			columns={columns}
			Extra={
				<div className="extra-table">
					<DayOffFilterForm
						dataOption={filterOptionList}
						isLoading={isLoading}
						handleFilterDayOff={onFilterDayOff}
					/>
					<SortBox handleSort={onSort} dataOption={sortOptionList} />
				</div>
			}
		/>
	);
};

export default DayOff;
