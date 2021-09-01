import { Select } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { courseDetailApi } from "~/apiBase";
import { notificationCourseApi } from "~/apiBase/course-detail/notification-course";
import { rollUpApi } from "~/apiBase/course-detail/roll-up";
import FilterBase from "~/components/Elements/FilterBase/FilterBase";
import LayoutBase from "~/components/LayoutBase";
import PowerTable from "~/components/PowerTable";
import { useWrap } from "~/context/wrap";

const RollUp = (props: any) => {
  const columns = [
    {
      title: "Học viên",
      dataIndex: "StudentName",
      render: (text) => <p className="font-weight-blue">{text}</p>,
    },
    {
      title: "Điểm danh",
      dataIndex: "StatusID",
      render: (status) => (
        <>
          {
            <span className={`tag ${status == 1 ? "green" : "red"}`}>
              {status == 1 ? "Có" : "Vắng"}
            </span>
          }
        </>
      ),
    },
    {
      title: "Học lực",
      dataIndex: "LearningStatusID",
      render: (status) => (
        <>
          {
            <span className={`tag ${status == 1 ? "blue" : "yellow"}`}>
              {status == 1 ? "Giỏi" : "Khá"}
            </span>
          }
        </>
      ),
    },

    {
      title: "Cảnh cáo",
      dataIndex: "Warning",
      render: (warning) => (
        <>
          <Checkbox checked={warning} disabled={true}>
            Cảnh cáo
          </Checkbox>
        </>
      ),
    },
  ];

  const { showNoti } = useWrap();
  const [rollUp, setRollUp] = useState<IRollUp>();

  const [isLoading, setIsLoading] = useState({
    type: "GET_ALL",
    status: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);
  const { Option } = Select;

  const listParamsDefault = {
    pageSize: 10,
    pageIndex: currentPage,
    CourseID: props.courseID,
    CourseScheduleID: 1,
    StudentID: 0,
  };

  const [params, setParams] = useState(listParamsDefault);

  const getPagination = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setParams({
      ...params,
      pageIndex: currentPage,
    });
  };

  const getDataRollUp = (page: any) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await rollUpApi.getAll({
          ...params,
          pageIndex: page,
        });
        //@ts-ignore
        res.status == 200 && setRollUp(res.data.RollUp);
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

  const [courseSchedule, setCourseSchedule] = useState<ICourseDetailSchedule[]>(
    []
  );

  const getDataCourseSchedule = async () => {
    try {
      const res = await courseDetailApi.getAll({
        CourseScheduleID: props.courseID,
      });
      res.status == 200 && setCourseSchedule(res.data.data);
      res.status == 204 && showNoti("danger", "Tỉnh/TP Không có dữ liệu");
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
    }
  };

  const handleSelectCourseSchedule = (CourseScheduleID: any) => {
    console.log(CourseScheduleID);
    setParams({
      ...params,
      CourseScheduleID: CourseScheduleID,
    });
  };

  useEffect(() => {
    getDataCourseSchedule();
  }, []);

  useEffect(() => {
    getDataRollUp(currentPage);
  }, [params]);

  return (
    <PowerTable
      currentPage={currentPage}
      loading={isLoading}
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      addClass="basic-header"
      TitlePage="Điểm danh khóa học"
      dataSource={rollUp}
      columns={columns}
      Extra="Điểm danh khóa học"
      // Extra={
      //   <div className="align-items-center">
      //     <h6>Điểm danh khóa học</h6>
      //   </div>
      // }
      // TitleCard={
      //   <div className="extra-table">
      //     <FilterBase
      //       dataFilter={dataFilter}
      //       handleFilter={(listFilter: any) => handleFilter(listFilter)}
      //       handleReset={handleReset}
      //     />
      //   </div>
      // }
      TitleCard={
        <div
          // style={{ marginTop: "3px" }}
          className="align-items-center"
        >
          <span className="font-weight-black">Chọn ca học: </span>
          <Select
            className="w-50 style-input"
            onChange={handleSelectCourseSchedule}
          >
            {courseSchedule?.map((item, index) => (
              <Option key={index} value={item.ID}>
                {item.CourseName}
              </Option>
            ))}
          </Select>
        </div>
      }
    />
  );
};
RollUp.layout = LayoutBase;
export default RollUp;
