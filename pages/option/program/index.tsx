import React, { FC, Fragment, useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import randomColor from "randomcolor";
import { Tag, Tooltip, Switch } from "antd";
import { Info, RotateCcw } from "react-feather";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
// import FilterTable from "~/components/Global/CourseList/FilterTable";
import Link from "next/link";
import LayoutBase from "~/components/LayoutBase";
import { programApi, gradeApi } from "~/apiBase";
import moment from "moment";
import { useWrap } from "~/context/wrap";
import ClassModal from "~/components/Global/Option/ClassModal";
import ProgramForm from "~/components/Global/Option/ProgramForm";
import FilterProgram from "~/components/Global/Option/FilterTable/FilterProgram";

let pageIndex = 1;

let listFieldSearch = {
  pageIndex: 1,
  ProgramCode: null,
  ProgramName: null,
};

const listTodoApi = {
  pageSize: 10,
  pageIndex: pageIndex,
  sort: null,
  sortType: null,
  ProgramCode: null,
  ProgramName: null,
  Type: null,
  Level: null,
  fromDate: null,
  toDate: null,
};

const dataOption = [
  {
    dataSort: {
      sort: 0,
      sortType: false,
    },
    text: "Tên Z - A",
  },
  {
    dataSort: {
      sort: 0,
      sortType: true,
    },
    text: "Tên A - Z ",
  },
  {
    dataSort: {
      sort: 2,
      sortType: false,
    },
    text: "Học phí Z - A ",
  },
  {
    dataSort: {
      sort: 2,
      sortType: true,
    },
    text: "Học phí A - Z ",
  },
];

const Programs = () => {
  const [dataGrade, setDataGrade] = useState<IGrade[]>([]);
  const [dataLevel, setDataLevel] = useState([]);

  // ------ BASE USESTATE TABLE -------
  const [dataSource, setDataSource] = useState<IProgram[]>([]);
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
      let res = await programApi.getAll(todoApi);
      res.status == 200 &&
        (setDataSource(res.data.data),
        setTotalPage(res.data.totalRow),
        setDataLevel(res.data.listLevel),
        showNoti("success", res.data.message));

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

  // GET DATA CENTER
  const getDataGrade = async () => {
    try {
      let res = await gradeApi.getAll({
        pageIndex: 1,
        pageSize: Number.MAX_SAFE_INTEGER,
      });
      res.status == 200 && setDataGrade(res.data.data);
      res.status == 204 && showNoti("danger", "Không có dữ liệu");
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
        res = await programApi.update(dataSubmit);

        if (res.status == 200) {
          let newDataSource = [...dataSource];
          newDataSource.splice(indexRow, 1, {
            ...dataSubmit,
            GradeName: dataGrade.find((item) => item.ID === dataSubmit.GradeID)
              .GradeName,
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
        res = await programApi.add(dataSubmit);
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
      let res = await programApi.update(dataChange);
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

  // -------------- HANDLE FILTER -------------------
  const handleFilter = (value) => {
    console.log("Value in here: ", value);
    setTodoApi({
      ...listTodoApi,
      ...value,
    });
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
      ...listTodoApi,
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
    getDataGrade();
  }, []);

  // ---------------- COLUMN --------------------
  const columns = [
    {
      title: "Khóa học",
      dataIndex: "GradeName",

      render: (text) => {
        return <p className="font-weight-black">{text}</p>;
      },
    },
    {
      title: "Tên lớp",
      dataIndex: "ProgramName",
      ...FilterColumn("ProgramName", onSearch, handleReset, "text"),
      render: (text) => {
        return <p className="font-weight-blue">{text}</p>;
      },
    },
    {
      title: "Level",
      dataIndex: "Level",
    },
    {
      title: "Học phí",
      dataIndex: "Price",

      render: (Price) => {
        return (
          <p className="font-weight-black">
            {new Intl.NumberFormat().format(Price)}
          </p>
        );
      },
    },
    {
      title: "Loại",
      dataIndex: "Type",
      // ...FilterColumn("Price"),
      render: (Type) => {
        return Type == 1 ? "Zoom" : "Offline";
      },
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
      title: "ModifiedBy",
      dataIndex: "ModifiedBy",
    },
    {
      title: "ModifiedOn",
      dataIndex: "ModifiedOn",
      render: (date: any) => moment(date).format("DD/MM/YYYY"),
    },

    {
      render: (value, data, index) => (
        <>
          <Link
            href={{
              pathname: "/option/program/program-detail/[slug]",
              query: { slug: data.ID },
            }}
          >
            <Tooltip title="Chi tiết chương trình">
              <button className="btn btn-icon">
                <Info />
              </button>
            </Tooltip>
          </Link>

          <ProgramForm
            getIndex={() => setIndexRow(index)}
            _onSubmit={(data: any) => _onSubmit(data)}
            programID={data.ID}
            rowData={data}
            dataGrade={dataGrade}
            showAdd={true}
            isLoading={isLoading}
          />
        </>
      ),
    },
  ];

  return (
    <Fragment>
      <PowerTable
        currentPage={currentPage}
        totalPage={totalPage && totalPage}
        getPagination={(pageNumber: number) => getPagination(pageNumber)}
        loading={isLoading}
        addClass="basic-header"
        TitlePage="Danh sách chương trình"
        TitleCard={
          <ProgramForm
            _onSubmit={(data: any) => _onSubmit(data)}
            dataGrade={dataGrade}
            showAdd={true}
            isLoading={isLoading}
          />
        }
        dataSource={dataSource}
        columns={columns}
        Extra={
          <div className="extra-table">
            <FilterProgram
              handleReset={handleReset}
              dataLevel={dataLevel}
              handleFilter={(value: any) => handleFilter(value)}
            />
            <SortBox
              handleSort={(value) => handleSort(value)}
              dataOption={dataOption}
            />
          </div>
        }
      />

      {/* <ClassForm visible={ClassForm} onCancel={() => setClassForm(false)} /> */}
    </Fragment>
  );
};
Programs.layout = LayoutBase;
export default Programs;
