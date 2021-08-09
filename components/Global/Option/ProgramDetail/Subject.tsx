import React, { useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import { useRouter } from "next/router";
import { useWrap } from "~/context/wrap";
import { subjectApi, programApi } from "~/apiBase";
import CurriculumForm from "~/components/Global/Option/CurriculumForm";
import SubjectForm from "../SubjectForm";
import { CheckCircle } from "react-feather";

let pageIndex = 1;

let listFieldSearch = {
  pageIndex: 1,
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

const Subject = () => {
  const router = useRouter();
  const programID = parseInt(router.query.slug as string);

  const listTodoApi = {
    pageSize: 10,
    pageIndex: pageIndex,
    ProgramID: programID ? programID : null,
  };

  const [dataProgram, setDataProgram] = useState<IProgram[]>([]);

  // ------ BASE USESTATE TABLE -------
  const [dataSource, setDataSource] = useState<ISubject[]>([]);
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
      let res = await subjectApi.getAll(todoApi);

      if (res.status == 200) {
        if (res.data.data.length > 0) {
          setDataSource(res.data.data);
          setTotalPage(res.data.totalRow);
          showNoti("success", "Tải môn học thành công");
        } else {
          showNoti("danger", "Không có dữ liệu");
        }
      }

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

  // GET DATA PROGRAM
  const getDataProgram = async () => {
    try {
      let res = await programApi.getAll(todoApi);
      res.status == 200 && setDataProgram(res.data.data);

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
        res = await subjectApi.update(dataSubmit);

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
        res = await subjectApi.add(dataSubmit);
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
      let res = await subjectApi.update(dataChange);
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

  useEffect(() => {
    getDataProgram();
  }, []);

  const columns = [
    {
      title: "Môn học",
      dataIndex: "SubjectName",
      key: "subjectname",
      width: "20%",
      className: "col-long",
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Bổ sung",
      dataIndex: "Additional",
      key: "additional",
      className: "text-center",
      render: (text, data, index) => (
        <>{text == true && <CheckCircle className="icon-additional" />}</>
      ),
    },

    {
      render: (text, data, index) => (
        <>
          <SubjectForm
            getIndex={() => setIndexRow(index)}
            index={index}
            rowData={data}
            rowID={data.ID}
            isLoading={isLoading}
            _onSubmit={(data: any) => _onSubmit(data)}
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <PowerTable
        currentPage={currentPage}
        totalPage={totalPage && totalPage}
        getPagination={(pageNumber: number) => getPagination(pageNumber)}
        addClass="table-fix-column"
        loading={isLoading}
        TitleCard={
          <SubjectForm
            dataProgram={dataProgram}
            isLoading={isLoading}
            _onSubmit={(data: any) => _onSubmit(data)}
          />
        }
        dataSource={dataSource}
        columns={columns}
        Extra={
          // <div className="extra-table">
          //   <SearchBox />
          // </div>
          "Môn học"
        }
      />
    </div>
  );
};

export default Subject;
