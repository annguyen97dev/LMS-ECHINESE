import React, { Fragment, useEffect, useState } from "react";
import SortBox from "~/components/Elements/SortBox";
import FilterStaffSalaryTable from "~/components/Global/Option/FilterTable/FilterStaffSalaryTable";
import StaffSalaryForm from "~/components/Global/Option/StaffSalaryForm";
import LayoutBase from "~/components/LayoutBase";
import PowerTable from "~/components/PowerTable";
import FilterColumn from "~/components/Tables/FilterColumn";
import { data } from "../../../lib/option/dataOption2";
import { useWrap } from "~/context/wrap";
import { staffSalaryApi, userInformationApi } from "~/apiBase";
import { Tag, Tooltip, Switch, Input, Button, Space } from "antd";
import { AlertTriangle, X } from "react-feather";
import Modal from "antd/lib/modal/Modal";
import moment from "moment";

const StaffSalary = () => {
  const [dataTable, setDataTable] = useState<IStaffSalary[]>([]);
  const [dataStaff, setDataStaff] = useState([]);
  const [dataDelete, setDataDelete] = useState({
    SalaryID: null,
    Enable: null,
  });
  const { showNoti, pageSize } = useWrap();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [totalPage, setTotalPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeColumnSearch, setActiveColumnSearch] = useState("");

  let pageIndex = 1;

  // SORT
  const dataOption = [
    {
      dataSort: {
        sort: 2,
        sortType: false,
      },
      value: 3,
      text: "Tên giảm dần",
    },
    {
      dataSort: {
        sort: 2,
        sortType: true,
      },
      value: 4,
      text: "Tên tăng dần ",
    },
  ];

  // PARAMS SEARCH
  let listField = {
    FullName: "",
  };

  // PARAMS API GETALL
  const listTodoApi = {
    pageSize: pageSize,
    pageIndex: pageIndex,
    sort: null,
    sortType: null,
    RoleID: null,
    FullName: null,
    fromDate: null,
    toDate: null,
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
        let res = await staffSalaryApi.getAll(todoApi);
        if (res.status == 204) {
          showNoti("danger", "Không có dữ liệu");
          handleReset();
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
        showNoti("danger", error.message);
      } finally {
        setIsLoading({
          type: "GET_ALL",
          status: false,
        });
      }
    })();
  };

  // GET DATA USERINFORMATION
  const getDataStaff = () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await userInformationApi.getAll();
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

    if (data.SalaryID) {
      console.log(data);
      try {
        res = await staffSalaryApi.update(data);
        res.status === 200 && showNoti("success", "Cập nhật thành công"),
          getDataTable();
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
        res = await staffSalaryApi.add(data);
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
  };

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
      pageSize: pageSize,
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

    setCurrentPage(pageIndex);
  };

  // DELETE
  const handleDelele = async () => {
    if (dataDelete) {
      setIsModalVisible(false);
      let res = null;
      try {
        res = await staffSalaryApi.update(dataDelete);
        res.status === 200 && showNoti("success", "Xóa thành công");
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
  };

  // HANDLE RESET
  const handleReset = () => {
    setActiveColumnSearch("");
    setTodoApi({
      ...listTodoApi,
      pageIndex: 1,
    });
    setCurrentPage(1);
  };

  // HANDLE SORT
  const handleSort = async (option) => {
    console.log("Show option: ", option);

    let newTodoApi = {
      ...listTodoApi,
      sort: option.title.sort,
      sortType: option.title.sortType,
    };

    setCurrentPage(1);
    setTodoApi(newTodoApi);
  };

  // HANDLE FILTER
  const _onFilterTable = (data) => {
    console.log("Show value: ", data);

    let newTodoApi = {
      ...listTodoApi,
      pageIndex: 1,
      RoleID: data.RoleID,
      fromDate: data.fromDate,
      toDate: data.toDate,
    };
    setCurrentPage(1);
    setTodoApi(newTodoApi);
  };

  // COLUMNS TABLE
  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "FullName",
      ...FilterColumn("FullName", onSearch, handleReset, "text"),
      className: activeColumnSearch === "ID" ? "active-column-search" : "",
      render: (text) => {
        return <p className="font-weight-black">{text}</p>;
      },
    },
    // {
    // 	title: 'Username',
    // 	dataIndex: 'UserName',
    // },
    {
      title: "Email",
      dataIndex: "Email",
      // ...FilterColumn("email")
    },
    {
      title: "Role",
      dataIndex: "RoleName",
    },
    {
      title: "Mức lương",
      dataIndex: "Salary",
      render: (salary) => {
        return (
          <p className="font-weight-blue">
            {Intl.NumberFormat("ja-JP").format(salary)}
          </p>
        );
      },
    },
    {
      title: "Loại",
      dataIndex: "StyleName",
    },
    { title: "Thêm bởi", dataIndex: "CreatedBy" },
    {
      title: "Thêm lúc",
      dataIndex: "CreatedOn",
      render: (date) => moment(date).format("DD/MM/YYYY"),
      // ...FilterDateColumn('modDate'),
    },
    {
      render: (record) => (
        <>
          <StaffSalaryForm
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
                  SalaryID: record.SalaryID,
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
        TitlePage="Staff salary"
        TitleCard={
          <StaffSalaryForm
            showAdd={true}
            isLoading={isLoading}
            _onSubmit={(data: any) => _onSubmit(data)}
            dataStaff={dataStaff}
          />
        }
        dataSource={dataTable}
        columns={columns}
        Extra={
          <div className="extra-table">
            <FilterStaffSalaryTable
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
StaffSalary.layout = LayoutBase;
export default StaffSalary;
