import moment from "moment";
import React, { useEffect, useState } from "react";
import { notificationCourseApi } from "~/apiBase/course-detail/notification-course";
import LayoutBase from "~/components/LayoutBase";
import PowerTable from "~/components/PowerTable";
import { useWrap } from "~/context/wrap";
import NotificationCreate from "./NotificationCreate";

const NotificationCourse = (props: any) => {
  const columns = [
    {
      title: "Thông báo",
      dataIndex: "NotificationTitle",
      render: (text) => <p className="font-weight-blue">{text}</p>,
    },
    {
      title: "Nội dung",
      dataIndex: "NotificationContent",
    },
    {
      title: "Người tạo",
      dataIndex: "CreatedBy",
    },
    {
      title: "Ngày tạo",
      dataIndex: "CreatedOn",
      render: (CreatedOn) => moment(CreatedOn).format("DD/MM/YYYY"),
    },
  ];

  const { showNoti } = useWrap();
  const [notificationCourse, setNotificationCourse] =
    useState<INotificationCourse>();

  const [isLoading, setIsLoading] = useState({
    type: "GET_ALL",
    status: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(null);

  const listParamsDefault = {
    pageSize: 10,
    pageIndex: currentPage,
    CourseID: props.courseID,
  };

  const [params, setParams] = useState(listParamsDefault);

  const getPagination = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setParams({
      ...params,
      pageIndex: currentPage,
    });
  };

  const getDataNotificationCourse = (page: any) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await notificationCourseApi.getAll({
          ...params,
          pageIndex: page,
        });
        //@ts-ignore
        res.status == 200 && setNotificationCourse(res.data.data);
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
    getDataNotificationCourse(currentPage);
  }, [params]);

  return (
    <PowerTable
      currentPage={currentPage}
      loading={isLoading}
      totalPage={totalPage && totalPage}
      getPagination={(pageNumber: number) => getPagination(pageNumber)}
      addClass="basic-header"
      TitlePage="Thông báo khóa học"
      TitleCard={
        <NotificationCreate
          reloadData={(firstPage) => {
            setCurrentPage(1);
            getDataNotificationCourse(firstPage);
          }}
        />
      }
      dataSource={notificationCourse}
      columns={columns}
      Extra="Thông báo khóa học"
    />
  );
};
NotificationCourse.layout = LayoutBase;
export default NotificationCourse;
