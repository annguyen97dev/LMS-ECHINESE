import { Divider } from "antd";
import React from "react";
import PowerTable from "~/components/PowerTable";
import { dataService } from "../../../../lib/customer/dataCustomer";

const InfoOtherCard = () => {
  const columns = [
    { title: "Ngày chuyển", dataIndex: "regDate" },
    { title: "Khóa trước", dataIndex: "provider" },
    { title: "Khóa chuyển đến", dataIndex: "pkgName" },
    { title: "Người chuyển", dataIndex: "apmConsultant" },
  ];

  const columns2 = [
    { title: "Lớp hẹn đăng ký", dataIndex: "pkgName" },
    { title: "Trung tâm", dataIndex: "center" },
    { title: "Ghi chú", dataIndex: "fnReason" },
    { title: "Ngày nhập", dataIndex: "testDate" },
    { title: "Trạng thái" },
  ];

  const columns3 = [
    { title: "Lớp hẹn bảo lưu", dataIndex: "pkgName" },
    { title: "Ca", dataIndex: "rpCourse" },
    { title: "Ghi chú", dataIndex: "fnReason" },
    { title: "Ngày bảo lưu", dataIndex: "testDate" },
    { title: "Hạn bảo lưu", dataIndex: "regDate" },
  ];

  return (
    <>
      <PowerTable
        noScroll
        dataSource={dataService}
        columns={columns}
        Extra={<h5>Chuyển khóa</h5>}
      />
      <Divider />

      <PowerTable
        noScroll
        dataSource={dataService}
        columns={columns2}
        Extra={<h5>Khóa hẹn đăng kí</h5>}
      />

      <Divider />

      <PowerTable
        noScroll
        dataSource={dataService}
        columns={columns3}
        Extra={<h5>Bảo lưu</h5>}
      />
    </>
  );
};
export default InfoOtherCard;
