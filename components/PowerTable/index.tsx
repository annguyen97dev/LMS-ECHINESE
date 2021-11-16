import { Card, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useWrap } from '~/context/wrap';

const PowerTable = React.memo((props: any) => {
	const { getTitlePage } = useWrap();
	const [state, setState] = useState({ selectedRowKeys: [] });
	const [dataSource, setDataSource] = useState([]);
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
		if (typeof props.getPagination != 'undefined') {
			props.getPagination(pageNumber, pageSize);
		} else {
			return pageNumber;
		}
	};

	const rowSelection = {
		selectedRowKeys: state.selectedRowKeys,
		onChange: onSelectedRowKeysChange,
		hideSelectAll: true
	};

	const onShowSizeChange = (current, size) => {
		console.log('Curren: ', current);
		console.log('Size: ', size);
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

	return (
		<>
			<div className="row">
				<div className="col-12">
					{/* <TitlePage title={props.TitlePage} /> */}
					<div className="wrap-table">
						<Card
							className={`cardRadius ${props.addClass && props.addClass} ${
								props.Size ? props.Size : '' // table-small || table-medium
							}`}
							title={props.Extra}
							extra={props.TitleCard}
						>
							{props.children}
							<Table
								loading={props.loading?.type == 'GET_ALL' && props.loading?.status}
								bordered={props.haveBorder ? props.haveBorder : false} // boolean
								scroll={{ x: 'max-content', y: 450 }}
								columns={props.columns}
								dataSource={dataSource}
								size="middle"
								pagination={{
									pageSize: 30,
									pageSizeOptions: ['30'],
									showTotal: () => <div className="font-weight-black">Tổng cộng: {props.totalPage}</div>,
									onShowSizeChange: onShowSizeChange,
									total: props.totalPage && props.totalPage,
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
							/>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
});

export default PowerTable;
