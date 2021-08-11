//@ts-nocheck
import { Descriptions, Table, Tooltip } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { Fragment, useEffect, useState } from "react";
import { courseStudentPriceApi } from "~/apiBase/customer/student/course-student-price";
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

  console.log(detail);

  return (
    <div className="container-fluid">
      <Descriptions
        layout="vertical"
        bordered
        column={4}
        size="small"
        labelStyle={{ fontWeight: 500, color: "rgb(99, 99, 99)" }}
      >
        <Descriptions.Item label="Giá tiền">
          {Intl.NumberFormat("ja-JP").format(detail.Price)}
        </Descriptions.Item>
        <Descriptions.Item label="Giảm giá">
          {Intl.NumberFormat("ja-JP").format(detail.Reduced)}
        </Descriptions.Item>
        <Descriptions.Item label="Đã đóng">
          {Intl.NumberFormat("ja-JP").format(detail.Paid)}
        </Descriptions.Item>
        <Descriptions.Item label="Còn lại">
          {Intl.NumberFormat("ja-JP").format(detail.MoneyInDebt)}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default CourseOfStudentExpand;
