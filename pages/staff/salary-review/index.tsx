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
import { Input, Spin, Form } from "antd";
import { useForm } from "react-hook-form";
import { month, year } from "~/lib/month-year";

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
      render: (type) => (
        <Fragment>
          {type == "Lương theo tháng" && (
            <span className="tag blue">{type}</span>
          )}
          {type == "Lương theo giờ" && (
            <span className="tag green">{type}</span>
          )}
        </Fragment>
      ),
    },
    {
      title: "Lương tháng",
      render: (text) => (
        <p className="font-weight-blue">
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
        sort: 0,
        sortType: true,
      },
      value: 1,
      text: "Tên tăng dần",
    },
    {
      dataSort: {
        sort: 0,
        sortType: false,
      },
      value: 2,
      text: "Tên giảm dần",
    },
    {
      dataSort: {
        sort: 1,
        sortType: true,
      },
      value: 3,
      text: "Số giờ dạy tăng dần",
    },
    {
      dataSort: {
        sort: 1,
        sortType: false,
      },
      value: 4,
      text: "Số giờ dạy giảm dần",
    },
    {
      dataSort: {
        sort: 2,
        sortType: true,
      },
      value: 5,
      text: "Tổng lương tăng dần",
    },
    {
      dataSort: {
        sort: 2,
        sortType: false,
      },
      value: 6,
      text: "Tổng lương giảm dần",
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
      name: "Month",
      title: "Tháng",
      col: "col-md-6 col-12",
      type: "select",
      optionList: month,
      value: null,
    },
    {
      name: "Year",
      title: "Năm",
      col: "col-md-6 col-12",
      type: "select",
      optionList: year,
      value: null,
    },
    {
      name: "Style",
      title: "Loại lương",
      col: "col-12",
      type: "select",
      optionList: [
        {
          value: 1,
          title: "Lương theo tháng",
        },
        {
          value: 2,
          title: "Lương theo giờ",
        },
      ],
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
      RoleID: null,
      Style: null,
      Month: null,
      Year: null,
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

  const [loadingSalaryDate, setLoadingSalaryDate] = useState(false);
  const [salaryDate, setSalaryDate] = useState();

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

  const getDataSalaryDate = () => {
    setLoadingSalaryDate(true);
    (async () => {
      try {
        let res = await payRollApi.closingSalarDate();
        //@ts-ignore
        res.status == 200 && setSalaryDate(res.data.data.Date);
        if (res.status == 204) {
          showNoti("danger", "Không tìm thấy dữ liệu ngày tính lương!");
        }
      } catch (error) {
        showNoti("danger", error.message);
      } finally {
        setLoadingSalaryDate(false);
      }
    })();
  };

  useEffect(() => {
    getDataSalaryDate();
  }, []);

  const handleChangeSalaryDate = (value: any) => {
    setLoadingSalaryDate(true);
    let date = { Date: value };
    (async () => {
      try {
        //@ts-ignore
        let res = await payRollApi.changClosingSalarDate(date);
        showNoti("success", "Cập nhật ngày tính lương thành công!!");
        setLoadingSalaryDate(false);
        getDataSalaryDate();
      } catch (error) {
        showNoti("danger", error.message);
      } finally {
        setLoadingSalaryDate(false);
      }
    })();
  };

  useEffect(() => {
    getDataPayRoll(currentPage);
  }, [params]);

  console.log(salaryDate);

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
      TitleCard={
        <div className="d-flex align-items-center justify-content-end ">
          <div className="font-weight-black">Ngày tính lương: </div>
          <Spin spinning={loadingSalaryDate}>
            <div className="d-flex justify-content-start pl-2">
              <Input
                className="style-input w-50"
                allowClear={true}
                onChange={(value: any) => setSalaryDate(value.target.value)}
                value={salaryDate}
                onPressEnter={(value: any) =>
                  handleChangeSalaryDate(value.target.value)
                }
              />
            </div>
          </Spin>
        </div>
      }
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
