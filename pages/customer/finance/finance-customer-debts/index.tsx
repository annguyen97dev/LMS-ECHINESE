import { Tooltip } from "antd";
import moment from "moment";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { Info } from "react-feather";
import { branchApi, courseApi } from "~/apiBase";
import { courseStudentPriceApi } from "~/apiBase/customer/student/course-student-price";
import FilterBase from "~/components/Elements/FilterBase/FilterBase";
import SortBox from "~/components/Elements/SortBox";
import CourseOfStudentPriceForm from "~/components/Global/Customer/Finance/CourseStudentPriceForm";

import LayoutBase from "~/components/LayoutBase";
import PowerTable from "~/components/PowerTable";
import FilterColumn from "~/components/Tables/FilterColumn";
import { useWrap } from "~/context/wrap";

const CourseStudentPrice = () => {
  const onSearch = (data) => {
    setCurrentPage(1);
    setParams({
      ...listParamsDefault,
      FullNameUnicode: data,
    });
  };

  const handleReset = () => {
    setCurrentPage(1);
    setParams(listParamsDefault);
  };
  const columns = [
    {
      title: "Học viên",
      dataIndex: "FullNameUnicode",
      ...FilterColumn("FullNameUnicode", onSearch, handleReset, "text"),
      render: (text) => <p className="font-weight-blue">{text}</p>,
    },
    {
      title: "Khóa học",
      dataIndex: "Course",
      render: (Course) => (
        <>
          {Course.map((item) => (
            <a href="/" className="font-weight-black d-block">
              {item.CourseName}
            </a>
          ))}
        </>
      ),
    },
    {
      title: "Trung tâm",
      dataIndex: "PayBranchName",
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Số tiền còn lại",
      dataIndex: "MoneyInDebt",
      render: (text) => (
        <p className="font-weight-blue">
          {Intl.NumberFormat("en-US").format(text)}
        </p>
      ),
    },
    {
      title: "Ngày hẹn trả",
      dataIndex: "PayDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },

    {
      render: (data) => (
        <>
          <CourseOfStudentPriceForm
            infoDetail={data}
            infoId={data.ID}
            reloadData={(firstPage) => {
              getDataCourseStudentPrice(firstPage);
            }}
            currentPage={currentPage}
          />
        </>
      ),
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);

  const listParamsDefault = {
    pageSize: 10,
    pageIndex: currentPage,
    sort: null,
    sortType: null,
    fromDate: null,
    toDate: null,
    PayBranchID: null,
    CourseID: null,
    FullNameUnicode: null,
    DonePaid: null,
  };

  const sortOption = [
    {
      dataSort: {
        sortType: null,
      },
      value: 1,
      text: "Mới cập nhật",
    },
    {
      dataSort: {
        sortType: true,
      },
      value: 2,
      text: "Từ dưới lên",
    },
  ];

  const [dataFilter, setDataFilter] = useState([
    {
      name: "PayBranchID",
      title: "Trung tâm thanh toán",
      col: "col-12",
      type: "select",
      optionList: null,
      value: null,
    },
    {
      name: "CourseID",
      title: "Khóa học",
      col: "col-12",
      type: "select",
      optionList: null,
      value: null,
    },
    {
      name: "date-range",
      title: "Ngày tạo",
      col: "col-12",
      type: "date-range",
      value: null,
    },
  ]);

  const handleFilter = (listFilter) => {
    console.log("List Filter when submit: ", listFilter);

    let newListFilter = {
      pageIndex: 1,
      fromDate: null,
      toDate: null,
      BranchID: null,
      CourseID: null,
      DonePaid: null,
    };
    listFilter.forEach((item, index) => {
      let key = item.name;
      Object.keys(newListFilter).forEach((keyFilter) => {
        if (keyFilter == key) {
          newListFilter[key] = item.value;
        }
      });
    });
    setParams({ ...listParamsDefault, ...newListFilter, pageIndex: 1 });
  };

  const handleSort = async (option) => {
    setParams({
      ...listParamsDefault,
      sortType: option.title.sortType,
    });
  };

  const [params, setParams] = useState(listParamsDefault);
  const { showNoti } = useWrap();
  const [totalPage, setTotalPage] = useState(null);
  const [courseStudentPrice, setCourseStudentPrice] = useState<
    ICourseOfStudentPrice[]
  >([]);
  const [isLoading, setIsLoading] = useState({
    type: "GET_ALL",
    status: false,
  });

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

  const getDataCenter = async () => {
    try {
      let res = await branchApi.getAll({ pageSize: 99999, pageIndex: 1 });
      if (res.status == 200) {
        const newData = res.data.data.map((item) => ({
          title: item.BranchName,
          value: item.ID,
        }));
        setDataFunc("PayBranchID", newData);
      }

      res.status == 204 && showNoti("danger", "Trung tâm Không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
    }
  };

  const getDataCourse = async () => {
    try {
      let res = await courseApi.getAll({ pageSize: 99999, pageIndex: 1 });
      if (res.status == 200) {
        const newData = res.data.data.map((item) => ({
          title: item.CourseName,
          value: item.ID,
        }));
        setDataFunc("CourseID", newData);
      }

      res.status == 204 && showNoti("danger", "Trung tâm Không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
    }
  };

  useEffect(() => {
    getDataCenter();
    getDataCourse();
  }, []);

  const getPagination = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setParams({
      ...params,
      pageIndex: currentPage,
    });
  };

  const getDataCourseStudentPrice = (page: any) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await courseStudentPriceApi.getAll({
          ...params,
          pageIndex: page,
        });
        //@ts-ignore
        res.status == 200 && setCourseStudentPrice(res.data.data);
        if (res.status == 204) {
          showNoti("danger", "Không tìm thấy dữ liệu!");
          setCurrentPage(1);
          setParams(listParamsDefault);
        } else setTotalPage(res.data.totalRow);
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

  useEffect(() => {
    getDataCourseStudentPrice(currentPage);
  }, [params]);

  return (
    <PowerTable
      currentPage={currentPage}
      loading={isLoading}
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      addClass="basic-header"
      TitlePage="DANH SÁCH HỌC VIÊN nợ học phí"
      dataSource={courseStudentPrice}
      columns={columns}
      Extra={
        <div className="extra-table">
          <FilterBase
            dataFilter={dataFilter}
            handleFilter={(listFilter: any) => handleFilter(listFilter)}
            handleReset={handleReset}
          />

          <SortBox
            dataOption={sortOption}
            handleSort={(value) => handleSort(value)}
          />
        </div>
      }
    />
  );
};
CourseStudentPrice.layout = LayoutBase;
export default CourseStudentPrice;
