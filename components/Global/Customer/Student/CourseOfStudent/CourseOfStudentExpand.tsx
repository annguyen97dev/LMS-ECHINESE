import { Table, Tooltip } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { Fragment, useEffect, useState } from "react";
import { AlertTriangle, X } from "react-feather";
import { jobApi } from "~/apiBase";
import { courseStudentPriceApi } from "~/apiBase/customer/student/course-student-price";
import PowerTable from "~/components/PowerTable";
import { useWrap } from "~/context/wrap";

const CourseOfStudentExpand = (props) => {
  const { infoID } = props;

  const [detail, setDetail] = useState([]);
  const { showNoti } = useWrap();

  const fetchDetailInfo = async () => {
    try {
      let res = await courseStudentPriceApi.getDetail(infoID);
      console.log("res", res.data.data);
      //@ts-ignore
      res.status == 200 && setDetail(res.data.data);
    } catch (err) {
      showNoti("danger", err.message);
    }
  };

  useEffect(() => {
    fetchDetailInfo();
  }, []);

  const columns = [
    {
      title: "Trung tâm thanh toán",
      dataIndex: "PayBranchName",
    },
    {
      title: "Giá tiền",
      dataIndex: "Price",
    },
    {
      title: "Đã giảm",
      dataIndex: "Reduced",
    },
    {
      title: "Đã thanh toán",
      dataIndex: "Paid",
    },
    {
      title: "Còn lại",
      dataIndex: "MoneyInDebt",
    },
  ];

  console.log(detail);

  return (
    <Fragment>
      <PowerTable columns={columns} dataSource={detail} />
    </Fragment>
  );
};

export default CourseOfStudentExpand;
