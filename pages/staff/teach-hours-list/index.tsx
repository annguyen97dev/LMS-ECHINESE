import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { courseApi, subjectApi, teacherApi } from "~/apiBase";
import { examServiceApi } from "~/apiBase/options/examServices";
import { teacherCourseScheduleApi } from "~/apiBase/teacher/teacher-course-schedule";
import FilterBase from "~/components/Elements/FilterBase/FilterBase";
import SortBox from "~/components/Elements/SortBox";
import ExamServicesDelete from "~/components/Global/Option/ExamServices/ExamServicesDelete";
import ExamServicesForm from "~/components/Global/Option/ExamServices/ExamServicesForm";
import FilterRegisterCourseTable from "~/components/Global/Option/FilterTable/FilterRegisterCourseTable";
import LayoutBase from "~/components/LayoutBase";
import PowerTable from "~/components/PowerTable";
import FilterColumn from "~/components/Tables/FilterColumn";
import { useWrap } from "~/context/wrap";

const TeacherCourseSchedule = () => {
  const handleReset = () => {
    setCurrentPage(1);
    setParams(listParamsDefault);
  };
  const columns = [
    {
      title: "Giáo viên",
      dataIndex: "TeacherName",
      render: (text) => <p className="font-weight-blue">{text}</p>,
    },
    {
      title: "Khóa học",
      dataIndex: "CourseName",
    },
    {
      title: "Môn học",
      dataIndex: "SubjectName",
    },
    {
      title: "Ca học",
      dataIndex: "StudyTimeName",
    },
    {
      title: "Ngày",
      dataIndex: "Date",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Thời gian dạy",
      dataIndex: "Time",
      render: (text) => <p>{text} phút</p>,
    },
    {
      title: "Điểm danh",
      dataIndex: "Attendance",
      render: (type) => (
        <Fragment>
          {type == true && <span className="tag green">Có</span>}
          {type == false && <span className="tag red">Vắng</span>}
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
    CourseID: null,
    SubjectID: null,
    TeacherID: null,
    filter: null,
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

  const handleSort = async (option) => {
    setParams({
      ...listParamsDefault,
      sortType: option.title.sortType,
    });
  };

  const [params, setParams] = useState(listParamsDefault);
  const { showNoti } = useWrap();
  const [totalPage, setTotalPage] = useState(null);
  const [teacherCourseSchedule, setTeacherCourseSchedule] = useState<
    ITeacherCourseSchedule[]
  >([]);
  const [isLoading, setIsLoading] = useState({
    type: "GET_ALL",
    status: false,
  });

  const getPagination = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setParams({
      ...params,
      pageIndex: currentPage,
    });
  };

  const getDataTeacherCourseSchedule = (page: any) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await teacherCourseScheduleApi.getAll({
          ...params,
          pageIndex: page,
        });
        res.status == 200 && setTeacherCourseSchedule(res.data.data);
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
    getDataTeacherCourseSchedule(currentPage);
  }, [params]);

  const [dataFilter, setDataFilter] = useState([
    {
      name: "CourseID",
      title: "Khóa học",
      col: "col-12",
      type: "select",
      optionList: null,
      value: null,
    },
    {
      name: "SubjectID",
      title: "Môn học",
      col: "col-12",
      type: "select",
      optionList: null,
      value: null,
    },
    {
      name: "TeacherID",
      title: "Giáo viên",
      col: "col-12",
      type: "select",
      optionList: null,
      value: null,
    },
    {
      name: "filter",
      title: "Chế độ xem",
      col: "col-12",
      type: "select",
      optionList: [
        {
          value: 1,
          title: "Ngày",
        },
        {
          value: 2,
          title: "Tuần",
        },
        {
          value: 3,
          title: "Tháng",
        },
        {
          value: 4,
          title: "Quý",
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

  const handleFilter = (listFilter) => {
    console.log("List Filter when submit: ", listFilter);

    let newListFilter = {
      pageIndex: 1,
      fromDate: null,
      toDate: null,
      CourseID: null,
      SubjectID: null,
      TeacherID: null,
      filter: null,
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
      res.status == 204 && showNoti("danger", "Không có dữ liệu khóa học!");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
    }
  };

  const getDataSubject = async () => {
    try {
      let res = await subjectApi.getAll({ pageSize: 99999, pageIndex: 1 });
      if (res.status == 200) {
        const newData = res.data.data.map((item) => ({
          title: item.SubjectName,
          value: item.ID,
        }));
        setDataFunc("SubjectID", newData);
      }
      res.status == 204 && showNoti("danger", "Không có dữ liệu môn học!");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
    }
  };

  const getDataTeacher = async () => {
    try {
      let res = await teacherApi.getAll({ pageSize: 99999, pageIndex: 1 });
      if (res.status == 200) {
        const newData = res.data.data.map((item) => ({
          title: item.FullNameUnicode,
          value: item.UserInformationID,
        }));
        setDataFunc("TeacherID", newData);
      }
      res.status == 204 && showNoti("danger", "Không có dữ liệu giáo viên!");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
    }
  };

  useEffect(() => {
    getDataCourse();
    getDataSubject();
    getDataTeacher();
  }, []);

  return (
    <PowerTable
      currentPage={currentPage}
      loading={isLoading}
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      addClass="basic-header"
      TitlePage="Giờ dạy giáo viên"
      dataSource={teacherCourseSchedule}
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
TeacherCourseSchedule.layout = LayoutBase;
export default TeacherCourseSchedule;
