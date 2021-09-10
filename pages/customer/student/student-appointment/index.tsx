import { Tooltip } from "antd";
import moment from "moment";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import { branchApi, programApi } from "~/apiBase";
import FilterBase from "~/components/Elements/FilterBase/FilterBase";
import SortBox from "~/components/Elements/SortBox";
import ExpandTable from "~/components/ExpandTable";

import LayoutBase from "~/components/LayoutBase";
import FilterColumn from "~/components/Tables/FilterColumn";
import { useWrap } from "~/context/wrap";
import { courseRegistrationApi } from "~/apiBase/customer/student/course-registration";
import CourseRegExpand from "~/components/Global/Customer/Student/CourseRegistration/CourseRegExpand";
import CourseRegForm from "~/components/Global/Customer/Student/CourseRegistration/CourseRegForm";
import { Checkbox } from "antd";

const CourseRegistration = () => {
  const [listStudent, setListStudent] = useState([]);
  const [listChecked, setListChecked] = useState([]);

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

  function onChange(e, ID) {
    const checked = e.target.checked;
    // setIsChecked(true);

    let indexStudent = listChecked.findIndex((item) => item.id == ID);
    listChecked[indexStudent].checked = checked;

    if (checked) {
      listStudent.push(ID);
    } else {
      let index = listStudent.indexOf(ID);
      listStudent.splice(index, 1);
    }
    setListStudent([...listStudent]);
    setListChecked([...listChecked]);
  }

  const columns = [
    {
      title: "Học viên",
      dataIndex: "FullNameUnicode",
      ...FilterColumn("FullNameUnicode", onSearch, handleReset, "text"),
      render: (text) => <p className="font-weight-blue">{text}</p>,
    },
    {
      title: "Trung tâm",
      dataIndex: "BranchName",
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Chương trình học",
      dataIndex: "ProgramName",
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Ca học",
      dataIndex: "StudyTimeName",
    },
    {
      // render: (data) => (
      //   <Fragment>
      //     <CourseRegForm
      //       infoDetail={data}
      //       infoId={data.ID}
      //       reloadData={(firstPage) => {
      //         getDataCourseReg(firstPage);
      //       }}
      //       currentPage={currentPage}
      //     />
      //   </Fragment>
      // ),
      render: (text, data, index) => (
        <Checkbox
          checked={
            data.ID == listChecked[index]?.id && listChecked[index].checked
          }
          onChange={(value) => onChange(value, data.ID)}
        ></Checkbox>
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
    BranchID: null,
    ProgramID: null,
    StudyTimeID: null,
    FullNameUnicode: null,
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
      name: "BranchID",
      title: "Trung tâm",
      col: "col-12",
      type: "select",
      optionList: null,
      value: null,
    },
    {
      name: "ProgramID",
      title: "Chương trình học",
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
    let newListFilter = {
      pageIndex: 1,
      fromDate: null,
      toDate: null,
      BranchID: null,
      ProgramID: null,
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
  const [courseReg, setCourseReg] = useState<ICourseRegistration[]>([]);
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
        setDataFunc("BranchID", newData);
      }

      res.status == 204 && showNoti("danger", "Trung tâm Không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
    }
  };

  const getDataProgram = async () => {
    try {
      let res = await programApi.getAll({ pageSize: 99999, pageIndex: 1 });
      if (res.status == 200) {
        const newData = res.data.data.map((item) => ({
          title: item.ProgramName,
          value: item.ID,
        }));
        setDataFunc("ProgramID", newData);
      }

      res.status == 204 && showNoti("danger", "Trung tâm Không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
    }
  };

  useEffect(() => {
    getDataCenter();
    getDataProgram();
  }, []);

  const getPagination = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setParams({
      ...params,
      pageIndex: currentPage,
    });
  };

  const getDataCourseReg = (page: any) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await courseRegistrationApi.getAll({
          ...params,
          pageIndex: page,
        });
        //@ts-ignore
        if (res.status == 200) {
          setCourseReg(res.data.data);
          res.data.data.forEach((item) => {
            listChecked.push({
              id: item.ID,
              checked: false,
            });
            setListChecked([...listChecked]);
          });
        }

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
    getDataCourseReg(currentPage);
  }, [params]);

  const [itemDetail, setItemDetail] = useState();

  const expandedRowRender = (data, index) => {
    return (
      <Fragment>
        <CourseRegExpand
          infoID={data.UserInformationID}
          // infoIndex={index}
        />
      </Fragment>
    );
  };

  return (
    <ExpandTable
      currentPage={currentPage}
      loading={isLoading}
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      addClass="basic-header"
      TitlePage="DANH SÁCH HỌC VIÊN hẹn đăng kí"
      dataSource={courseReg}
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
      TitleCard={
        <CourseRegForm
          // infoDetail={data}
          // infoId={data.ID}
          listStudent={listStudent}
          reloadData={(firstPage) => {
            getDataCourseReg(firstPage);
          }}
          currentPage={currentPage}
        />
      }
      handleExpand={(data) => setItemDetail(data)}
      expandable={{ expandedRowRender }}
    />
  );
};
CourseRegistration.layout = LayoutBase;
export default CourseRegistration;
