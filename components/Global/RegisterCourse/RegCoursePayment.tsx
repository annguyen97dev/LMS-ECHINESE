import Link from "next/link";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { courseStudentPriceApi } from "~/apiBase/customer/student/course-student-price";
import PowerTable from "~/components/PowerTable";
import { useWrap } from "~/context/wrap";
import CourseOfStudentPriceForm from "../Customer/Finance/CourseStudentPriceForm";

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
      render: (Course: ICourse[]) => (
        <>
          {Course.map((item) => (
            <Link
              key={item.ID}
              href={{
                pathname: "/course/course-list/course-list-detail/[slug]",
                query: { slug: item.ID },
              }}
            >
              <a
                title={item.CourseName}
                className="finance-course-name font-weight-black d-block"
              >
                {item.CourseName}
              </a>
            </Link>
          ))}
        </>
      ),
    },
    {
      title: "Trung tâm",
      dataIndex: "PayBranchName",
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Tổng thanh toán",
      dataIndex: "Price",
      render: (price) => (
        <p className="font-weight-blue">
          {Intl.NumberFormat("en-US").format(price)}
        </p>
      ),
    },
    {
      title: "Giảm giá",
      dataIndex: "Reduced",
      render: (price) => (
        <p className="font-weight-blue">
          {Intl.NumberFormat("en-US").format(price)}
        </p>
      ),
    },
    {
      title: "Đã thanh toán",
      dataIndex: "Paid",
      render: (price) => (
        <p className="font-weight-blue">
          {Intl.NumberFormat("en-US").format(price)}
        </p>
      ),
    },
    {
      title: "Số tiền còn lại",
      dataIndex: "MoneyInDebt",
      render: (price) => (
        <p className="font-weight-blue">
          {Intl.NumberFormat("en-US").format(price)}
        </p>
      ),
    },
    {
      title: "Hình thức",
      dataIndex: "PaymentMethodsName",
    },
    {
      title: "Ngày hẹn trả",
      dataIndex: "PayDate",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : ""),
    },
    {
      render: (data, record: ICourseOfStudentPrice) => (
        <div onClick={(e) => e.stopPropagation()}>
          {!record.DonePaid && (
            <CourseOfStudentPriceForm
              infoDetail={data}
              infoId={data.ID}
              reloadData={() => {
                getDataJob();
              }}
            />
          )}
        </div>
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
