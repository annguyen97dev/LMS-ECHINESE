import { Card, Table } from "antd";
import React, { useEffect, useState } from "react";
import { courseStudentPriceApi } from "~/apiBase/customer/student/course-student-price";
import PowerTable from "~/components/PowerTable";
import { useWrap } from "~/context/wrap";

const RegCoursePayment = (props: any) => {
  const [isLoading, setIsLoading] = useState({
    type: "GET_ALL",
    status: false,
  });
  const { userID } = props;
  const [paymentInfo, setPaymentInfo] = useState([]);
  const { showNoti } = useWrap();

  const getDataJob = () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    (async () => {
      try {
        let res = await courseStudentPriceApi.getAll({
          UserInformationID: userID,
        });
        res.status == 200 && setPaymentInfo(res.data.data);
        if (res.status == 204) {
          showNoti("danger", "Không tìm thấy dữ liệu!");
          setPaymentInfo([]);
        }
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

  const columns = [
    {
      title: "Khóa học",
      dataIndex: "Course",
      render: (Course) => (
        <div style={{ width: "180px" }}>
          {Course.map((item) => (
            <a href="/" className="font-weight-blue d-block">
              {item.CourseName}
            </a>
          ))}
        </div>
      ),
    },
    {
      title: "Còn lại",
      dataIndex: "MoneyInDebt",
      render: (text) => (
        <p className="font-weight-black">
          {Intl.NumberFormat("en-US").format(text)}
        </p>
      ),
    },
  ];

  useEffect(() => {
    getDataJob();
  }, [userID]);

  return (
    <PowerTable
      Extra="Thông tin thanh toán"
      columns={columns}
      noScroll
      dataSource={paymentInfo}
    />
  );
};
export default RegCoursePayment;
