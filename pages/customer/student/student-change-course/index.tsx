import React, { useState, useEffect } from "react";
import ExpandTable from "~/components/ExpandTable";
import { Eye } from "react-feather";
import { Tooltip } from "antd";
import Link from "next/link";
import { data3 } from "~/lib/customer-student/data";
import ExpandBox from "~/components/Elements/ExpandBox";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
import { useWrap } from "~/context/wrap";
import { studentChangeCourseApi } from "~/apiBase";
let pageIndex = 1;

let listFieldSearch = {
  pageIndex: 1,
  FullNameUnicode: null,
};

let listFieldFilter = {
  pageIndex: 1,
  CourseIDBefore: null,
  CourseIDAfter: null,
};

const listTodoApi = {
  pageSize: 10,
  pageIndex: pageIndex,
  sort: null,
  sortType: null,
  CourseIDBefore: null,
  CourseIDAfter: null,
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

export default function StudentCourseChange() {
  // ------ BASE USESTATE TABLE -------
  const [dataSource, setDataSource] = useState<IStudentChangeCourse[]>([]);
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
      let res = await studentChangeCourseApi.getAll(todoApi);
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

  const expandedRowRender = (data) => {
    return <>{data?.Note}</>;
  };

  const columns = [
    {
      title: "Học viên",
      dataIndex: "FullNameUnicode",
      ...FilterColumn("nameStudent"),
      render: (nameStudent) => (
        <p className="font-weight-blue">{nameStudent}</p>
      ),
    },
    {
      title: "Khóa học",
      dataIndex: "course",
      ...FilterColumn("course"),
      render: (course) => <p className="font-weight-black">{course}</p>,
    },
    { title: "Giá tiền", dataIndex: "money", ...FilterColumn("money") },
    { title: "Đã đóng", dataIndex: "payed", ...FilterColumn("payed") },
    { title: "Giảm giá", dataIndex: "discount", ...FilterColumn("discount") },
    { title: "Còn lại", dataIndex: "left", ...FilterColumn("left") },

    {
      title: "",
      render: () => (
        <Link
          href={{
            pathname:
              "/customer/student/student-change-course/student-detail/[slug]",
            query: { slug: 2 },
          }}
        >
          <Tooltip title="Xem chi tiết">
            <button className="btn btn-icon view">
              <Eye />
            </button>
          </Tooltip>
        </Link>
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
      TitlePage="Học viên chuyển khóa"
      dataSource={dataSource}
      columns={columns}
      Extra={
        <div className="extra-table">
          {/* <FilterBase
            dataFilter={dataFilter}
            handleFilter={(listFilter: any) => handleFilter(listFilter)}
            handleReset={handleReset}
          /> */}
          <SortBox
            handleSort={(value) => handleSort(value)}
            dataOption={dataOption}
          />
        </div>
      }
      expandable={{ expandedRowRender }}
    />
  );
}
StudentCourseChange.layout = LayoutBase;
