import React, { Fragment, useEffect, useState } from 'react';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import SortBox from '~/components/Elements/SortBox';
import SupplierForm from '~/components/Global/Option/SupplierForm';
import LayoutBase from '~/components/LayoutBase';
import FilterSupplierTable from '~/components/Global/Option/FilterTable/FilterSupplierTable';
import { useWrap } from '~/context/wrap';
import { supplierApi, userInformationApi } from '~/apiBase';
import { Tooltip } from 'antd';
import { AlertTriangle, X } from 'react-feather';
import Modal from 'antd/lib/modal/Modal';
import moment from 'moment';

const SupplierList = () => {
	const [dataTable, setDataTable] = useState<ISupplier[]>([]);
	const [dataStaffManage, setDataStaffManage] = useState([]);
	const [activeColumnSearch, setActiveColumnSearch] = useState('');
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
		SupplierName: '',
		PersonInChargeName: ''
	};

	// PARAMS API GETALL
	const listTodoApi = {
		pageSize: pageSize,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		fromDate: null,
		toDate: null,
		SupplierName: null,
		PersonInChargeName: null
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	// GET NHÂN VIÊN QUẢN LÍ
	const getDataStaffManage = () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await userInformationApi.getAllRole(5);
				res.status == 200 && setDataStaffManage(res.data.data);
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

	// GET DATA
	const getDataTable = () => {
		setIsLoading({
			type: 'GET_ALL',
			status: true
		});
		(async () => {
			try {
				let res = await supplierApi.getAll(todoApi);
				if (res.status == 204) {
					setDataTable([]);
				}
				if (res.status == 200) {
					setDataTable(res.data.data);
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
				res = await supplierApi.update(data);
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
				console.log('data: ', data);
				res = await supplierApi.add(data);
				res?.status == 200 && afterPost('Thêm');
				handleReset();
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
		let clearKey = compareField(valueSearch, dataIndex);
		setTodoApi({
			...todoApi,
			pageIndex: 1,
			...clearKey
		});
		setCurrentPage(pageIndex);
	};

	// DELETE
	const handleDelele = async () => {
		if (dataDelete) {
			setIsModalVisible(false);
			let res = null;
			try {
				res = await supplierApi.update(dataDelete);
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
		let newTodoApi = {
			...listTodoApi,
			fromDate: data.fromDate,
			toDate: data.toDate
		};
		setCurrentPage(1);
		setTodoApi(newTodoApi);
	};

	const columns = [
		{
			title: 'Nhà cung cấp (NCC)',
			dataIndex: 'SupplierName',
			...FilterColumn('SupplierName', onSearch, handleReset, 'text'),
			className: activeColumnSearch === 'ID' ? 'active-column-search' : '',
			render: (text) => {
				return <p className="font-weight-black">{text}</p>;
			}
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'Address'
		},
		{
			title: 'Mã số thuế',
			dataIndex: 'Taxcode'
		},
		{
			title: 'Nhân viên quản lí',
			dataIndex: 'PersonInChargeName',
			...FilterColumn('PersonInChargeName', onSearch, handleReset, 'text'),
			render: (text) => {
				return <p className="font-weight-primary">{text}</p>;
			}
		},
		{
			title: 'Thay đổi bởi',
			dataIndex: 'ModifiedBy'
		},
		{
			title: 'Thay đổi lúc',
			dataIndex: 'ModifiedOn',
			render: (date) => moment(date).format('DD/MM/YYYY')
		},
		{
			render: (record) => (
				<>
					<SupplierForm
						showIcon={true}
						rowData={record}
						isLoading={isLoading}
						_onSubmit={(data: any) => _onSubmit(data)}
						dataStaffManage={dataStaffManage}
					/>
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
		getDataStaffManage();
	}, [todoApi]);

	return (
		<Fragment>
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
				TitlePage="Danh sách nhà cung cấp"
				TitleCard={
					<SupplierForm
						showAdd={true}
						isLoading={isLoading}
						_onSubmit={(data: any) => _onSubmit(data)}
						dataStaffManage={dataStaffManage}
					/>
				}
				dataSource={dataTable}
				columns={columns}
				Extra={
					<div className="extra-table">
						<FilterSupplierTable _onFilter={(value: any) => _onFilterTable(value)} _onHandleReset={handleReset} />
						<SortBox handleSort={(value) => handleSort(value)} dataOption={dataOption} />
					</div>
				}
			/>
		</Fragment>
	);
};

SupplierList.layout = LayoutBase;
export default SupplierList;
