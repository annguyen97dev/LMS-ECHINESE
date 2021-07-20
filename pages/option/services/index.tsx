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
	  getDataTable();
	};

	// PAGINATION
	const getPagination = (pageNumber: number) => {
		pageIndex = pageNumber;
		setCurrentPage(pageNumber);
		setTodoApi({
		  ...todoApi,
		//   ...listFieldSearch,
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
			RoleID: data.RoleID,
			fromDate: data.fromDate,
			toDate: data.toDate
		};

		setTodoApi(newTodoApi);
	}

  const columns = [
    {
      title: "Dịch vụ",
      dataIndex: "ServiceName",
      ...FilterColumn("ServiceName", onSearch, handleReset, "text"),
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
      filters: [
				{
					text: "Chưa hoạt động",
					value: "Chưa hoạt động"
				},
				{
					text: "Hoạt động",
					value: "Hoạt động"
				},
        {
					text: "Ngưng hoạt động",
					value: "Ngưng hoạt động"
				},
			],
			onFilter: (value, record) => record.StatusName.indexOf(value) === 0, 
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
				getPagination={(pageNumber: number) => getPagination(pageNumber)}
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
