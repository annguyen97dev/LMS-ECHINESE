import React, { Fragment, useEffect, useState } from "react";
import PowerTable from '~/components/PowerTable';
import {data} from '../../../lib/option/dataOption2';
import FilterColumn from '~/components/Tables/FilterColumn';
import FilterDateColumn from '~/components/Tables/FilterDateColumn';
import SortBox from '~/components/Elements/SortBox';
import FilterTable from '~/components/Global/CourseList/FitlerTable';
import SupplierForm from '~/components/Global/Option/SupplierForm';
import LayoutBase from '~/components/LayoutBase';
import FilterSupplierTable from '~/components/Global/Option/FilterTable/FilterSupplierTable';

import { useWrap } from "~/context/wrap";
import { supplierApi, userInformationApi } from "~/apiBase";
import { Tag, Tooltip, Switch, Input, Button, Space } from "antd";
import { AlertTriangle, X } from "react-feather";
import Modal from "antd/lib/modal/Modal";
import moment from "moment";


const SupplierList = () => {
	const [dataTable, setDataTable] = useState<ISupplier[]>([]);
	const [dataStaffManage, setDataStaffManage] = useState([]);
	const [dataDelete, setDataDelete]  = useState({
		ID: null,
		Enable: null,
	});
	const { showNoti } = useWrap();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({
	  type: "",
	  status: false,
	});
	const [totalPage, setTotalPage] = useState(null);

	let pageIndex = 1;

	// SORT
	const dataOption = [
		{
			dataSort: {
				sort: 2,
				sortType: false,
			},
			value: 3,
			text: 'Tên giảm dần',
		},
		{
			dataSort: {
				sort: 2,
				sortType: true,
			},
			value: 4,
			text: 'Tên tăng dần ',
		},
	];

	// PARAMS SEARCH
	let listField = {
		SupplierName: "",
	};

	// PARAMS API GETALL
	const listTodoApi = {
		pageSize: 10,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		fromDate: null,
		toDate: null,
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	// GET NHÂN VIÊN QUẢN LÍ
	const getDataStaffManage = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await userInformationApi.getAllRole(5);
			res.status == 200 && setDataStaffManage(res.data.data);
		  } catch (error) {
			showNoti("danger", error.message);
		  } finally {
			setIsLoading({
			  type: "GET_ALL",
			  status: false,
			});
		  }
		})();
	};

	// GET DATA
	const getDataTable = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await supplierApi.getAll(todoApi);
			res.status == 200 
			? setDataTable(res.data.data)
			: res.status == 204 && showNoti("danger", "Không tìm thấy");
		  } catch (error) {
			showNoti("danger", error.message);
		  } finally {
			setIsLoading({
			  type: "GET_ALL",
			  status: false,
			});
		  }
		})();
	};
  
	// ADD DATA
	const _onSubmit = async (data: any) => {
	  setIsLoading({
		type: "ADD_DATA",
		status: true,
	  });
  
	  let res = null;
  
	  if(data.ID) {
		console.log(data);
		try {
		  res = await supplierApi.update(data);
		  res?.status == 200 && afterPost("Sửa");
		} catch (error) {
		  showNoti("danger", error.message);
		} finally {
		  setIsLoading({
			type: "ADD_DATA",
			status: false,
		  });
		}
	  } else {
		try {
			console.log("data: ", data);
		  res = await supplierApi.add(data);
		  res?.status == 200 && afterPost("Thêm");
		} catch (error) {
		  showNoti("danger", error.message);
		} finally {
		  setIsLoading({
			type: "ADD_DATA",
			status: false,
		  });
		}
	  }
  
	  return res;
	}
  
	const afterPost = (value) => {
	  showNoti("success", `${value} thành công`);
	  getDataTable();
	};

	// PAGINATION
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		getDataTable();
	};

	// ON SEARCH
	const compareField = (valueSearch, dataIndex) => {
		let newList = null;
		Object.keys(listField).forEach(function (key) {
			console.log("key: ", key);
			if (key != dataIndex) {
			listField[key] = "";
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
			...clearKey,
		});

	};

	// DELETE
	const handleDelele = () => {
		if(dataDelete) {
			let res = _onSubmit(dataDelete);
			res.then(function (rs: any) {
				rs && rs.status == 200 && setIsModalVisible(false);
			});
		}
	}

	// HANDLE RESET
	const handleReset = () => {
		setTodoApi(listTodoApi);
	};

	// HANDLE SORT
	const handleSort = async (option) => {
		console.log('Show option: ', option);

		let newTodoApi = {
			...listTodoApi,
			sort: option.title.sort,
			sortType: option.title.sortType,
		};

		setTodoApi(newTodoApi);
	};

	// HANDLE FILTER
	const _onFilterTable = ( data ) => {
		console.log('Show value: ', data);

		let newTodoApi = {
			...listTodoApi,
			fromDate: data.fromDate,
			toDate: data.toDate
		};

		setTodoApi(newTodoApi);
	}


	const columns = [
		{
			title: 'Supplier', 
			dataIndex: 'SupplierName', 
			...FilterColumn('SupplierName', onSearch, handleReset, "text")},
		{
			title: 'Modified By', 
			dataIndex: 'ModifiedBy', 
			// ...FilterColumn('ModifiedBy', onSearch, handleReset, "text")},
		},
		{
			title: 'Modified Date',
			dataIndex: 'ModifiedOn',
			render: (date) => moment(date).format("DD/MM/YYYY"),
			// ...FilterDateColumn("modDate"),
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
									Enable: false,
								});
							}}
						>
							<X />
						</button>
					</Tooltip>
				</>
			),
		},
	];

	useEffect(() => {
		getDataTable();
		getDataStaffManage();
	}, [todoApi])

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
				totalPage={totalPage && totalPage}
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
				addClass="basic-header"
				TitlePage="Supplier List"
				TitleCard={
					<SupplierForm
						showAdd={true} 
						isLoading={isLoading} 
						_onSubmit={(data: any) => _onSubmit(data)}
						dataStaffManage={dataStaffManage}
					/>}
				dataSource={dataTable}
				columns={columns}
				Extra={
					<div className="extra-table">
						<FilterSupplierTable 
							_onFilter={(value: any) => _onFilterTable(value)}
						/>
						<SortBox 
							handleSort={(value) => handleSort(value)}
							dataOption={dataOption}
						/>
					</div>
				}
			/>
		</Fragment>

	);
};
SupplierList.layout = LayoutBase;
export default SupplierList;
