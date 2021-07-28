import React, { useState, useEffect } from "react";
import { Table, Card, Tag, Tooltip } from "antd";
import { FormOutlined, EyeOutlined } from "@ant-design/icons";
import TitlePage from "~/components/TitlePage";
import SearchBox from "~/components/Elements/SearchBox";
import Link from "next/link";
import PowerTable from "~/components/PowerTable";
import ModalAdd from "~/components/Global/StaffList/ModalAdd";
import { useWrap } from "~/context/wrap";
import FilterColumn from "~/components/Tables/FilterColumn";
import { Eye, Filter, Search } from "react-feather";
import LayoutBase from "~/components/LayoutBase";
import { staffApi, branchApi, areaApi } from "~/apiBase";
import SortBox from "~/components/Elements/SortBox";
import moment from "moment";
import FilterBase from "~/components/Elements/FilterBase/FilterBase";
import { Roles } from "~/lib/roles/listRoles";

let pageIndex = 1;

let dataRoles = [];

(function getListRoles() {
  dataRoles = Roles.map((item) => ({
    title: item.RoleName,
    value: item.id,
  }));
  console.log("NEW LIST: ", dataRoles);
})();

let listFieldSearch = {
  pageIndex: 1,
  FullNameUnicode: null,
};

let listFieldFilter = {
  pageIndex: 1,
  fromDate: null,
  toDate: null,
  RoleID: null,
  BranchID: null,
  AreaID: null,
  StatusID: null,
};

const listTodoApi = {
  pageSize: 10,
  pageIndex: pageIndex,
  sort: null,
  sortType: null,
  fromDate: null,
  toDate: null,
  FullNameUnicode: null,
  RoleID: null,
  BranchID: null,
  AreaID: null,
};

const dataOption = [
  {
    dataSort: {
      sort: 0,
      sortType: false,
    },
    text: "Tên Z-A",
  },
  {
    dataSort: {
      sort: 0,
      sortType: true,
    },
    text: "Tên A-Z ",
  },
];

