import { Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { LogIn } from 'react-feather';
import { zoomRoomApi } from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import CloseZoomRoom from './CloseZoomRoom';
import ZoomRoomFilter from './ZoomRoomFilter';

const ZoomRoom = () => {
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const { showNoti, userInformation } = useWrap();
	const [roomList, setRoomList] = useState<IZoomRoom[]>([]);
	const [activeColumnSearch, setActiveColumnSearch] = useState('');

	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,

		fromDate: '',
		toDate: '',
		TeacherName: '',
		IsRoomStart: null
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false
	});
	const [filters, setFilters] = useState(listFieldInit);
	const optionActiveList = [
		{
			title: 'Hoạt động',
			value: true
		},
		{
			title: 'Dừng',
			value: false
		}
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
				sort: 1,
				sortType: true
			},
			value: 3,
			text: 'Ngày học tăng dần'
		},
		{
			dataSort: {
				sort: 1,
				sortType: false
			},
			value: 4,
			text: 'Ngày học giảm dần'
		}
	];
	// FILTER
	const onFilter = (obj) => {
		setFilters({
			...listFieldInit,
			...refValue.current,
			pageIndex: 1,
			...obj,
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

	const fetchRoomList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			const res = await zoomRoomApi.getAll(filters);
			if (res.status === 200) {
				setRoomList(res.data.data);
				setTotalPage(res.data.totalRow);
			}
			if (res.status === 204) {
				setRoomList([]);
				setTotalPage(0);
				showNoti('danger', 'Danh sách trống');
			}
		} catch (error) {
			console.log('fetchRoomList', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};
	useEffect(() => {
		fetchRoomList();
	}, [filters]);

	const onCloseRoom = async (schedule: IZoomRoom, idx: number) => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			const res = await zoomRoomApi.closeRoom(schedule.CourseScheduleID);

			if (res.status === 200) {
				const newRoomList = [...roomList];
				const newRoom: IZoomRoom = { ...newRoomList[idx], IsRoomStart: false };
				newRoomList.splice(idx, 1, newRoom);
				setRoomList(newRoomList);
				showNoti('success', 'Phòng học đã đóng');
			}
		} catch (error) {
			console.log('onCloseRoom', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};
	const columns = [
		{
			title: 'ID phòng',
			dataIndex: 'ZoomRoomID'
		},
		{ title: 'Mật khẩu phòng', dataIndex: 'ZoomRoomPass' },
		{
			title: 'Giáo viên',
			dataIndex: 'TeacherName',
			...FilterColumn('TeacherName', onSearch, onResetSearch)
		},
		{
			title: 'Ngày học',
			dataIndex: 'Date',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
        {
			title: 'Giờ học',
			dataIndex: 'StudyTimeName',
		},
		{
			align: 'center',
			title: 'Trạng thái',
			dataIndex: 'IsRoomStart',
			render: (IsRoomStart) => (IsRoomStart ? <span className="tag blue">Hoạt động</span> : <span className="tag gray">Dừng</span>),
			...FilterColumn('IsRoomStart', onSearch, onResetSearch, 'select', optionActiveList)
		},
		{
			width: 100,
			align: 'center',
			dataIndex: 'IsRoomStart',
			render: (IsRoomStart, record: IZoomRoom, idx) =>
				IsRoomStart && (
					<>
						<Tooltip title="Tham gia phòng học">
							<a target="_blank" href={`/course/zoom-view/${record.CourseScheduleID}`}>
								<LogIn />
							</a>
						</Tooltip>
						<Tooltip title="Đóng phòng học">
							<CloseZoomRoom handleClose={() => onCloseRoom(record, idx)} />
						</Tooltip>
					</>
				)
		}
	];

	return (
		<PowerTable
			currentPage={filters.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			loading={isLoading}
			addClass="basic-header"
			columns={columns}
			dataSource={roomList}
			TitlePage="Danh sách giáo viên"
			TitleCard={null}
			Extra={
				<div className="extra-table">
					<ZoomRoomFilter handleFilter={onFilter} handleResetFilter={onResetSearch} />
					<SortBox handleSort={onSort} dataOption={sortOptionList} />
				</div>
			}
		/>
	);
};
export default ZoomRoom;
