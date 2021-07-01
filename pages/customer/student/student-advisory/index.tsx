import React from "react";
import ExpandTable from "~/components/ExpandTable";
import { Eye } from "react-feather";
import { Tooltip } from "antd";
import SortBox from "~/components/Elements/SortBox";
import { data6 } from "~/lib/customer-student/data";
import ExpandBox from "~/components/Elements/ExpandBox";
import Link from "next/link";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
StudentAdvisory.layout = LayoutBase;
export default function StudentAdvisory() {
  const expandedRowRender = () => {
    return <ExpandBox />;
  };

  const columns = [
    { title: "Tỉnh/TP", dataIndex: "city", ...FilterColumn("city") },
    {
      title: "Họ và tên",
      dataIndex: "nameStudent",
      ...FilterColumn("nameStudent"),
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    { title: "Số điện thoại", dataIndex: "tel", ...FilterColumn("tel") },
    { title: "Email", dataIndex: "email", ...FilterColumn("email") },
    { title: "Nguồn", dataIndex: "introducer", ...FilterColumn("introducer") },
    { title: "Trạng thái", dataIndex: "reserve", ...FilterColumn("reserve") },
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
              "/customer/student/student-advisory/student-detail/[slug]",
            query: { slug: 2 },
          }}
        >
          <Tooltip title="Xem chi tiết">
            <button className="btn btn-icon view">
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
      TitlePage="Học viên cần tư vấn"
      expandable={{ expandedRowRender }}
      dataSource={data6}
      TitleCard={<StudyTimeForm showAdd={true} />}
      columns={columns}
      Extra={
        <div className="extra-table">
          <FilterTable />
          <SortBox dataOption={data6} />
        </div>
      }
    />
  );
}
