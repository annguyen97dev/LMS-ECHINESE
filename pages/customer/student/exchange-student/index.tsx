import React from "react";
import ExpandTable from "~/components/ExpandTable";
import { Eye } from "react-feather";
import { Tooltip, Card } from "antd";
import { data } from "~/lib/customer-student/data";
import InfoCusCard from "~/components/Profile/ProfileCustomer/component/InfoCusCard";
import Link from "next/link";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
ExchangeStudent.layout = LayoutBase;
export default function ExchangeStudent() {
  const expandedRowRender = () => {
    return (
      <>
        <Card title="Thông tin cá nhân">
          <InfoCusCard />
        </Card>
      </>
    );
  };

  const columns = [
    { title: "Tỉnh/TP", dataIndex: "city", ...FilterColumn("city") },
    {
      title: "Họ và tên",
      dataIndex: "nameStudent",
      ...FilterColumn("nameStudent"),
      render: (nameStudent) => (
        <p className="font-weight-blue">{nameStudent}</p>
      ),
    },
    { title: "SĐT", dataIndex: "tel", ...FilterColumn("tel") },
    { title: "Email", dataIndex: "email", ...FilterColumn("email") },
    { title: "Nguồn", dataIndex: "introducer", ...FilterColumn("introducer") },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      render: (status) => {
        return (
          <>
            {status == "Active" ? (
              <span className="tag blue">{status}</span>
            ) : (
              <span className="tag gray">{status}</span>
            )}
          </>
        );
      },
      filters: [
        {
          text: "Active",
          value: "Active",
        },
        {
          text: "Inactive",
          value: "Inactive",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      title: "Tư vấn viên",
      dataIndex: "consultant",
      ...FilterColumn("consultant"),
    },

    {
      title: "",
      render: () => (
        <Link
          href={{
            pathname:
              "/customer/student/exchange-student/student-detail/[slug]",
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
    <ExpandTable
      addClass="basic-header"
      TitlePage="Danh sách học viên chuyển giao"
      expandable={{ expandedRowRender }}
      dataSource={data}
      TitleCard={<StudyTimeForm showAdd={true} />}
      columns={columns}
      Extra={
        <div className="extra-table">
          <FilterTable />
          <SortBox dataOption={data} />
        </div>
      }
    />
  );
}
