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
	const [currentPage, setCurrentPage] = useState(1);
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,
		DayOff: '',
		DayOffName: '',
		fromDate: '',
		toDate: '',
	};
	const [filter, setFilter] = useState(listFieldInit);
	// SORT OPTION
	const sortOptionList = [
		{
			dataSort: {
				sort: 0,
				sortType: true,
			},
			value: 1,
			text: 'Ngày tăng dần',
		},
		{
			dataSort: {
				sort: 0,
				sortType: false,
			},
			value: 2,
			text: 'Ngày giảm dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: true,
			},
			value: 3,
			text: 'Tên tăng dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: false,
			},
			value: 4,
			text: 'Tên giảm dần',
		},
	];
	// FILTER
	const onFilterDayOff = (obj) => {
		setFilter({
			...listFieldInit,
			fromDate: moment(obj.fromDate).format('YYYY/MM/DD'),
			toDate: moment(obj.toDate).format('YYYY/MM/DD'),
		});
	};
	// PAGINATION
	const getPagination = (pageIndex: number) => {
		setFilter({
			...filter,
			pageIndex,
		});
		setCurrentPage(pageIndex);
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
	// ACTION SEARCH
	const onSearch = (valueSearch, dataIndex) => {
		setFilter({
			...listFieldInit,
			[dataIndex]: valueSearch,
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
				if (res.data.totalRow && res.data.data.length) {
					setDayOffList(res.data.data);
					setTotalPage(res.data.totalRow);
				}
			} else if (res.status === 204) {
				setFilter({
					...listFieldInit,
					pageIndex: currentPage,
				});
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
			res.status === 200 && showNoti('success', res.data.message);
			onResetSearch(); // <== khi tạo xong r reset search để trở về trang đầu tiên
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
	const onUpdateDayOff = async (newObj: any, idx: number) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		let res;
		try {
			res = await dayOffApi.update(newObj);
			if (res.status === 200) {
				const newDayOffList = [...dayOffList];
				newDayOffList.splice(idx, 1, newObj);
				setDayOffList(newDayOffList);
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
	const onDeleteDayOff = async (idx: number) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			const delObj = dayOffList[idx];
			const res = await dayOffApi.delete({
				...delObj,
				Enable: false,
			});
			res.status === 200 && showNoti('success', res.data.message);
			if (dayOffList.length === 1) {
				setFilter({
					...listFieldInit,
					pageIndex: filter.pageIndex - 1 > 0 ? filter.pageIndex - 1 : 1,
				});
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
			render: (date) => moment(date).format('DD/MM/YYYY'),
		},
		{
			title: 'Được tạo bởi',
			dataIndex: 'CreatedBy',
		},
		{
			render: (value, _, idx) => (
				// VÌ KHI CLICK VÀO THẰNG TALBE THÌ TRIGGER LUÔN CẢ FUNCTION CỦA CÁC THẰNG BÊN TRONG
				<div onClick={(e) => e.stopPropagation()}>
					<DayOffForm
						isLoading={isLoading}
						isUpdate={true}
						updateObj={value}
						indexUpdateObj={idx}
						handleUpdateDayOff={onUpdateDayOff}
					/>
					<DayOffDelete
						handleDeleteDayOff={onDeleteDayOff}
						deleteIDObj={value.ID}
						index={idx}
					/>
				</div>
			),
		},
	];
	// RETURN
	return (
		<PowerTable
			currentPage={filter.pageIndex}
			totalPage={totalPage}
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
					<DayOffFilterForm handleFilterDayOff={onFilterDayOff} />
					<SortBox handleSort={onSort} dataOption={sortOptionList} />
				</div>
			}
		/>
	);
};

export default DayOff;
