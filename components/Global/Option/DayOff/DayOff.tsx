import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { dayOffApi } from '~/apiBase';
import DeleteTableRow from '~/components/Elements/DeleteTableRow/DeleteTableRow';
import SortBox from '~/components/Elements/SortBox';
import DayOffForm from '~/components/Global/Option/DayOff/DayOffForm';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import DayOffFilterForm from './DayOffFilterForm';

const DayOff = () => {
	const [dayOffList, setDayOffList] = useState<IDayOff[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const { showNoti, pageSize, isAdmin } = useWrap();
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: pageSize,
		sort: -1,
		sortType: false,
		DayOff: '',
		DayOffName: '',
		fromDate: '',
		toDate: ''
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false
	});
	const [filters, setFilters] = useState(listFieldInit);
	// SORT OPTION
	const sortOptionList = [
		{
			dataSort: {
				sort: 0,
				sortType: true
			},
			value: 1,
			text: 'Ngày tăng dần'
		},
		{
			dataSort: {
				sort: 0,
				sortType: false
			},
			value: 2,
			text: 'Ngày giảm dần'
		},
		{
			dataSort: {
				sort: 1,
				sortType: true
			},
			value: 3,
			text: 'Tên tăng dần'
		},
		{
			dataSort: {
				sort: 1,
				sortType: false
			},
			value: 4,
			text: 'Tên giảm dần'
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

	// GET DATA IN FIRST TIME
	const fetchDayOffList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await dayOffApi.getAll(filters);

			if (res.status === 200) {
				if (res.data.totalRow && res.data.data.length) {
					setDayOffList(res.data.data);
					setTotalPage(res.data.totalRow);
				}
			} else if (res.status === 204) {
				showNoti('danger', 'Không tìm thấy');
				setDayOffList([]);
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
		fetchDayOffList();
	}, [filters]);

	// CREATE
	const onCreateDayOff = async (data: any) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});
		let res;
		try {
			res = await dayOffApi.add({
				...data,
				Enable: true
			});
			res.status === 200 && showNoti('success', res.data.message);
			onResetSearch(); // <== khi tạo xong r reset search để trở về trang đầu tiên
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
	const onUpdateDayOff = async (newObj: any, idx: number) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
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
				status: false
			});
			return res;
		}
	};
	// DELETE
	const onDeleteDayOff = (idx: number) => {
		return async () => {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			try {
				const delObj = dayOffList[idx];
				const res = await dayOffApi.delete({
					...delObj,
					Enable: false
				});
				res.status === 200 && showNoti('success', res.data.message);
				if (dayOffList.length === 1) {
					filters.pageIndex === 1
						? (setFilters({
								...listFieldInit,
								...refValue.current,
								pageIndex: 1
						  }),
						  setDayOffList([]))
						: setFilters({
								...filters,
								...refValue.current,
								pageIndex: filters.pageIndex - 1
						  });
					return;
				}
				fetchDayOffList();
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false
				});
			}
		};
	};
	// COLUMN FOR TABLE
	const columns = [
		{
			title: 'Ngày nghỉ',
			dataIndex: 'DayOff',
			...FilterColumn('DayOff', onSearch, onResetSearch, 'date'),
			render: (date) => moment(date).format('DD/MM/YYYY'),
			className: activeColumnSearch === 'DayOff' ? 'active-column-search' : ''
		},
		{
			title: 'Ghi chú',
			dataIndex: 'DayOffName',
			...FilterColumn('DayOffName', onSearch, onResetSearch, 'text'),
			className: activeColumnSearch === 'DayOffName' ? 'active-column-search' : ''
		},
		{
			title: 'Ngày khởi tạo',
			dataIndex: 'CreatedOn',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			title: 'Được tạo bởi',
			dataIndex: 'CreatedBy'
		},
		{
			align: 'center',
			render: (value, _, idx) => (
				// VÌ KHI CLICK VÀO THẰNG TALBE THÌ TRIGGER LUÔN CẢ FUNCTION CỦA CÁC THẰNG BÊN TRONG
				<div onClick={(e) => e.stopPropagation()}>
					{isAdmin && (
						<>
							<DayOffForm
								isLoading={isLoading}
								isUpdate={true}
								updateObj={value}
								indexUpdateObj={idx}
								handleUpdateDayOff={onUpdateDayOff}
							/>
							<DeleteTableRow handleDelete={onDeleteDayOff(idx)} />
						</>
					)}
				</div>
			)
		}
	];
	// RETURN
	return (
		<PowerTable
			currentPage={filters.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			loading={isLoading}
			addClass="basic-header"
			TitlePage="Ngày nghỉ"
			TitleCard={isAdmin && <DayOffForm isLoading={isLoading} isUpdate={false} handleCreateDayOff={onCreateDayOff} />}
			dataSource={dayOffList}
			columns={columns}
			Extra={
				<div className="extra-table">
					<DayOffFilterForm handleFilter={onFilter} handleResetFilter={onResetSearch} />
					<SortBox handleSort={onSort} dataOption={sortOptionList} />
				</div>
			}
		/>
	);
};

export default DayOff;
