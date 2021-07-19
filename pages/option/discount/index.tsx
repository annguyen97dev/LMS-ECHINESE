import React, { Fragment, useEffect, useState } from "react";
import FilterDiscountTable from '~/components/Global/Option/FilterTable/FilterDiscountTable';
import SortBox from '~/components/Elements/SortBox';
import DiscountForm from '~/components/Global/Option/DiscountForm';
import LayoutBase from '~/components/LayoutBase';
import PowerTable from '~/components/PowerTable';
import FilterColumn from '~/components/Tables/FilterColumn';
import FilterDateColumn from '~/components/Tables/FilterDateColumn';
import TitlePage from '~/components/TitlePage';
import {data} from '../../../lib/option/dataOption2';

import { Tag, Tooltip, Switch, Input, Button, Space } from "antd";
import { useWrap } from "~/context/wrap";
import { discountApi } from "~/apiBase";
import { AlertTriangle, X } from "react-feather";
import Modal from "antd/lib/modal/Modal";
import moment from "moment";

const Discount = () => {

	const [dataTable, setDataTable] = useState<IDiscount[]>([]);
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
	};

	// PARAMS API GETALL
	const listTodoApi = {
		pageSize: 10,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
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
			let res = await discountApi.getAll(todoApi);
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
  
	  if(data.ID) {
		console.log(data);
		try {
		  res = await discountApi.update(data);
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
		  res = await discountApi.add(data);
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

	const columns = [
		{
			title: 'Code',
			dataIndex: 'DiscountCode',
			// ...FilterColumn('code'),
			render: (code) => <span className="tag green">{code}</span>,
		},
		{title: 'Discount', dataIndex: 'Discount'},
		{title: 'Percent', dataIndex: 'percent'},
		{title: 'Status', dataIndex: 'StatusName'},
		{title: 'Quantity', dataIndex: 'Quantity'},
		{title: 'Quantity Left', dataIndex: 'QuantityLeft'},
		{title: 'Note', dataIndex: 'Note'},
		{title: 'Dead Line', dataIndex: 'DeadLine'},
		{
			render: (record) => (
				<>
					<DiscountForm 
						showIcon={true} 
						rowData={record}
						isLoading={isLoading}
						_onSubmit={(data: any) => _onSubmit(data)}	
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
	}, [todoApi])

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
					addClass="basic-header"
					TitleCard={
						<DiscountForm 
							showAdd={true} 
							isLoading={isLoading} 
							_onSubmit={(data: any) => _onSubmit(data)}
						/>}
					dataSource={dataTable}
					columns={columns}
					Extra={
						<div className="extra-table">
							<FilterDiscountTable />
							<SortBox />
						</div>
					}
				/>
			</div>
		</div>
	);
};
Discount.layout = LayoutBase;
export default Discount;
