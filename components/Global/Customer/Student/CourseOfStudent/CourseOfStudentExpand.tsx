import { Table, Tooltip } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { Fragment, useEffect, useState } from "react";
import { AlertTriangle, X } from "react-feather";
import { jobApi } from "~/apiBase";
import { courseStudentPriceApi } from "~/apiBase/customer/student/course-student-price";
import PowerTable from "~/components/PowerTable";
import { useWrap } from "~/context/wrap";

const CourseOfStudentExpand = React.memo((props: any) => {
  const { infoID } = props;
  const [detailInfo, setDetailInfo] = useState();
  const { showNoti } = useWrap();

  const fetchDetailInfo = async () => {
    try {
      let res = await courseStudentPriceApi.getDetail(infoID);
      console.log("res", res.data.data);
      //@ts-ignore
      setDetailInfo(res.data.data);
      console.log(detailInfo);
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

  return (
    <Fragment>
      <PowerTable columns={columns} dataSource={detailInfo} />
    </Fragment>
  );
});

export default CourseOfStudentExpand;
