import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {areaApi} from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import {useWrap} from '~/context/wrap';
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
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: 0,
		sortType: false,
		AreaName: '',
	};
	const [filter, setFilter] = useState(listFieldInit);
	const sortOptionList = [
		{
			dataSort: {
				sort: 1,
				sortType: false,
			},
			value: 1,
			text: 'Tên tăng dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: true,
			},
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
	// CHECK KEY AND VALUE IN LIST FIELD
	const checkField = (valueSearch, dataIndex) => {
		Object.keys(listFieldInit).forEach(function (key) {
			if (key !== dataIndex) {
				listFieldInit[key] = listFieldInit[key];
			} else {
				listFieldInit[key] = valueSearch;
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
	const onResetSearch = () => {
		setFilter({
			...listFieldInit,
		});
	};
	// CREATE
	const onCreateArea = async (data: any) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		let res;
		try {
			res = await areaApi.add({
				...data,
				Enable: true,
			});
			fetchAreaList();
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
	const onUpdateArea = async (newObj: any, oldObj: any) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		let res;
		try {
			const newArea = {
				...oldObj,
				...newObj,
			};
			res = await areaApi.update(newArea);
			fetchAreaList();
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
	// DELETE
	const onDeleteArea = async (id: number, idx: number) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			const delObj = areaList[idx];
			await areaApi.delete({
				...delObj,
				Enable: false,
			});
			if (areaList.length === 1) {
				onResetSearch();
				return;
			}
			fetchAreaList();
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
			...FilterColumn('AreaName', onSearch, onResetSearch, 'text'),
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
					<AreaForm
						isLoading={isLoading}
						isUpdate={true}
						updateObj={value}
						handleUpdateArea={onUpdateArea}
					/>
					<AreaDelete
						handleDeleteArea={onDeleteArea}
						deleteIDObj={value.AreaID}
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
			TitlePage="Provincial List"
			TitleCard={
				<AreaForm
					isLoading={isLoading}
					isUpdate={false}
					handleCreateArea={onCreateArea}
				/>
			}
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
