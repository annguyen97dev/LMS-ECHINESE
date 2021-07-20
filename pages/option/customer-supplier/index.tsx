import React, { Fragment, useEffect, useState } from "react";
import PowerTable from '~/components/PowerTable';
import {data} from '../../../lib/option/dataOption2';
import CustomerSupplierForm from '~/components/Global/Option/CustomerSupplierForm';
import FilterColumn from '~/components/Tables/FilterColumn';
import FilterDateColumn from '~/components/Tables/FilterDateColumn';
import SortBox from '~/components/Elements/SortBox';
import FilterTable from '~/components/Global/CourseList/FitlerTable';
import LayoutBase from '~/components/LayoutBase';
import FilterCustomerSupplierTable from '~/components/Global/Option/FilterTable/FilterCustomerSupplierTable';

import { Tag, Tooltip, Switch, Input, Button, Space } from "antd";
import { useWrap } from "~/context/wrap";
import { sourceInfomationApi } from "~/apiBase";
import { AlertTriangle, X } from "react-feather";
import Modal from "antd/lib/modal/Modal";
import moment from "moment";

const CustomerSupplier = () => {
	const [dataTable, setDataTable] = useState<ISourceInfomation[]>([]);
	const [dataDelete, setDataDelete]  = useState({
		PurposesID: null,
		Enable: null,
	});
	const { showNoti } = useWrap();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState({
	  type: "",
	  status: false,
	});
	const [totalPage, setTotalPage] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);

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
		SourceInformationName: "",
	};

	// PARAMS API GETALL
	const listTodoApi = {
		pageSize: 10,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		SourceInformationName: null,
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

	// GET DATA STAFFSALARY
	const getDataTable = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await sourceInfomationApi.getAll(todoApi);
			res.status == 200 && setDataTable(res.data.data);
			if (res.status == 204) {
				// Trường họp search CỐ ĐỊNH 1 phần tử và XÓA thì data trả về = trỗng nhưng trong table vẫn còn 1 phần tử thì reset table
				if(dataTable.length == 1) {
					handleReset();
				} else {
					showNoti("danger", "Không có dữ liệu");
				}
			  	setCurrentPage(pageIndex);
			} else {
			  setTotalPage(res.data.totalRow);
			}
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
	
		if(data.SourceInformationID) {
		  console.log(data);
		  try {
			res = await sourceInfomationApi.update(data);
			res?.status == 200 && afterPost("Cập nhật");
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
			res = await sourceInfomationApi.add(data);
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
		setCurrentPage(pageNumber);
		setTodoApi({
		  ...todoApi,
		  pageIndex: pageIndex,
		});
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
		console.log(dataTable);
		let clearKey = compareField(valueSearch, dataIndex);

		setTodoApi({
			...todoApi,
			...clearKey,
		});
	};

	// HANDLE RESET
	const handleReset = () => {
		setTodoApi(listTodoApi);
	};

	// HIDE OR ENABLE
	const changeStatus = async (checked: boolean, idRow: number) => {
	setIsLoading({
		type: "GET_ALL",
		status: true,
	});

	let dataChange = {
		SourceInformationID: idRow,
		Enable: checked,
	};

	try {
		let res = await sourceInfomationApi.update(dataChange);
		res.status == 200 && setTodoApi(listTodoApi),
		showNoti("success", res.data.message);
	} catch (error) {
		showNoti("danger", error.Message);
	} finally {
		setIsLoading({
		type: "GET_ALL",
		status: false,
		});
	}
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


	const columns = [
		{
			title: 'Tên nguồn',
			dataIndex: 'SourceInformationName',
			...FilterColumn('SourceInformationName', onSearch, handleReset, "text"),
			render: (text) => <p className="font-weight-black">{text}</p> 
		},
		{
			title: 'Thay đổi bởi', 
			dataIndex: 'ModifiedBy',
			//  ...FilterColumn('modBy')
		},
		{
			title: 'Thay đổi lúc',
			dataIndex: 'ModifiedOn',
			// ...FilterDateColumn("modDate"),
			render: (date) => <p className="font-weight-blue">{moment(date).format("DD/MM/YYYY")}</p> 
		},
		{
			title: "Trạng thái",
			dataIndex: "Enable",
			render: (Enable, record) => (
			  <>
				<Switch
				  checkedChildren="Hiện"
				  unCheckedChildren="Ẩn"
				  checked={Enable}
				  size="default"
				  onChange={(checked) => changeStatus(checked, record.SourceInformationID)}
				/>
			  </>
			),
		},

		{
			render: (record) => (
				<>
					<CustomerSupplierForm 
						showIcon={true} 
						rowData={record}
						isLoading={isLoading}
						_onSubmit={(data: any) => _onSubmit(data)}	
						/>
				</>
			),
		},
	];

	useEffect(() => {
		getDataTable();
	}, [todoApi])

	return (
		<PowerTable
			loading={isLoading}
			currentPage={currentPage}
			totalPage={totalPage && totalPage}
			getPagination={(pageNumber: number) => getPagination(pageNumber)}
			addClass="basic-header"
			TitlePage="CUSTOMER SUPPLIER LIST"
			TitleCard={
				<CustomerSupplierForm 
					showAdd={true} 
					isLoading={isLoading} 
					_onSubmit={(data: any) => _onSubmit(data)}
				/>}
			dataSource={dataTable}
			columns={columns}
			Extra={
				<div className="extra-table">
					{/* <FilterCustomerSupplierTable /> */}
					<SortBox 
						handleSort={(value) => handleSort(value)}
						dataOption={dataOption}
					/>
				</div>
			}
		/>
	);
};
CustomerSupplier.layout = LayoutBase;
export default CustomerSupplier;
