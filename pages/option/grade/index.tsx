import React, { useEffect, useState, useReducer } from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../lib/option/dataOption";
import { Tooltip, Switch } from "antd";
import GradeForm from "~/components/Global/Option/GradeForm";
import FilterColumn from "~/components/Tables/FilterColumn";
import SortBox from "~/components/Elements/SortBox";
import LayoutBase from "~/components/LayoutBase";
import { gradeApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import { Trash2 } from "react-feather";
import moment from "moment";

let pageIndex = 1;

let listFieldSearch = {
  pageIndex: 1,
  GradeCode: null,
  GradeName: null,
};

const listTodoApi = {
  pageSize: 10,
  pageIndex: pageIndex,
  sort: null,
  sortType: null,
  GradeCode: null,
  GradeName: null,
};

const dataOption = [
  {
    dataSort: {
      sort: 0,
      sortType: false,
    },
    text: "Tên giảm dần",
  },
  {
    dataSort: {
      sort: 0,
      sortType: true,
    },
    text: "Tên tăng dần ",
  },
];

const Grade = () => {
  // ------ BASE USESTATE TABLE -------
  const [dataSource, setDataSource] = useState<IGrade[]>([]);
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [totalPage, setTotalPage] = useState(null);
  const [indexRow, setIndexRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [todoApi, setTodoApi] = useState(listTodoApi);

  // GET DATA SOURCE
  const getDataSource = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    try {
      let res = await gradeApi.getAll(todoApi);
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
        res = await gradeApi.update(dataSubmit);

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
        res = await gradeApi.add(dataSubmit);
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

  // ----------------- TURN OF ------------------------
  const changeStatus = async (checked: boolean, idRow: number) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    let dataChange = {
      ID: idRow,
      Enable: checked,
    };

    try {
      let res = await gradeApi.update(dataChange);
      res.status == 200 && setTodoApi({ ...todoApi });
    } catch (error) {
      showNoti("danger", error.Message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
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

  // Columns
  const columns = [
    {
      title: "Mã khối",
      dataIndex: "GradeCode",
      ...FilterColumn("GradeCode", onSearch, handleReset, "text"),
    },
    {
      title: "Tên khối",
      dataIndex: "GradeName",
      ...FilterColumn("GradeName", onSearch, handleReset, "text"),
    },
    {
      title: "Description",
      dataIndex: "Description",
    },

    {
      title: "Create on",
      dataIndex: "CreatedOn",
      render: (date: any) => moment(date).format("DD/MM/YYYY"),
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
            onChange={(checked) => changeStatus(checked, record.ID)}
          />
        </>
      ),
    },
    {
      render: (text, data, index) => (
        <>
          <Tooltip title="Cập nhật trung tâm">
            <GradeForm
              getIndex={() => setIndexRow(index)}
              index={index}
              rowData={data}
              rowID={data.ID}
              isLoading={isLoading}
              _onSubmit={(data: any) => _onSubmit(data)}
            />
          </Tooltip>
        </>
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
        TitlePage="Danh sách khối học"
        TitleCard={
          <GradeForm
            isLoading={isLoading}
            _onSubmit={(data: any) => _onSubmit(data)}
          />
        }
        dataSource={dataSource}
        columns={columns}
        Extra={
          <div className="extra-table">
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
Grade.layout = LayoutBase;
export default Grade;
