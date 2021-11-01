import React, { useEffect, useState } from "react";
import { testCustomerPointApi, teacherApi, staffApi } from "~/apiBase";
import NestedTable from "~/components/Elements/NestedTable";
import TestCustomerPointForm from "~/components/Global/Customer/Service/TestCustomerPointForm";
import testCustomerPointForm from "~/components/Global/Customer/Service/TestCustomerPointForm";
import PowerTable from "~/components/PowerTable";
import { useWrap } from "~/context/wrap";

let pageIndex = 1;

const TestCustomerPoint = (props) => {
  const { ID } = props;

  // ------ BASE USESTATE TABLE -------
  const [dataSource, setDataSource] = useState<ITestCustomerPoint[]>();
  const { showNoti, pageSize } = useWrap();
  const listTodoApi = {
    pageSize: pageSize,
    pageIndex: pageIndex,
    sort: null,
    sortType: null,
    FullNameUnicode: null,
    BranchID: null, // lọc
    UserInformationID: null,
    Status: null,
    AppointmentDate: null,
  };
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [totalPage, setTotalPage] = useState(null);
  const [indexRow, setIndexRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [todoApi, setTodoApi] = useState(listTodoApi);

  const [dataTeacher, setDataTeacher] = useState(null);
  const [dataCounselor, setDataCounselor] = useState(null);

  // GET DATA TEACHER
  const getDataTeacher = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    try {
      let res = await teacherApi.getAll({
        pageIndex: 1,
        pageSize: 9999,
        Enable: true,
      });
      if (res.status == 200) {
        let newData = res.data.data.map((item) => ({
          title: item.FullNameUnicode,
          value: item.UserInformationID,
        }));
        setDataTeacher(newData);
        // setTotalPage(res.data.totalRow), showNoti("success", "Thành công");
      }
      res.status == 204 && showNoti("danger", "Giáo viên không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  // GET DATA COUNSELOR
  const getDataCounselor = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    try {
      let res = await staffApi.getAll({
        pageIndex: 1,
        pageSize: 9999,
        Enable: true,
        RoleID: 6,
      });
      if (res.status == 200) {
        let newData = res.data.data.map((item) => ({
          title: item.FullNameUnicode,
          value: item.UserInformationID,
        }));
        setDataTeacher(newData);
        // setTotalPage(res.data.totalRow), showNoti("success", "Thành công");
      }
      res.status == 204 && showNoti("danger", "Tư vấn viên không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  // GET DATA SOURCE
  const getDataSource = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    try {
      let res = await testCustomerPointApi.getWithID(ID);
      if (res.status == 200) {
        let arr = [];
        arr.push(res.data.data);
        setDataSource(arr);
        // setTotalPage(res.data.totalRow), showNoti("success", "Thành công");
      }
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

  // ---------------- AFTER SUBMIT -----------------
  const afterPost = (mes) => {
    // showNoti("success", mes);
    setTodoApi({
      ...listTodoApi,
      pageIndex: 1,
    });
    setCurrentPage(1);
  };

  // ----------------- ON SUBMIT --------------------
  const _onSubmit = async (dataSubmit: any) => {
    console.log("Data submit: ", dataSubmit);
    setIsLoading({
      type: "ADD_DATA",
      status: true,
    });

    let res = null;

    try {
      if (dataSubmit.ExamAppointmentID) {
        res = await testCustomerPointApi.update(dataSubmit);

        if (res.status == 200) {
          let newDataSource = [...dataSource];
          newDataSource.splice(indexRow, 1, {
            ...dataSubmit,
            TeacherName: dataSubmit.TeacherID
              ? dataTeacher.find((item) => item.value == dataSubmit.TeacherID)
                  .title
              : "",
          });
          setDataSource(newDataSource);
          showNoti("success", "Cập nhật thành công");
        }
      } else {
        res = await testCustomerPointApi.add(dataSubmit);
        res?.status == 200 && afterPost(res.data.message);
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

    return res;
  };

  // -------------- GET PAGE_NUMBER -----------------
  const getPagination = (pageNumber: number) => {
    pageIndex = pageNumber;
    setCurrentPage(pageNumber);
    console.log("Todoapi: ", todoApi);
    setTodoApi({
      ...todoApi,
      // ...listFieldSearch,
      pageIndex: pageIndex,
    });
  };

  // Columns
  const columns = [
    {
      align: "center",
      title: "Listening",
      dataIndex: "ListeningPoint",
    },
    {
      align: "center",
      title: "Speaking",
      dataIndex: "SpeakingPoint",
    },
    {
      align: "center",
      title: "Reading",
      dataIndex: "ReadingPoint",
    },
    {
      align: "center",
      title: "Writting",
      dataIndex: "WritingPoint",
    },
    {
      align: "center",
      title: "Vocabulary",
      dataIndex: "VocabPoint",
    },
    {
      title: "Học phí tối đa",
      dataIndex: "MaxTuitionOfStudent",
      render: (value) => {
        if (value) {
          value = value.toString();
          let money = parseInt(value.replace(/\,/g, ""), 10);
          return <>{money.toLocaleString()}</>;
        } else {
          return;
        }
      },
    },
    {
      title: "Giáo viên",
      dataIndex: "TeacherName",
    },
    {
      title: "Tư vấn viên",
      dataIndex: "CounselorsName",
    },
    {
      title: "Ghi chú",
      dataIndex: "Note",
    },
    {
      title: "",
      render: (text, data, index) => (
        <>
          <TestCustomerPointForm
            getIndex={() => setIndexRow(index)}
            index={index}
            rowData={data}
            rowID={data.ExamAppointmentID}
            teacherList={dataTeacher}
            isLoading={isLoading}
            _onSubmit={(data: any) => _onSubmit(data)}
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    getDataSource();
  }, [todoApi]);

  useEffect(() => {
    getDataCounselor();
    getDataTeacher();
  }, []);

  return (
    <div>
      <NestedTable
        currentPage={currentPage}
        totalPage={totalPage && totalPage}
        getPagination={(pageNumber: number) => getPagination(pageNumber)}
        loading={isLoading}
        addClass="basic-header"
        TitlePage="Bảng điểm test"
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
};

export default TestCustomerPoint;