const StaffList = () => {
  // ------ BASE USESTATE TABLE -------
  const [dataCenter, setDataCenter] = useState<IBranch[]>([]);
  const [dataArea, setDataArea] = useState<IArea[]>([]);
  const [dataSource, setDataSource] = useState<IStaff[]>([]);
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [totalPage, setTotalPage] = useState(null);
  const [indexRow, setIndexRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [todoApi, setTodoApi] = useState(listTodoApi);
  // GET LIST ROLES

  const [dataFilter, setDataFilter] = useState([
    {
      name: "AreaID",
      title: "Tỉnh/TP",
      col: "col-md-6 col-12",
      type: "select",
      optionList: null, // Gọi api xong trả data vào đây
      value: null,
    },
    {
      name: "BranchID",
      title: "Trung tâm",
      col: "col-md-6 col-12",
      type: "select",
      optionList: null,
      value: null,
    },
    {
      name: "RoleID",
      title: "Vị trí",
      col: "col-md-6 col-12",
      type: "select",
      optionList: dataRoles,
      value: null,
    },
    {
      name: "StatusID",
      title: "Trạng thái",
      col: "col-md-6 col-12",
      type: "select",
      optionList: [
        {
          value: 0,
          title: "Hoạt động",
        },
        {
          value: 1,
          title: "Không Hoạt động",
        },
      ],
      value: null,
    },
    {
      name: "date-range",
      title: "Từ - đến",
      col: "col-12",
      type: "date-range",
      value: null,
    },
  ]);

  // GET DATA SOURCE
  const getDataSource = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    try {
      let res = await staffApi.getAll(todoApi);
      res.status == 200 &&
        (setDataSource(res.data.data),
        setTotalPage(res.data.totalRow),
        showNoti("success", "Thành công"));
      res.status == 204 && showNoti("danger", "Không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  // ------ SET DATA FUN ------
  const setDataFunc = (name, data) => {
    dataFilter.every((item, index) => {
      if (item.name == name) {
        item.optionList = data;
        return false;
      }
      return true;
    });
    setDataFilter([...dataFilter]);
  };

  // ------ GET DATA CENTER + Data Area -----
  const getDataCenter = async () => {
    try {
      let res = await branchApi.getAll({ pageSize: 99999, pageIndex: 1 });
      if (res.status == 200) {
        const newData = res.data.data.map((item) => ({
          title: item.BranchName,
          value: item.ID,
        }));
        setDataFunc("BranchID", newData);
      }

      res.status == 204 && showNoti("danger", "Trung tâm Không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
    }
  };

  const getDataArea = async () => {
    try {
      let res = await areaApi.getAll({ pageSize: 99999, pageIndex: 1 });
      if (res.status == 200) {
        const newData = res.data.data.map((item) => ({
          title: item.AreaName,
          value: item.AreaID,
        }));
        setDataFunc("AreaID", newData);
      }
      res.status == 204 && showNoti("danger", "Tỉnh/TP Không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
    }
  };

  // ---------------- AFTER SUBMIT -----------------
  const afterPost = (mes) => {
    showNoti("success", mes);
    setTodoApi({
      ...listTodoApi,
      pageIndex: 1,
    });
    setCurrentPage(1);
  };

  // ----------------- ON SUBMIT --------------------
  const _onSubmit = async (dataSubmit: any) => {
    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });

    let res = null;

    if (dataSubmit.ID) {
      try {
        res = await staffApi.update(dataSubmit);

        if (res.status == 200) {
          let newDataSource = [...dataSource];
          newDataSource.splice(indexRow, 1, dataSubmit);
          setDataSource(newDataSource);
          showNoti("success", res.data.message);
        }
      } catch (error) {
        console.log("error: ", error);
        showNoti("danger", error.message);
      } finally {
        setIsLoading({
          type: "ADD_DATA",
          status: false,
        });
      }
    } else {
      try {
        res = await staffApi.add(dataSubmit);
        res?.status == 200 && afterPost(res.data.message);
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

  // -------------- CHECK FIELD ---------------------
  const checkField = (valueSearch, dataIndex) => {
    let newList = { ...listFieldSearch };
    Object.keys(newList).forEach(function (key) {
      console.log("key: ", key);
      if (key != dataIndex) {
        if (key != "pageIndex") {
          newList[key] = null;
        }
      } else {
        newList[key] = valueSearch;
      }
    });

    return newList;
  };

  // -------------- HANDLE FILTER ------------------
  const handleFilter = (listFilter) => {
    console.log("List Filter when submit: ", listFilter);

    let newListFilter = { ...listFieldFilter };
    listFilter.forEach((item, index) => {
      let key = item.name;
      Object.keys(newListFilter).forEach((keyFilter) => {
        if (keyFilter == key) {
          newListFilter[key] = item.value;
        }
      });
    });
    setTodoApi({ ...listTodoApi, ...newListFilter, pageIndex: 1 });
  };

  // --------------- HANDLE SORT ----------------------
  const handleSort = async (option) => {
    let newTodoApi = {
      ...listTodoApi,
      pageIndex: 1,
      sort: option.title.sort,
      sortType: option.title.sortType,
    };
    setCurrentPage(1), setTodoApi(newTodoApi);
  };

  // ------------ ON SEARCH -----------------------
  const onSearch = (valueSearch, dataIndex) => {
    let clearKey = checkField(valueSearch, dataIndex);

    setTodoApi({
      ...todoApi,
      ...clearKey,
      ...listFieldFilter,
    });
  };

  // HANDLE RESET
  const resetListFieldSearch = () => {
    Object.keys(listFieldSearch).forEach(function (key) {
      if (key != "pageIndex") {
        listFieldSearch[key] = null;
      }
    });
  };

  const handleReset = () => {
    setTodoApi({
      ...listTodoApi,
      pageIndex: 1,
    });
    setCurrentPage(1), resetListFieldSearch();
  };

  // -------------- GET PAGE_NUMBER -----------------
  const getPagination = (pageNumber: number) => {
    pageIndex = pageNumber;
    setCurrentPage(pageNumber);
    setTodoApi({
      ...todoApi,
      ...listFieldSearch,
      ...listFieldFilter,
      pageIndex: pageIndex,
    });
  };

  // ============== USE EFFECT - FETCH DATA ===================
  useEffect(() => {
    getDataSource();
  }, [todoApi]);

  useEffect(() => {
    getDataCenter();
    getDataArea();
  }, []);

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "FullNameUnicode",
      ...FilterColumn("FullNameUnicode", onSearch, handleReset, "text"),
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Trung tâm",
      dataIndex: "Branch",

      // ...FilterColumn("Center"),
      render: (branch) => (
        <>
          {branch.map((item) => (
            <a href="/" className="font-weight-blue d-block">
              {item.BranchName}
            </a>
          ))}
        </>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "Gender",
      render: (gender) => (
        <>{gender == 0 ? "Nữ" : gender == 1 ? "Nam" : "Khác"}</>
      ),
    },
    {
      title: "Tài khoản",
      dataIndex: "UserName",
    },
    {
      title: "Email",
      dataIndex: "Email",
    },
    // {
    //   title: "SĐT",
    //   dataIndex: "Mobile",
    // },
    {
      title: "Chức vụ",
      dataIndex: "RoleName",
    },
    {
      title: "Ngày nhận việc",
      dataIndex: "Jobdate",
      render: (date: any) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      dataIndex: "StatusID",
      className: "text-center",
      render: (status) => (
        <>
          {
            <span className={`tag ${status == 0 ? "green" : "red"}`}>
              {status == 0 ? "Hoạt động" : "Khóa"}
            </span>
          }
        </>
      ),
    },
    {
      title: "",
      dataIndex: "Action",
      key: "action",
      align: "center",
      render: (Action) => (
        <Link
          href={{
            pathname: "/staff/staff-list/staff-detail/[slug]",
            query: { slug: 2 },
          }}
        >
          <a className="btn btn-icon">
            <Tooltip title="Chi tiết">
              <Eye />
            </Tooltip>
          </a>
        </Link>
      ),
    },
  ];

  return (
    <>
      <PowerTable
        currentPage={currentPage}
        totalPage={totalPage && totalPage}
        getPagination={(pageNumber: number) => getPagination(pageNumber)}
        loading={isLoading}
        addClass="basic-header"
        columns={columns}
        dataSource={dataSource}
        TitlePage="Danh sách nhân viên"
        TitleCard={<ModalAdd />}
        Extra={
          <div className="extra-table">
            <FilterBase
              dataFilter={dataFilter}
              handleFilter={(listFilter: any) => handleFilter(listFilter)}
              handleReset={handleReset}
            />
            <SortBox
              handleSort={(value) => handleSort(value)}
              dataOption={dataOption}
            />
          </div>
        }
      />
    </>
  );
};
StaffList.layout = LayoutBase;

export default StaffList;
