import { Card, Checkbox, Table } from 'antd';
import { Item } from 'devextreme-react/file-manager';
import React, { useEffect, useState } from 'react';
import { useWrap } from '~/context/wrap';

const ExpandTable = (props) => {
	const { getTitlePage } = useWrap();
	const [state, setState] = useState({ selectedRowKeys: [] });
	const [dataSource, setDataSource] = useState([]);
	const [rowKeys, setRowKeys] = useState([
		{
			currentPage: 1,
			listKeys: []
		}
	]);
	const [currentPage, setCurrentPage] = useState(1);
	const [activeIndex, setActiveIndex] = useState(null);

	const closeAllExpandFunc = () => {
		setRowKeys([
			{
				currentPage: 1,
				listKeys: []
			}
		]);
	};

	const selectRow = (record) => {
		const selectedRowKeys = [];

		if (selectedRowKeys.indexOf(record.key) >= 0) {
			selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
		} else {
			selectedRowKeys.push(record.key);
		}
		setState({ selectedRowKeys });
	};

	const onSelectedRowKeysChange = (selectedRowKeys, selectRow) => {
		props.onSelectRow(selectRow) && props.onSelectRow(selectRow);
		setState({ selectedRowKeys });
	};

	const changePagination = (pageNumber, pageSize) => {
		setCurrentPage(pageNumber);
		if (!rowKeys.some((object) => object['currentPage'] == pageNumber)) {
			rowKeys.push({
				currentPage: pageNumber,
				listKeys: []
			});
		}

		setRowKeys([...rowKeys]);

		if (typeof props.getPagination != 'undefined') {
			props.getPagination(pageNumber, pageSize);
		} else {
			return pageNumber;
		}
	};

	const onChangeExpand = (expandedRows) => {
		setActiveIndex(parseInt(expandedRows[expandedRows.length - 1]));

		if (rowKeys.some((object) => object['currentPage'] == currentPage)) {
			let index = rowKeys.findIndex((item) => item.currentPage == currentPage);
			rowKeys[index].listKeys = expandedRows;
		}

		setRowKeys([...rowKeys]);
	};

	const returnRowKeys = () => {
		let rowK = null;

		if (rowKeys.some((object) => object['currentPage'] == currentPage)) {
			rowK = rowKeys.find((item) => item.currentPage === currentPage).listKeys;
		} else {
			rowK = [];
		}

		if (rowK.length > 1) {
			rowK.splice(rowK.length - 2, 1);
		}

		return rowK;
	};

	const onExpand = (expand, record) => {
		if (typeof props.handleExpand != 'undefined') {
			props.handleExpand(record);
		}
	};

	// const onRowchange = (row) => {
	//   console.log("ROW: ", row);
	// };

	const onShowSizeChange = (current, size) => {
		props.onChangePageSize && props.onChangePageSize(current, size);
	};

	const rowSelection = {
		selectedRowKeys: state.selectedRowKeys,
		onChange: onSelectedRowKeysChange,
		hideSelectAll: false
	};

	const onSelect = () => {};

	useEffect(() => {
		if (props.TitlePage) {
			getTitlePage(props.TitlePage);
		}
		if (props.dataSource) {
			let dataClone = [...props.dataSource];
			dataClone.forEach((item, index) => {
				item.key = index.toString();
			});
			setDataSource(dataClone);
		}
	}, [props.dataSource]);

	useEffect(() => {
		if (props.closeAllExpand) {
			closeAllExpandFunc();
		}
	}, [props.closeAllExpand]);

	console.log('STATE: ', state);

	useEffect(() => {
		if (props.isResetKey) {
			setState({ selectedRowKeys: [] });
		}
	}, [props.isResetKey]);

	return (
		<>
			<div className="wrap-table table-expand">
				<Card
					className={`cardRadius ${props.addClass && props.addClass} ${props.Size ? props.Size : ''}`}
					title={props.Extra}
					extra={props.TitleCard}
				>
					{props.children}
					<Table
						loading={props.loading?.type == 'GET_ALL' && props.loading?.status}
						bordered={props.haveBorder ? props.haveBorder : false}
						scroll={{ x: 'max-content', y: 450 }}
						columns={props.columns}
						dataSource={dataSource}
						size="middle"
						pagination={{
							pageSize: 30,
							pageSizeOptions: ['30'],
							onShowSizeChange: onShowSizeChange,
							total: props.totalPage && props.totalPage,
							showTotal: () => <div className="font-weight-black">Tổng cộng: {props.totalPage}</div>,
							onChange: (pageNumber, pageSize) => changePagination(pageNumber, pageSize),
							current: props.currentPage && props.currentPage
						}}
						// rowSelection={rowSelection}
						rowClassName={(record, index) =>
							index == activeIndex ? 'table-row-active' : index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
						}
						onRow={(record, index) => ({
							onClick: () => {
								selectRow(record);
								setActiveIndex(index);
							}
						})}
						expandable={rowKeys[0].listKeys.length > 0 && props.expandable}
						expandedRowRender={(record, index, indent, expaned) => (expaned ? props.expandable : null)}
						onExpandedRowsChange={onChangeExpand}
						onExpand={onExpand}
						expandedRowKeys={returnRowKeys()}
						rowSelection={props.isSelect ? rowSelection : null}
					/>
				</Card>
			</div>
		</>
	);
};

export default ExpandTable;
