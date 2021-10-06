import React, { useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import { useRouter } from "next/router";
import { useWrap } from "~/context/wrap";
import { curriculumApi, programApi, subjectApi } from "~/apiBase";
import CurriculumForm from "~/components/Global/Option/CurriculumForm";
import { Tooltip } from "antd";
import Link from "next/link";
import { Info } from "react-feather";
import ExpandTable from "~/components/ExpandTable";
import CurriculumDetail from "./CurriculumDetail";

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

const Curriculum = () => {
  const router = useRouter();
  const programID = parseInt(router.query.slug as string);

  const listTodoApi = {
    pageSize: 10,
    pageIndex: pageIndex,
    ProgramID: programID ? programID : null,
  };

  const [dataProgram, setDataProgram] = useState<IProgram[]>([]);
  const [dataSubject, setDataSubject] = useState<ISubject[]>();
  const [curriculumID, setCurriculumID] = useState(null);

  // ------ BASE USESTATE TABLE -------
  const [dataSource, setDataSource] = useState<ICurriculum[]>([]);
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [totalPage, setTotalPage] = useState(null);
  const [indexRow, setIndexRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [todoApi, setTodoApi] = useState(listTodoApi);

  // GET DATA COURSE
  const getDataSource = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    try {
      let res = await curriculumApi.getAll(todoApi);

      if (res.status == 200) {
        if (res.data.data.length > 0) {
          setDataSource(res.data.data);
          setTotalPage(res.data.totalRow);
          // showNoti("success", "Tải giáo trình thành công");
        } else {
          showNoti("danger", "Không có dữ liệu");
        }
      }

      // res.status == 204 && showNoti("danger", "Không có dữ liệu");
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

  // ---------------- GET DATA SUBJECT -------------

  const getDataSubject = async () => {
    console.log("Chạy vô đây");
    try {
      let res = await subjectApi.getAll({
        ProgramID: programID,
        pageIndex: 1,
        pageSize: 9999,
      });

      if (res.status == 200) {
        if (res.data.data.length > 0) {
          setDataSubject(res.data.data);
        } else {
          showNoti("danger", "Không có dữ liệu môn học");
        }
      }

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
        res = await curriculumApi.update(dataSubmit);

        if (res.status == 200) {
          let newDataSource = [...dataSource];
          newDataSource.splice(indexRow, 1, dataSubmit);
          setDataSource(newDataSource);
          showNoti("success", res.data.message);
          getDataSubject();
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
        res = await curriculumApi.add(dataSubmit);
        res?.status == 200 && (afterPost(res.data.message), getDataSubject());
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
      // ...listFieldSearch,
      pageIndex: pageIndex,
    });
  };

  // ============== USE EFFECT - FETCH DATA ===================
  useEffect(() => {
    getDataSource();
  }, [todoApi]);

  useEffect(() => {
    getDataProgram();
    getDataSubject();
  }, []);

  // EXPANDED ROW RENDER

  const selectSubject = (value) => {
    console.log("Value: ", value);
  };

  const expandedRowRender = () => {
    return (
      <>
        <CurriculumDetail
          dataSubject={dataSubject}
          programID={programID}
          curriculumID={curriculumID}
        />
      </>
    );
  };

  const columns = [
    {
      title: "Giáo trình",
      dataIndex: "CurriculumName",
      key: "curriculumname",
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Thời gian học",
      dataIndex: "TimeOfLesson",
      key: "timeoflesson",
      className: "text-center",
    },
    {
      title: "Số buổi học",
      dataIndex: "Lesson",
      key: "lesson",
      className: "text-center",
    },

    {
      key: "action",
      render: (text, data, index) => (
        <>
          {/* <Link
            href={{
              pathname: "/option/program/curriculum-detail/[slug]",
              query: { slug: data.ID },
            }}
          >
            <Tooltip title="Chi tiết chương trình">
              <button className="btn btn-icon">
                <Info />
              </button>
            </Tooltip>
          </Link> */}
          <CurriculumForm
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
      {/* <PowerTable
        currentPage={currentPage}
        totalPage={totalPage && totalPage}
        getPagination={(pageNumber: number) => getPagination(pageNumber)}
        addClass="table-fix-column"
        loading={isLoading}
        TitleCard={
          <CurriculumForm
            dataProgram={dataProgram}
            isLoading={isLoading}
            _onSubmit={(data: any) => _onSubmit(data)}
          />
        }
        dataSource={dataSource}
        columns={columns}
        Extra={

          "Giáo trình"
        }
      /> */}

      <ExpandTable
        currentPage={currentPage}
        totalPage={totalPage && totalPage}
        getPagination={(pageNumber: number) => getPagination(pageNumber)}
        loading={isLoading}
        TitleCard={
          <CurriculumForm
            dataProgram={dataProgram}
            isLoading={isLoading}
            _onSubmit={(data: any) => _onSubmit(data)}
          />
        }
        dataSource={dataSource}
        columns={columns}
        Extra={"Giáo trình"}
        expandable={{ expandedRowRender }}
        handleExpand={(record: any) => (
          setCurriculumID(record.ID), getDataSubject()
        )}
      />
    </div>
  );
};

export default Curriculum;
