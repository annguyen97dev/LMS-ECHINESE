//@ts-nocheck
import { Descriptions, Table, Tooltip } from "antd";
import Modal from "antd/lib/modal/Modal";
import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { courseStudentPriceApi } from "~/apiBase/customer/student/course-student-price";
import NestedTable from "~/components/Elements/NestedTable";
import { useWrap } from "~/context/wrap";

const CourseRegExpand = (props) => {
  const { infoID } = props;
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [detail, setDetail] = useState<ICourseOfStudentPrice>([]);
  const { showNoti } = useWrap();

  const fetchDetailInfo = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    try {
      let res = await courseStudentPriceApi.getAll({
        UserInformationID: infoID,
      });
      // if (res.status == 200) {
      //   let arr = [];
      //   arr.push(res.data.data);
      //   setDetail(arr);
      // }
      res.status == 200 && setDetail(res.data.data);
    } catch (err) {
      showNoti("danger", err.message);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  useEffect(() => {
    fetchDetailInfo();
  }, []);

  const columns = [
    {
      title: "Đặt cọc",
      dataIndex: "Paid",
      render: (text) => <p>{Intl.NumberFormat("en-US").format(text)}</p>,
    },
    {
      title: "Ngày hẹn",
      dataIndex: "PayDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ghi chú",
      dataIndex: "Note",
    },
  ];

  return (
    <div className="container-fluid">
      <NestedTable
        loading={isLoading}
        addClass="basic-header"
        dataSource={detail}
        columns={columns}
      />
    </div>
  );
};

export default CourseRegExpand;
