import React, { useEffect, useRef, useState } from 'react';
import { configApi } from '~/apiBase';
import ConfigVoucherInvoiceForm from '~/components/Global/Option/ConfigVoucherInvoice/ConfigVoucherInvoiceForm';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import { useWrap } from '~/context/wrap';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

const ConfigVoucherInvoice = () => {
	const [dataTable, setDataTable] = useState<IConfig[]>([]);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const { showNoti, pageSize } = useWrap();
	const [totalPage, setTotalPage] = useState(null);
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
	// FILTER
	const listFieldInit = {
		pageIndex: 1,
		pageSize: pageSize,

		Type: null
	};
	let refValue = useRef({
		pageIndex: 1,
		pageSize: 10
	});
	const [filters, setFilters] = useState(listFieldInit);
	const optionFormList = [
		{ title: 'Phiếu chi', value: 1 },
		{ title: 'Phiếu thu', value: 2 }
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
	const getDataTable = async () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		try {
			let res = await configApi.getAll(filters);
			if (res.status === 200) {
				setDataTable(res.data.data);
			}
			if (res.status === 204) {
				setDataTable([]);
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
		getDataTable();
	}, [filters]);

	// CREATE
	const onCreate = async (data: { ConfigContent: string; Type: number }) => {
		try {
			setIsLoading({
				type: 'ADD_DATA',
				status: true
			});
			const res = await configApi.add(data);
			if (res.status === 200) {
				const newDataTable = [res.data.data, ...dataTable];
				setDataTable(newDataTable);
				showNoti('success', res.data.message);
				return true;
			}
		} catch (error) {
			showNoti('danger', error.message);
		} finally {
			setIsLoading({
				type: 'ADD_DATA',
				status: false
			});
		}
	};

	// UPDATE
	const onUpdate = (idx: number) => {
		return async (data: { ConfigContent: string; Type: number }) => {
			try {
				setIsLoading({
					type: 'ADD_DATA',
					status: true
				});
				const dataUpdate = {
					ID: dataTable[idx].ID,
					ConfigContent: data.ConfigContent
				};
				const res = await configApi.update(dataUpdate);
				if (res.status === 200) {
					const newDataTable = [...dataTable];
					newDataTable.splice(idx, 1, { ...dataTable[idx], ...data });
					setDataTable(newDataTable);
					showNoti('success', res.data.message);
					return true;
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false
				});
			}
		};
	};

	const columns = [
		{
			title: 'Loại phiếu',
			dataIndex: 'Type',
			...FilterColumn('Type', onSearch, onResetSearch, 'select', optionFormList),
			render: (type: number) => optionFormList.find((o) => o.value === type).title,
			className: activeColumnSearch === 'AreaID' ? 'active-column-search' : ''
		},
		{
			title: 'Nội dung',
			dataIndex: 'ConfigContent',
			render: (text) => <p className="invoice-content">{ReactHtmlParser(text)}</p>
		},
		{
			width: 100,
			align: 'center',
			render: (record: IConfig, _, idx: number) => (
				<ConfigVoucherInvoiceForm
					isLoading={isLoading}
					isUpdate={true}
					updateObj={record}
					handleSubmit={onUpdate(idx)}
					optionFormList={optionFormList}
				/>
			)
		}
	];

	return (
		<PowerTable
			loading={isLoading}
			dataSource={dataTable}
			columns={columns}
			currentPage={filters.pageIndex}
			totalPage={totalPage}
			getPagination={getPagination}
			TitleCard={<ConfigVoucherInvoiceForm isLoading={isLoading} handleSubmit={onCreate} optionFormList={optionFormList} />}
		/>
	);
};
export default ConfigVoucherInvoice;
