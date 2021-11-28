import { Card, Table } from 'antd';
import { Item } from 'devextreme-react/file-manager';
import React, { useEffect, useState } from 'react';
import { useWrap } from '~/context/wrap';

const CourseVideoTable = (props) => {
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

	const selectRow = (record) => {
		const selectedRowKeys = [];

		if (selectedRowKeys.indexOf(record.key) >= 0) {
			selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
		} else {
			selectedRowKeys.push(record.key);
		}
		setState({ selectedRowKeys });
	};

	const onSelectedRowKeysChange = (selectedRowKeys) => {
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
		console.log('Expand Rows: ', expandedRows);
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
		hideSelectAll: true
	};

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

	const expandedRowRender = () => {
		return (
			<>
				<div className="feedback-detail-text" style={{ backgroundColor: 'red' }}>
					asd asd asdqw tw qgasgdas dnb{' '}
				</div>
			</>
		);
	};

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
						scroll={props.noScroll ? { x: 'max-content' } : { x: 600 }}
						columns={props.columns}
						dataSource={dataSource}
						size="middle"
						pagination={{
							pageSize: 30,
							pageSizeOptions: ['30'],
							onShowSizeChange: onShowSizeChange,
							total: props.totalPage && props.totalPage,
							onChange: (pageNumber, pageSize) => changePagination(pageNumber, pageSize),
							current: props.currentPage && props.currentPage
						}}
						rowClassName={(record, index) =>
							index == activeIndex ? 'table-row-active' : index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
						}
						rowSelection={rowSelection}
						onRow={(record, index) => ({
							onClick: () => {
								selectRow(record);
								setActiveIndex(index);
							}
						})}
						onExpandedRowsChange={onChangeExpand}
						// expandedRowRender={(record, index, indent, expaned) => (expaned ? props.expandable : null)}
						onExpand={onExpand}
						expandedRowKeys={returnRowKeys()}
					/>
				</Card>
			</div>
		</>
	);
};

export default CourseVideoTable;
