import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { configZoomApi } from '~/apiBase';
import DeleteTableRow from '~/components/Elements/DeleteTableRow/DeleteTableRow';
import SortBox from '~/components/Elements/SortBox';
import ConfigZoomForm from '~/components/Global/ManageZoom/Config/ConfigZoomForm';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';

function ConfigZoom() {
	const [configZoomList, setConfigZoomList] = useState<IConfigZoom[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: 'GET_ALL',
		status: false
	});
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
	const [totalPage, setTotalPage] = useState(0);
	const { showNoti } = useWrap();
	const sortOptionList = [
		{
			dataSort: {
				sort: 1,
				sortType: true
			},
			value: 1,
			text: 'Ngày tạo tăng dần'
		},
		{
			dataSort: {
				sort: 1,
				sortType: false
			},
			value: 2,
			text: 'Ngày tạo giảm dần'
		}
	];
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: 10,
		sort: -1,
		sortType: false,

		fromDate: '',
		toDate: '',
		UserZoom: '',
		Active: null
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
			label: 'Hoạt động',
			title: 'Hoạt động',
			value: true
		},
		{
			label: 'Dừng',
			title: 'Dừng',
			value: false
		}
	];

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
		if (dataIndex === 'CreatedOn') {
			setFilters({
				...listFieldInit,
				...refValue.current,
				pageIndex: 1,
				...valueSearch
			});
		} else {
			setFilters({
				...listFieldInit,
				...refValue.current,
				pageIndex: 1,
				[dataIndex]: valueSearch
			});
		}
	};
	const fetchConfigZoomList = async () => {
		try {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			const res = await configZoomApi.getAll(filters);
			if (res.status === 200) {
				setConfigZoomList(res.data.data);
				setTotalPage(res.data.totalRow);
			}
		} catch (error) {
			console.log('fetchConfigZoomList', error.message);
		} finally {
			setIsLoading({
				type: 'GET_ALL',
				status: false
			});
		}
	};

	useEffect(() => {
		fetchConfigZoomList();
	}, [filters]);

	// CREATE
	const onCreateConfigZoom = async (data: { UserZoom: string; APIKey: string; APISecret: string }) => {
		try {
			setIsLoading({
				type: 'ADD_DATA',
				status: true
			});
			const res = await configZoomApi.add(data);
			if (res.status === 200) {
				const newConfigZoomList = [res.data.data, ...configZoomList];
				setConfigZoomList(newConfigZoomList);
				showNoti('success', res.data.message);
				return true;
			}
		} catch (error) {
			console.log('onCreateConfigZoom', error.message);
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};
	// UPDATE
	const onUpdateConfigZoom = (idx: number) => {
		return async (data: { UserZoom: string; APIKey: string; APISecret: string }) => {
			try {
				setIsLoading({
					type: 'ADD_DATA',
					status: true
				});
				const res = await configZoomApi.update(data);
				if (res.status === 200) {
					const newConfigZoomList = [...configZoomList];
					newConfigZoomList.splice(idx, 1, {
						...newConfigZoomList[idx],
						...data
					});
					setConfigZoomList(newConfigZoomList);
					return true;
				}
			} catch (error) {
				console.log('onUpdateConfigZoom', error.message);
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false
				});
			}
		};
	};
	// DELETE
	const onDeleteConfigZoom = (idx: number) => {
		return async () => {
			setIsLoading({
				type: 'GET_ALL',
				status: true
			});
			try {
				const delObj = configZoomList[idx];
				const { ID } = delObj;
				const newDelObj = {
					ID,
					Enable: false
				};
				const res = await configZoomApi.delete(newDelObj);
				res.status === 200 && showNoti('success', res.data.message);
				if (configZoomList.length === 1) {
					filters.pageIndex === 1
						? (setFilters({
								...listFieldInit,
								...refValue.current,
								pageIndex: 1
						  }),
						  setConfigZoomList([]))
						: setFilters({
								...filters,
								...refValue.current,
								pageIndex: filters.pageIndex - 1
						  });
					return;
				}
				fetchConfigZoomList();
			} catch (error) {
				console.log('onDeleteConfigZoom', error.message);
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false
				});
			}
		};
	};

	const columns = [
		{
			title: 'Tài khoản',
			dataIndex: 'UserZoom',
			render: (text) => <p className="font-weight-black">{text}</p>,
			...FilterColumn('UserZoom', onSearch, onResetSearch),
			className: activeColumnSearch === 'UserZoom' ? 'active-column-search' : ''
		},
		{
			title: 'API Key',
			dataIndex: 'APIKey'
		},
		{
			title: 'API Secret',
			dataIndex: 'APISecret'
		},
		{
			align: 'center',
			title: 'Trạng thái',
			dataIndex: 'Active',
			render: (status) => (status ? <span className="tag blue">Hoạt động</span> : <span className="tag gray">Dừng</span>),
			...FilterColumn('Active', onSearch, onResetSearch, 'select', optionActiveList)
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'CreatedOn',
			render: (date) => moment(date).format('DD/MM/YYYY'),
			...FilterColumn('CreatedOn', onSearch, onResetSearch, 'date-range'),
			className: activeColumnSearch === 'CreatedOn' ? 'active-column-search' : ''
		},
		{
			width: 100,
			align: 'center',
			render: (item: IConfigZoom, _, idx) => (
				<>
					<ConfigZoomForm isLoading={isLoading} isUpdate={true} updateObj={item} handleSubmit={onUpdateConfigZoom(idx)} />
					<DeleteTableRow title="Xoá" handleDelete={onDeleteConfigZoom(idx)} />
				</>
			)
		}
	];

	return (
		<PowerTable
			loading={isLoading}
			currentPage={filters.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			addClass="basic-header"
			TitlePage="Danh sách cấu hình"
			TitleCard={<ConfigZoomForm isLoading={isLoading} handleSubmit={onCreateConfigZoom} />}
			Extra={
				<div className="extra-table">
					<SortBox handleSort={onSort} dataOption={sortOptionList} />
				</div>
			}
			dataSource={configZoomList}
			columns={columns}
		/>
	);
}

export default ConfigZoom;
