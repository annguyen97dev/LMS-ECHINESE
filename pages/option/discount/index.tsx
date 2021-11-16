import React, { Fragment, useEffect, useState } from 'react';
import FilterDiscountTable from '~/components/Global/Option/FilterTable/FilterDiscountTable';
import SortBox from '~/components/Elements/SortBox';
import DiscountForm from '~/components/Global/Option/DiscountForm';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import FilterDateColumn from '~/components/Tables/FilterDateColumn';
import TitlePage from '~/components/TitlePage';
import { data } from '../../../lib/option/dataOption2';

import { Tag, Tooltip, Switch, Input, Button, Space } from 'antd';
import { useWrap } from '~/context/wrap';
import { discountApi } from '~/apiBase';
import { AlertTriangle, X } from 'react-feather';
import Modal from 'antd/lib/modal/Modal';
import moment from 'moment';

const Discount = () => {
	const [dataTable, setDataTable] = useState<IDiscount[]>([]);
	const [dataDelete, setDataDelete] = useState({
		ID: null,
		Enable: null
	});
	const { showNoti, pageSize } = useWrap();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({
		type: '',
		status: false
	});
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [activeColumnSearch, setActiveColumnSearch] = useState('');

	let pageIndex = 1;

	// SORT
	const dataOption = [
		{
			dataSort: {
				sort: 2,
				sortType: false
			},
			value: 3,
			text: 'Tên giảm dần'
		},
		{
			dataSort: {
				sort: 2,
				sortType: true
			},
			value: 4,
			text: 'Tên tăng dần '
		}
	];

	// PARAMS SEARCH
	let listField = {
		DiscountCode: '',
		Status: ''
	};

	// PARAMS API GETALL
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		DiscountCode: null,
		Status: null
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	// GET DATA STAFFSALARY
	const getDataTable = () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await discountApi.getAll(todoApi);
				if (res.status == 204) {
					showNoti('danger', 'Không có dữ liệu');
					setDataTable([]);
				}
				if (res.status == 200) {
					setDataTable(res.data.data);
					if (res.data.data.length < 1) {
						handleReset();
					}
					setTotalPage(res.data.totalRow);
				}
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'GET_ALL',
					status: false
				});
			}
		})();
	};

	// ADD DATA
	const _onSubmit = async (data: any) => {
		setIsLoading({
			type: 'ADD_DATA',
			status: true
		});

		let res = null;

		if (data.ID) {
			console.log(data);
			try {
				res = await discountApi.update(data);
				res?.status == 200 && showNoti('success', 'Cập nhật thành công'), getDataTable();
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false
				});
			}
		} else {
			try {
				res = await discountApi.add(data);
				res?.status == 200 && afterPost('Thêm');
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'ADD_DATA',
					status: false
				});
			}
		}

		return res;
	};

	const afterPost = (value) => {
		showNoti('success', `${value} thành công`);
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		});
		setCurrentPage(1);
	};

	// PAGINATION
	const getPagination = (pageNumber: number, pageSize: number) => {
		if (!pageSize) pageSize = 10;
		pageIndex = pageNumber;
		setCurrentPage(pageNumber);
		setTodoApi({
			...todoApi,
			//   ...listFieldSearch,
			pageIndex: pageIndex,
			pageSize: pageSize
		});
	};

	// ON SEARCH
	const compareField = (valueSearch, dataIndex) => {
		let newList = null;
		Object.keys(listField).forEach(function (key) {
			console.log('key: ', key);
			if (key != dataIndex) {
				listField[key] = '';
			} else {
				listField[key] = valueSearch;
			}
		});
		newList = listField;
		return newList;
	};

	const onSearch = (valueSearch, dataIndex) => {
		console.log(dataTable);
		let clearKey = compareField(valueSearch, dataIndex);

		setTodoApi({
			...todoApi,
			pageIndex: 1,
			...clearKey
		});
	};

	// DELETE
	const handleDelele = async () => {
		if (dataDelete) {
			setIsModalVisible(false);
			let res = null;
			try {
				res = await discountApi.update(dataDelete);
				res.status === 200 && showNoti('success', 'Xóa thành công');
				if (dataTable.length === 1) {
					listTodoApi.pageIndex === 1
						? setTodoApi({
								...listTodoApi,
								pageIndex: 1
						  })
						: setTodoApi({
								...listTodoApi,
								pageIndex: listTodoApi.pageIndex - 1
						  });
					return;
				}
				getDataTable();
			} catch (error) {
				showNoti('danger', error.message);
			} finally {
				setIsLoading({
					type: 'DELETE_DATA',
					status: false
				});
			}
		}
	};

	// HANDLE RESET
	const handleReset = () => {
		setActiveColumnSearch('');
		setTodoApi({
			...listTodoApi,
			pageIndex: 1
		});
		setCurrentPage(1);
	};

	// HANDLE SORT
	const handleSort = async (option) => {
		console.log('Show option: ', option);

		let newTodoApi = {
			...listTodoApi,
			sort: option.title.sort,
			sortType: option.title.sortType
		};
		setCurrentPage(1);
		setTodoApi(newTodoApi);
	};

	// HANDLE FILTER
	const _onFilterTable = (data) => {
		console.log('Show value: ', data);

		let newTodoApi = {
			...listTodoApi,
			fromDate: data.fromDate,
			toDate: data.toDate,
			Status: data.Status
		};
		setCurrentPage(1);
		setTodoApi(newTodoApi);
	};

	const columns = [
		{
			title: 'Mã khuyến mãi',
			dataIndex: 'DiscountCode',
			...FilterColumn('DiscountCode', onSearch, handleReset, 'text'),
			className: activeColumnSearch === 'ID' ? 'active-column-search' : '',
			render: (code) => <span className="tag green">{code}</span>
		},
		{
			title: 'Khuyến mãi',
			dataIndex: 'Discount',
			render: (text, record) => {
				if (record.DiscountType == 2) {
					return <p className="font-weight-primary">{text}%</p>;
				} else {
					return <p className="font-weight-primary">{Intl.NumberFormat('ja-JP').format(text)}</p>;
				}
			}
		},
		{
			title: 'Gói',
			dataIndex: 'Style',
			render: (text, record) => {
				if (record.Style == 2) {
					return <span>Gói combo</span>;
				} else {
					return <span>Gới lẻ</span>;
				}
			}
		},
		{
			title: 'Trạng thái',
			dataIndex: 'StatusName',
			render: (text, record) => {
				switch (record.Status) {
					case 1:
						return <span className="tag green">{text}</span>;
						break;
					case 2:
						return <span className="tag yellow">{text}</span>;
						break;
					case 3:
						return <span className="tag red">{text}</span>;
						break;
				}
			}
		},
		{ title: 'Số lượng', dataIndex: 'Quantity' },
		{ title: 'Số lượng còn lại', dataIndex: 'QuantityLeft', width: 120 },
		{ title: 'Ghi chú', dataIndex: 'Note' },
		{
			title: 'Thời hạn',
			dataIndex: 'DeadLine',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			render: (record, text, index) => (
				<>
					<DiscountForm showIcon={true} rowData={record} isLoading={isLoading} _onSubmit={(data: any) => _onSubmit(data)} />
					<Tooltip title="Xóa">
						<button
							className="btn btn-icon delete"
							onClick={() => {
								setIsModalVisible(true);
								setDataDelete({
									ID: record.ID,
									Enable: false
								});
							}}
						>
							<X />
						</button>
					</Tooltip>
				</>
			)
		}
	];

	useEffect(() => {
		getDataTable();
	}, [todoApi]);

	return (
		<div className="row">
			<div className="col-12">
				<TitlePage title="Discount List" />
			</div>
			<div className="col-12">
				<Modal
					title={<AlertTriangle color="red" />}
					visible={isModalVisible}
					onOk={() => handleDelele()}
					onCancel={() => setIsModalVisible(false)}
				>
					<span className="text-confirm">Bạn có chắc chắn muốn xóa không ?</span>
				</Modal>
				<PowerTable
					loading={isLoading}
					currentPage={currentPage}
					totalPage={totalPage && totalPage}
					getPagination={getPagination}
					addClass="basic-header"
					TitleCard={<DiscountForm showAdd={true} isLoading={isLoading} _onSubmit={(data: any) => _onSubmit(data)} />}
					dataSource={dataTable}
					columns={columns}
					Extra={
						<div className="extra-table">
							<FilterDiscountTable _onFilter={(value: any) => _onFilterTable(value)} _onHandleReset={handleReset} />
							<SortBox handleSort={(value) => handleSort(value)} dataOption={dataOption} />
						</div>
					}
				/>
			</div>
		</div>
	);
};
Discount.layout = LayoutBase;
export default Discount;
