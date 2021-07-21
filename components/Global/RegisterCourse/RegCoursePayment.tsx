import { Card, Table } from "antd";
import React from "react";
import PowerTable from "~/components/PowerTable";

const RegCoursePayment = () => {
  const columns = [
    { title: "Khóa lớp" },
    { title: "Còn lại" },
    { title: "Thao tác" },
  ];
  return (
    <Card title="Thông tin dăng ký">
      <PowerTable columns={columns} noScroll />;
    </Card>
  );
};
export default RegCoursePayment;
