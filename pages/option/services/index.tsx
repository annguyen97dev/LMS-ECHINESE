import React, { Fragment, useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import SortBox from "~/components/Elements/SortBox";
import FilterServicesTable from "~/components/Global/Option/FilterTable/FilterServicesTable";
import { data } from "../../../lib/option/dataOption2";
import { serviceApi, userInformationApi, supplierApi } from "~/apiBase";
import ServiceForm from "~/components/Global/Option/ServiceForm";
import LayoutBase from "~/components/LayoutBase";
import { useWrap } from "~/context/wrap";
import { Tag, Tooltip, Switch, Input, Button, Space } from "antd";
import { AlertTriangle, X } from "react-feather";
import Modal from "antd/lib/modal/Modal";
import moment from "moment";

const ServiceList = () => {
  const [dataTable, setDataTable] = useState<IService[]>([]);
  const [dataSupplier, setDataSupplier] = useState<ISupplier[]>([]);
	const [dataStaff, setDataStaff] = useState([]);
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
	const [activeColumnSearch, setActiveColumnSearch] = useState('');

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
		ServiceName: null,
	};

	// PARAMS API GETALL
	const listTodoApi = {
		pageSize: 10,
		pageIndex: pageIndex,
		sort: null,
		sortType: null,
		fromDate: null,
		toDate: null,
    ServiceName: null,
	};
	const [todoApi, setTodoApi] = useState(listTodoApi);

  // PARAMS API SUPPLIER
  const listTodoSupplierApi = {
    selectAll: true,
  }

	// GET DATA SERVICE
	const getDataTable = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await serviceApi.getAll(todoApi);
			if (res.status == 204) {
				showNoti("danger", "Không có dữ liệu");
			}
			if(res.status == 200){
				setDataTable(res.data.data);
				if(res.data.data.length < 1) {
					handleReset();
				}
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

  	// GET DATA SUPPLIER
	const getDataSupplier = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await supplierApi.getAll(listTodoSupplierApi);
			res.status == 200 && setDataSupplier(res.data.data);
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

	// GET DATA USERINFORMATION WITH ROLE
	const getDataStaff = () => {
		setIsLoading({
		  type: "GET_ALL",
		  status: true,
		});
		(async () => {
		  try {
			let res = await userInformationApi.getAllRole(5);
			res.status == 200 && setDataStaff(res.data.data);
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
		  res = await serviceApi.update(data);
		  res?.status == 200 && showNoti("success", "Cập nhật thành công"), getDataTable();
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
		  res = await serviceApi.add(data);
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
		setTodoApi({
		  ...listTodoApi,
		  pageIndex: 1,
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
			pageIndex: 1,
			...clearKey,
		});
	};

	// DELETE
	const handleDelele = async () => {
		if(dataDelete) {
			setIsModalVisible(false);
			let res = null;
			try {
				res = await serviceApi.update(dataDelete);
				res.status === 200 && showNoti('success', "Xóa thành công");
				if (dataTable.length === 1) {
					listTodoApi.pageIndex === 1
						? setTodoApi({
								...listTodoApi,
								pageIndex: 1,
						})
						: setTodoApi({
								...listTodoApi,
								pageIndex: listTodoApi.pageIndex - 1,
						});
					return;
				}
			  getDataTable();
			} catch (error) {
				showNoti("danger", error.message);
			} finally {
				setIsLoading({
					type: "DELETE_DATA",
					status: false,
				});
			}
		}
	}

	// HANDLE RESET
	const handleReset = () => {
		setActiveColumnSearch('');
		setTodoApi({
			...listTodoApi,
			pageIndex: 1,
		});
		setCurrentPage(1);
	};

	// HANDLE SORT
	const handleSort = async (option) => {
		console.log('Show option: ', option);

		let newTodoApi = {
			...listTodoApi,
			sort: option.title.sort,
			sortType: option.title.sortType,
		};
		setCurrentPage(1);
		setTodoApi(newTodoApi);
	};

	// HANDLE FILTER
	const _onFilterTable = ( data ) => {
		console.log('Show value: ', data);

		let newTodoApi = {
			...listTodoApi,
			RoleID: data.RoleID,
			fromDate: data.fromDate,
			toDate: data.toDate
		};
		setCurrentPage(1);
		setTodoApi(newTodoApi);
	}

  const columns = [
    {
      title: "Dịch vụ",
      dataIndex: "ServiceName",
      ...FilterColumn("ServiceName", onSearch, handleReset, "text"),
	  className: activeColumnSearch === 'ID' ? 'active-column-search' : '',
      render: (text) => { return <p className="font-weight-black">{text}</p> }
    },
    { title: "Thông tin dịch vụ", dataIndex: "DescribeService" },
    { 
      title: "NCC Dịch vụ", 
      dataIndex: "SupplierServicesName" 
    },
    { 
      title: "Trạng thái", 
      dataIndex: "StatusName",
      render: (text) => { return <p className="font-weight-blue">{text}</p> }, 
    },
    {
      title: "Thay đổi bởi",
      dataIndex: "ModifiedBy",
      // ...FilterColumn("ModifiedBy"),
    },
    {
      title: "Thay đổi Lúc",
      dataIndex: "ModifiedOn",
      render: (date) => moment(date).format("DD/MM/YYYY"),
      // ...FilterDateColumn("ModifiedOn"),
    },
    {
      render: (record) => (
        <>
          <ServiceForm
            rowData={record}
            isLoading={isLoading}
            showIcon={true}
            _onSubmit={(data: any) => _onSubmit(data)}
            dataStaff={dataStaff}
            dataSupplier={dataSupplier}
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
    getDataStaff();
    getDataSupplier();
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
			TitlePage="Services List"
			TitleCard={
				<ServiceForm
				showAdd={true}
				isLoading={isLoading}
				_onSubmit={(data: any) => _onSubmit(data)}
				dataStaff={dataStaff}
				dataSupplier={dataSupplier}
				/>
		}
			dataSource={dataTable}
			columns={columns}
			Extra={
				<div className="extra-table">
				<FilterServicesTable
					_onFilter={(value: any) => _onFilterTable(value)}
					_onHandleReset={handleReset}
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
ServiceList.layout = LayoutBase;
export default ServiceList;
