import { Tooltip } from "antd";
import Link from "next/link";
import React from "react";
import { Eye } from "react-feather";
import PowerTable from "~/components/PowerTable";
import { dataStudent } from "~/lib/customer/dataStudent";

const StudentsList = () => {
  const columns = [
    { title: "Student", dataIndex: "name" },
    { title: "Phone", dataIndex: "phone" },
    { title: "Email", dataIndex: "Email" },
    { title: "Supporter", dataIndex: "supporter" },
    { title: "Day off", dataIndex: "dayOff" },
    { title: "Warning", dataIndex: "Warning" },
    { title: "Paid", dataIndex: "Paid" },
    { title: "Debt", dataIndex: "Debt" },
    {
      title: "",
      render: () => (
        <Link
          href={{
            pathname: "/customer/student/student-list/student-detail/[slug]",
            query: { slug: 2 },
          }}
        >
          <Tooltip title="Xem chi tiết">
            <button className="btn btn-icon">
              <Eye />
            </button>
          </Tooltip>
        </Link>
      ),
    },
  ];

  return (
    <>
      <PowerTable
        noScroll
        dataSource={dataStudent}
        columns={columns}
        Extra={<h5>Học viên</h5>}
      />
    </>
  );
};
export default StudentsList;
