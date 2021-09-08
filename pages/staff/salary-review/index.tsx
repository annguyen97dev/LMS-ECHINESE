import React, { Fragment, useEffect, useState } from "react";
import FilterBase from "~/components/Elements/FilterBase/FilterBase";
import SortBox from "~/components/Elements/SortBox";
import ExpandTable from "~/components/ExpandTable";

import LayoutBase from "~/components/LayoutBase";
import FilterColumn from "~/components/Tables/FilterColumn";
import { useWrap } from "~/context/wrap";
import { Roles } from "~/lib/roles/listRoles";
import { payRollApi } from "~/apiBase/staff-manage/pay-roll";
import PowerTable from "~/components/PowerTable";

const SalaryReview = () => {
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
      title: "Nhân viên",
      dataIndex: "FullNameUnicode",
      ...FilterColumn("FullNameUnicode", onSearch, handleReset, "text"),
      render: (text) => <p className="font-weight-blue">{text}</p>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "Mobile",
    },
    {
      title: "Role",
      dataIndex: "RoleName",
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Loại lương",
      dataIndex: "styleName",
    },
    {
      title: "Lương tháng",
      render: (text) => (
        <p>
          {text.Month}-{text.Year}
        </p>
      ),
    },
    {
      title: "Số giờ dạy",
      dataIndex: "TeachingTime",
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Tổng lương",
      dataIndex: "TotalSalary",
      render: (text) => (
        <p className="font-weight-blue">
          {Intl.NumberFormat("en-US").format(text)}
        </p>
      ),
    },

    {
      render: (data) => (
        <Fragment>
          {/* <ChangeCourseForm
            infoDetail={data}
            infoId={data.ID}
            reloadData={(firstPage) => {
              getDataCourseStudent(firstPage);
            }}
            currentPage={currentPage}
          /> */}
        </Fragment>
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
    FullNameUnicode: null,
    RoleID: null,
    Month: null,
    Year: null,
    Style: null,
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
      name: "RoleID",
      title: "Chọn Role",
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
    // {
    //   name: "Combo",
    //   title: "Chọn gói",
    //   col: "col-12",
    //   type: "select",
    //   optionList: [
    //     {
    //       value: true,
    //       title: "Gói combo",
    //     },
    //     {
    //       value: false,
    //       title: "Gói lẻ",
    //     },
    //   ],
    //   value: null,
    // },
  ]);

  const handleFilter = (listFilter) => {
    console.log("List Filter when submit: ", listFilter);

    let newListFilter = {
      pageIndex: 1,
      fromDate: null,
      toDate: null,
      RoleID: null,
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
  const [payRoll, setPayRoll] = useState<IPayRoll[]>([]);
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

  const getDataRole = () => {
    const newData = Roles.map((item) => ({
      title: item.RoleName,
      value: item.id,
    }));
    setDataFunc("RoleID", newData);
  };

  useEffect(() => {
    getDataRole();
  }, []);

  const getPagination = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setParams({
      ...params,
      pageIndex: currentPage,
    });
  };

  const getDataPayRoll = (page: any) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await payRollApi.getAll({ ...params, pageIndex: page });
        //@ts-ignore
        res.status == 200 && setPayRoll(res.data.data);
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
    getDataPayRoll(currentPage);
  }, [params]);

  return (
    <PowerTable
      currentPage={currentPage}
      loading={isLoading}
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      addClass="basic-header"
      TitlePage="Duyệt lương office"
      dataSource={payRoll}
      columns={columns}
      // TitleCard={
      //   <JobForm
      //     reloadData={(firstPage) => {
      //       setCurrentPage(1);
      //       getDataJob(firstPage);
      //     }}
      //   />
      // }
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
SalaryReview.layout = LayoutBase;
export default SalaryReview;
