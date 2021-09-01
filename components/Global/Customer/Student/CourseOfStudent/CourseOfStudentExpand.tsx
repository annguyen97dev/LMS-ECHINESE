//@ts-nocheck
import { Descriptions, Table, Tooltip } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { Fragment, useEffect, useState } from "react";
import { courseStudentPriceApi } from "~/apiBase/customer/student/course-student-price";
import NestedTable from "~/components/Elements/NestedTable";
import { useWrap } from "~/context/wrap";

const CourseOfStudentExpand = (props) => {
  const { infoID } = props;
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const [detail, setDetail] = useState<ICourseOfStudentPrice>([]);
  const { showNoti } = useWrap();
  const [totalPage, setTotalPage] = useState(1);

  const fetchDetailInfo = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    try {
      let res = await courseStudentPriceApi.getDetail(infoID);
      if (res.status == 200) {
        let arr = [];
        arr.push(res.data.data);
        setDetail(arr);
      }
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
      title: "Giá tiền",
      dataIndex: "Price",
      render: (text) => <p>{Intl.NumberFormat("en-US").format(text)}</p>,
    },
    {
      title: "Giảm giá",
      dataIndex: "Reduced",
      render: (text) => <p>{Intl.NumberFormat("en-US").format(text)}</p>,
    },
    {
      title: "Đã đóng",
      dataIndex: "Paid",
      render: (text) => <p>{Intl.NumberFormat("en-US").format(text)}</p>,
    },
    {
      title: "Còn lại",
      dataIndex: "MoneyInDebt",
      render: (text) => <p>{Intl.NumberFormat("en-US").format(text)}</p>,
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

export default CourseOfStudentExpand;
