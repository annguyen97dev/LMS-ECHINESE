import React, { useState, useEffect } from "react";
import ExpandTable from "~/components/ExpandTable";
import { Eye } from "react-feather";
import { Card, Tooltip } from "antd";
import Link from "next/link";
import { data } from "~/lib/customer-student/data";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import LayoutBase from "~/components/LayoutBase";
import { useWrap } from "~/context/wrap";
import StudentForm from "~/components/Global/Customer/Student/StudentForm";
import {
  studentApi,
  areaApi,
  studentChangeApi,
  jobApi,
  puroseApi,
  branchApi,
  sourceInfomationApi,
  parentsApi,
  staffApi,
} from "~/apiBase";
import FilterBase from "~/components/Elements/FilterBase/FilterBase";
import StudentExchangeForm from "~/components/Global/Customer/Student/StudentExchangeForm";

let pageIndex = 1;

let listFieldSearch = {
  pageIndex: 1,
  FullNameUnicode: null,
};

let listFieldFilter = {
  pageIndex: 1,
  SourceInformationID: null,
  BranchID: null,
  fromDate: null,
  toDate: null,
};

const dataOption = [
  {
    dataSort: {
      sort: 0,
      sortType: true,
    },
    text: "Tên A-Z",
  },
  {
    dataSort: {
      sort: 0,
      sortType: false,
    },
    text: "Tên Z-A",
  },
];

// -- FOR DIFFERENT VIEW --
interface optionObj {
  title: string;
  value: number;
}

interface listDataForm {
  Area: Array<optionObj>;
  DistrictID: Array<optionObj>;
  WardID: Array<optionObj>;
  Job: Array<optionObj>;
  Branch: Array<optionObj>;
  Purposes: Array<optionObj>;
  SourceInformation: Array<optionObj>;
  Parent: Array<optionObj>;
  Counselors: Array<optionObj>;
}

const optionGender = [
  {
    value: 0,
    title: "Nữ",
  },
  {
    value: 1,
    title: "Nam",
  },
  {
    value: 0,
    title: "Khác",
  },
];

const listApi = [
  {
    api: areaApi,
    text: "Tỉnh/Tp",
    name: "Area",
  },

  {
    api: jobApi,
    text: "Công việc",
    name: "Job",
  },
  {
    api: puroseApi,
    text: "Mục đích học",
    name: "Purposes",
  },
  {
    api: branchApi,
    text: "Trung tâm",
    name: "Branch",
  },
  {
    api: parentsApi,
    text: "Phụ huynh",
    name: "Parent",
  },
  {
    api: sourceInfomationApi,
    text: "Nguồn khách hàng",
    name: "SourceInformation",
  },
  {
    api: staffApi,
    text: "Tư vấn viên",
    name: "Counselors",
  },
];

