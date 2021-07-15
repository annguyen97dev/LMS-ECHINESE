import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {areaApi, districtApi} from '~/apiBase';
import SortBox from '~/components/Elements/SortBox';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import {useWrap} from '~/context/wrap';
import DistrictDelete from './DistrictDelete';
import DistrictForm from './DistrictForm';

const District = () => {
	const [districtList, setDistrictList] = useState<IDistrict[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const {showNoti} = useWrap();
	const [currentPage, setCurrentPage] = useState(1);
	const [areaList, setAreaList] = useState([]);
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,
		AreaName: '',
		DistrictName: '',
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
			text: 'Tỉnh/tp tăng dần',
		},
		{
			dataSort: {
				sort: 0,
				sortType: false,
			},
			value: 2,
			text: 'Tỉnh/tp giảm dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: true,
			},
			value: 3,
			text: 'Quận tăng dần',
		},
		{
			dataSort: {
				sort: 1,
				sortType: false,
			},
			value: 4,
			text: 'Quận giảm dần',
		},
	];
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
	const fetchDistrictList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			let res = await districtApi.getAll(filter);
			if (res.status === 200) {
				if (res.data.totalRow && res.data.data.length) {
					setDistrictList(res.data.data);
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
		fetchDistrictList();
	}, [filter]);
	const fetchAreaList = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			let res = await areaApi.getAll({
				selectall: true,
			});
			if (res.status === 200) {
				const newAreaList = res.data.data.map((x) => ({
					title: x.AreaName,
					value: x.AreaID,
				}));
				setAreaList(newAreaList);
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
	}, []);

	// CREATE
	const onCreateDistrict = async (data: any) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		let res;
		try {
			res = await districtApi.add({
				...data,
				Enable: true,
			});
			res.status === 200 && showNoti('success', res.data.message);
			onResetSearch(); // <== khi tạo xong r trở về trang đầu tiên
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
	const onUpdateDistrict = async (newObj: any, idx: number) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true,
		});
		let res;
		try {
			res = await districtApi.update(newObj);
			if (res.status === 200) {
				const newDistrictList = [...districtList];
				newDistrictList.splice(idx, 1, newObj);
				setDistrictList(newDistrictList);
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
	// DELETE
	const onDeleteDistrict = async (idx: number) => {
		setIsLoading({
			type: 'GET_ALL',
			status: true,
		});
		try {
			const delObj = districtList[idx];
			const res = await districtApi.delete({
				...delObj,
				Enable: false,
			});
			res.status === 200 && showNoti('success', res.data.message);
			if (districtList.length === 1) {
				filter.pageIndex === 1
					? setFilter({...listFieldInit})
					: setFilter({
							...filter,
							pageIndex: filter.pageIndex - 1,
					  });
				return;
			}
			fetchDistrictList();
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
			title: 'Tên tỉnh/thành phố',
			dataIndex: 'AreaName',
			...FilterColumn('AreaName', onSearch, onResetSearch, 'text'),
		},
		{
			title: 'Tên quận',
			dataIndex: 'DistrictName',
			...FilterColumn('DistrictName', onSearch, onResetSearch, 'text'),
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
				<div onClick={(e) => e.stopPropagation()}>
					<DistrictForm
						optionAreaList={areaList}
						isLoading={isLoading}
						isUpdate={true}
						updateObj={value}
						indexUpdateObj={idx}
						handleUpdateDistrict={onUpdateDistrict}
					/>
					<DistrictDelete handleDeleteDistrict={onDeleteDistrict} index={idx} />
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
			TitlePage="District List"
			TitleCard={
				<DistrictForm
					optionAreaList={areaList}
					isLoading={isLoading}
					isUpdate={false}
					handleCreateDistrict={onCreateDistrict}
				/>
			}
			dataSource={districtList}
			columns={columns}
			Extra={
				<div className="extra-table">
					<SortBox handleSort={onSort} dataOption={sortOptionList} />
				</div>
			}
		/>
	);
};

export default District;
