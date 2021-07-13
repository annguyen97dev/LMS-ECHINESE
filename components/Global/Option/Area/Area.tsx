import zhCN from 'date-fns/esm/locale/zh-CN/index.js';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {areaApi} from '~/apiBase';
import dayOffApi from '~/apiBase/options/day-off';
import SortBox from '~/components/Elements/SortBox';
import DayOffForm from '~/components/Global/Option/DayOff/DayOffForm';
import PowerTable from '~/components/PowerTable';
import {useWrap} from '~/context/wrap';
import FilterDayOffTable from '../FilterTable/FilterDayOffTable';
import TableSearch from '../TableSearch/TableSearch';
import AreaDelete from './AreaDelete';
import AreaForm from './AreaForm';

const Area = () => {
	const [areaList, setAreaList] = useState<IArea[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const {showNoti} = useWrap();

	// FILTER
	const clearSearchFilter = {
		sort: 0,
		searchAreaName: '',
	};
	const [filter, setFilter] = useState({
		pageIndex: 1,
		pageSize: 10,
		sort: 0,
		searchAreaName: '',
	});
	const sortOptionList = [
		{
			value: 1,
			text: 'Tên tăng dần',
		},
		{
			value: 2,
			text: 'Tên giảm dần',
		},
	];
	// GET DATA IN FIRST TIME
	const fetchAreaList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			let res = await areaApi.getAll(filter);
			if (res.status === 200) {
				setAreaList(res.data.data);
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
	};

	useEffect(() => {
		fetchAreaList();
	}, [filter]);
	// PAGINATION
	const getPagination = (pageIndex: number) => {
		console.log(pageIndex);
		const newFilter = {
			...filter,
			pageIndex,
		};
		setFilter(newFilter);
	};
	// SORT
	const onSort = (value: number) => {
		setFilter({
			...filter,
			...clearSearchFilter,
			sort: value,
		});
	};
	// SEARCH
	const onSearchAreaName = (name: string) => {
		const newFilter = {
			...filter,
			searchAreaName: name,
		};
		setFilter(newFilter);
	};
	const onResetSearch = () => {
		setFilter({
			...filter,
			...clearSearchFilter,
		});
	};
	// CREATE
	const onCreateArea = async (data: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			const res = await areaApi.add({
				...data,
				Enable: true,
			});
			const {data: newData, message} = res.data;
			if (res.status === 200) {
				const newAreaList = [newData, ...areaList];
				setAreaList(newAreaList);
				fetchAreaList();
				showNoti('success', message);
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
	// UPDATE
	const onUpdateArea = async (newObj: any, idx: number, oldObj: any) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			const newArea = {
				...oldObj,
				...newObj,
			};
			const res = await areaApi.update(newArea);
			if (res.status === 200) {
				const {message} = res.data;
				const newAreaList = [...areaList];
				newAreaList.splice(idx, 1, newArea);
				setAreaList(newAreaList);
				showNoti('success', message);
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
	// DELETE
	const onDeleteArea = async (id: number, idx: number) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			const res = await areaApi.delete(id);
			if (res.status === 200) {
				const {message} = res.data;
				const newAreaList = [...areaList];
				newAreaList.splice(idx, 1);
				setAreaList(newAreaList);
				fetchAreaList();
				showNoti('success', message);
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
	// COLUMN FOR TABLE
	const columns = [
		{
			title: 'Mã tỉnh/thành phố',
			dataIndex: 'AreaID',
		},
		{
			title: 'Tên tỉnh/thành phố',
			dataIndex: 'AreaName',
			...TableSearch('AreaName', onSearchAreaName, onResetSearch, 'text'),
		},
		{
			title: 'Ngày khởi tạo',
			dataIndex: 'ModifiedOn',
			render: (date) => moment(date).format('DD/MM/YYYY'),
		},
		{
			title: 'Được tạo bởi',
			dataIndex: 'ModifiedBy',
		},

		{
			render: (value, _, idx) => (
				<>
					<AreaDelete
						handleDeleteArea={onDeleteArea}
						deleteIDObj={value.AreaID}
						index={idx}
					/>
					<AreaForm
						isUpdate={true}
						updateObj={value}
						idxUpdateObj={idx}
						handleUpdateArea={onUpdateArea}
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
			TitlePage="Provincial List"
			TitleCard={<AreaForm isUpdate={false} handleCreateArea={onCreateArea} />}
			dataSource={areaList}
			columns={columns}
			Extra={
				<div className="extra-table">
					<SortBox handleSort={onSort} dataOption={sortOptionList} />
				</div>
			}
		/>
	);
};

export default Area;