const StudentExchange = () => {
  // ------ BASE USESTATE TABLE -------
  const [dataSource, setDataSource] = useState<IStudentChange[]>([]);
  const { showNoti, pageSize } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [totalPage, setTotalPage] = useState(null);
  const [indexRow, setIndexRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const listTodoApi = {
    pageSize: pageSize,
    pageIndex: pageIndex,
    sort: null,
    sortType: null,
    FullNameUnicode: null,
    SourceInformationID: null,
    BranchID: null,
    fromDate: null,
    toDate: null,
  };
  const [todoApi, setTodoApi] = useState(listTodoApi);

  const [dataCenter, setDataCenter] = useState<IBranch[]>([]);
  const [dataRow, setDataRow] = useState([]);

  const [listDataForm, setListDataForm] = useState<listDataForm>({
    Area: [],
    DistrictID: [],
    WardID: [],
    Job: [],
    Branch: [],
    Purposes: [],
    SourceInformation: [],
    Parent: [],
    Counselors: [],
  });

  // ------ LIST FILTER -------
  const [dataFilter, setDataFilter] = useState([
    {
      name: "SourceInformationID",
      title: "Nguồn khách",
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
      name: "date-range",
      title: "Từ - đến",
      col: "col-12",
      type: "date-range",
      value: null,
    },
  ]);

  // FOR STUDENT FORM
  // ------------- ADD data to list --------------

  const makeNewData = (data, name) => {
    let newData = null;
    switch (name) {
      case "Area":
        newData = data.map((item) => ({
          title: item.AreaName,
          value: item.AreaID,
        }));
        break;
      case "DistrictID":
        newData = data.map((item) => ({
          title: item.DistrictName,
          value: item.ID,
        }));
        break;
      case "WardID":
        newData = data.map((item) => ({
          title: item.WardName,
          value: item.ID,
        }));
        break;
      case "Branch":
        newData = data.map((item) => ({
          title: item.BranchName,
          value: item.ID,
        }));
        setDataFunc("BranchID", newData);
        break;
      case "Job":
        newData = data.map((item) => ({
          title: item.JobName,
          value: item.JobID,
        }));
        break;
      case "Purposes":
        newData = data.map((item) => ({
          title: item.PurposesName,
          value: item.PurposesID,
        }));
        break;
      case "Parent":
        newData = data.map((item) => ({
          title: item.FullNameUnicode,
          value: item.UserInformationID,
        }));
        break;
      case "SourceInformation":
        newData = data.map((item) => ({
          title: item.SourceInformationName,
          value: item.SourceInformationID,
        }));
        setDataFunc("SourceInformationID", newData);
        break;
      case "Counselors":
        newData = data.map((item) => ({
          title: item.FullNameUnicode,
          value: item.UserInformationID,
        }));
        break;
      default:
        break;
    }

    return newData;
  };

  const getDataTolist = (data: any, name: any) => {
    let newData = makeNewData(data, name);

    Object.keys(listDataForm).forEach(function (key) {
      if (key == name) {
        listDataForm[key] = newData;
      }
    });
    setListDataForm({ ...listDataForm });
  };

  // ----------- GET DATA SOURCE ---------------
  const getDataStudentForm = (arrApi) => {
    arrApi.forEach((item, index) => {
      (async () => {
        let res = null;
        try {
          if (item.name == "Counselors") {
            res = await item.api.getAll({
              pageIndex: 1,
              pageSize: 99999,
              RoleID: 6,
            });
          } else {
            res = await item.api.getAll({ pageIndex: 1, pageSize: 99999 });
          }

          res.status == 200 && getDataTolist(res.data.data, item.name);

          res.status == 204 &&
            showNoti("danger", item.text + " Không có dữ liệu");
        } catch (error) {
          showNoti("danger", error.message);
        } finally {
        }
      })();
    });
  };

  // GET DATA SOURCE
  const getDataSource = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    try {
      let res = await studentChangeApi.getAll(todoApi);
      res.status == 200 &&
        (setDataSource(res.data.data),
        setTotalPage(res.data.totalRow),
        showNoti("success", "Thành công"));
      res.status == 204 &&
        showNoti("danger", "Không có dữ liệu") &&
        setDataSource([]);
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

  // ---------------- AFTER SUBMIT -----------------
  const afterPost = (mes) => {
    // showNoti("success", mes);
    setTodoApi({
      ...listTodoApi,
      pageIndex: 1,
    });
    setCurrentPage(1);
  };

  console.log("LIST DATA FORM: ", listDataForm);

  // ----------------- ON SUBMIT --------------------
  const _onSubmit = async (dataSubmit: any, rowData: IStudentChange) => {
    console.log("Data submit: ", dataSubmit);

    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });

    let res = null;

    if (dataSubmit.UserInformationID) {
      try {
        res = await studentChangeApi.update(dataSubmit);

        if (res.status == 200) {
          let newDataSource = [...dataSource];
          newDataSource.splice(indexRow, 1, {
            ...rowData,
            CounselorsName: listDataForm.Counselors.find(
              (item) => item.value == dataSubmit.CounselorsID
            ).title,
          });
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
        res = await studentChangeApi.add(dataSubmit);
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

  const onSearch = (valueSearch, dataIndex) => {
    let clearKey = checkField(valueSearch, dataIndex);

    setTodoApi({
      ...todoApi,
      ...clearKey,
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
      pageIndex: pageIndex,
    });
  };

  // ============== USE EFFECT - FETCH DATA ===================
  useEffect(() => {
    getDataSource();
  }, [todoApi]);

  useEffect(() => {
    getDataStudentForm(listApi);
  }, []);

  // EXPAND ROW

  const expandedRowRender = (data, index) => {
    return (
      <>
        {/* <Card title="Thông tin cá nhân">
          <InfoCusCard />
        </Card> */}
        <StudentForm
          index={index}
          dataRow={data}
          listDataForm={listDataForm}
          _handleSubmit={(dataSubmit, index) => {
            let newDataSource = [...dataSource];
            newDataSource.splice(index, 1, {
              ...dataSubmit,
              AreaName: listDataForm.Area.find(
                (item) => item.value == dataSubmit.AreaID
              ).title,
            });
            console.log("NEW DATA: ", newDataSource);
            setDataSource(newDataSource);
          }}
        />
      </>
    );
  };

  // Columns
  const columns = [
    {
      title: "Tỉnh/TP",
      dataIndex: "AreaName",

      // ...FilterColumn("city")
    },
    {
      title: "Họ tên",
      dataIndex: "FullNameUnicode",
      render: (nameStudent) => (
        <p className="font-weight-blue">{nameStudent}</p>
      ),
      ...FilterColumn("FullNameUnicode", onSearch, handleReset, "text"),
    },
    {
      title: "SĐT",
      dataIndex: "Mobile",
      // ...FilterColumn("tel")
    },
    {
      title: "Email",
      dataIndex: "Email",
      // ...FilterColumn("email")
    },
    {
      title: "Tư vấn viên",
      dataIndex: "CounselorsName",
    },
    {
      title: "Nguồn",
      dataIndex: "SourceInformationName",
      //  ...FilterColumn("introducer")
    },
    {
      title: "Trạng thái",
      dataIndex: "StatusID",
      align: "center",
      render: (status) => {
        return (
          <>
            {status == 0 ? (
              <span className="tag green">Hoạt động</span>
            ) : (
              <span className="tag gray">Đã khóa</span>
            )}
          </>
        );
      },
    },

    {
      title: "",
      render: (text, data, index) => (
        <>
          <Link
            href={{
              pathname: "/customer/student/student-list/student-detail/[slug]",
              query: { slug: 2 },
            }}
          >
            <Tooltip title="Xem chi tiết">
              <button className="btn btn-icon">
                <Eye />
              </button>
            </Tooltip>
          </Link>
          <StudentExchangeForm
            getIndex={() => setIndexRow(index)}
            index={index}
            rowData={data}
            rowID={data.UserInformationID}
            listData={listDataForm}
            isLoading={isLoading}
            _onSubmit={(data: any, rowData: IStudentChange) =>
              _onSubmit(data, rowData)
            }
          />
        </>
      ),
    },
  ];

  return (
    <ExpandTable
      currentPage={currentPage}
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      loading={isLoading}
      addClass="basic-header"
      TitlePage="Học viên chuyển giao"
      dataSource={dataSource}
      columns={columns}
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
      handleExpand={(data) => setDataRow(data)}
      expandable={{ expandedRowRender }}
    />
  );
};
StudentExchange.layout = LayoutBase;

export default StudentExchange;
