import React, { useState, useEffect } from "react";
import ExpandTable from "~/components/ExpandTable";
import { Eye } from "react-feather";
import { Card, Tooltip } from "antd";
import Link from "next/link";
import InfoCusCard from "~/components/Profile/ProfileCustomer/component/InfoCusCard";
import { data } from "~/lib/customer-student/data";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
import { studentApi, branchApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import StudentForm from "~/components/Global/Customer/Student/StudentForm";
// import StudentForm from "~/components/Global/Customer/Student/StudentForm";

let pageIndex = 1;

let listFieldSearch = {
  pageIndex: 1,
  FullNameUnicode: null,
};

const listTodoApi = {
  pageSize: 10,
  pageIndex: pageIndex,
  sort: null,
  sortType: null,
  formDate: null,
  toDate: null,
  FullNameUnicode: null,
  DistrictID: null,
  SourceInformationID: null,
  JobID: null,
  BranchID: null,
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

const StudentData = () => {
  const [dataCenter, setDataCenter] = useState<IBranch[]>([]);
  const [dataRow, setDataRow] = useState([]);

  // ------ BASE USESTATE TABLE -------
  const [dataSource, setDataSource] = useState<IStudent[]>([]);
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
      let res = await studentApi.getAll(todoApi);
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

  // -------------- GET DATA CENTER ----------------
  const getDataCenter = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    try {
      let res = await branchApi.getAll({
        pageSize: Number.MAX_SAFE_INTEGER,
        pageIndex: 1,
      });

      res.status == 200 &&
        (setDataCenter(res.data.data),
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
    getDataCenter();
  }, []);

  // EXPAND ROW
  console.log("Data row This: ", dataRow);
  const expandedRowRender = () => {
    return (
      <>
        {/* <Card title="Thông tin cá nhân">
          <InfoCusCard />
        </Card> */}
        <StudentForm dataRow={dataRow} />
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
      title: "Họ và tên",
      dataIndex: "FullNameUnicode",
      // ...FilterColumn("nameStudent"),
      render: (nameStudent) => (
        <p className="font-weight-blue">{nameStudent}</p>
      ),
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
      // filters: [
      //   {
      //     text: "Active",
      //     value: "Active",
      //   },
      //   {
      //     text: "Inactive",
      //     value: "Inactive",
      //   },
      // ],
      // onFilter: (value, record) => record.status.indexOf(value) === 0,
    },

    // {
    //   title: "Đã đăng kí",
    //   dataIndex: "signUp",
    //   align: "center",
    //   render: (status) => {
    //     return (
    //       <>
    //         {status == "Đã xong" ? (
    //           <span className="tag blue">{status}</span>
    //         ) : (
    //           <span className="tag black">{status}</span>
    //         )}
    //       </>
    //     );
    //   },
    //   filters: [
    //     {
    //       text: "Đã xong",
    //       value: "Đã xong",
    //     },
    //     {
    //       text: "Chưa đăng kí",
    //       value: "Chưa đăng kí",
    //     },
    //   ],
    //   onFilter: (value, record) => record.signUp.indexOf(value) === 0,
    // },
    {
      title: "",
      render: () => (
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
      ),
    },
  ];

  return (
    <ExpandTable
      handleExpand={(data) => setDataRow(data)}
      currentPage={currentPage}
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      loading={isLoading}
      addClass="basic-header"
      TitlePage="DANH SÁCH HỌC VIÊN"
      // TitleCard={<StudentForm dataCenter={dataCenter} />}
      expandable={{ expandedRowRender }}
      dataSource={dataSource}
      columns={columns}
      Extra={
        <div className="extra-table">
          <FilterTable />
          <SortBox dataOption={data} />
        </div>
      }
    />
  );
};
StudentData.layout = LayoutBase;

export default StudentData;
