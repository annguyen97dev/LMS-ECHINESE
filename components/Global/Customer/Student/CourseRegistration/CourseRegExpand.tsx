//@ts-nocheck
import { Descriptions, Table, Tooltip } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { Fragment, useEffect, useState } from "react";
import { courseStudentPriceApi } from "~/apiBase/customer/student/course-student-price";
import { useWrap } from "~/context/wrap";

const CourseRegExpand = (props) => {
  const { infoID } = props;

  const [detail, setDetail] = useState([]);
  const { showNoti } = useWrap();

  const fetchDetailInfo = async () => {
    try {
      let res = await courseStudentPriceApi.getAll({
        UserInformationID: infoID,
      });
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

  return (
    <div className="feedback-detail-text">
      <table className="tb-expand">
        <tr>
          <th>Ngày hẹn</th>
          <th>Đặt cọc</th>
        </tr>
        <tr>
          <td>{detail.PayDate}</td>
          <td>{detail.Paid}</td>
        </tr>
      </table>
    </div>
  );
};

export default CourseRegExpand;
