import React from "react";
import ExpandTable from "~/components/ExpandTable";
import { Eye } from "react-feather";
import { Tooltip } from "antd";
import SortBox from "~/components/Elements/SortBox";
import { dataService } from "lib/customer/dataCustomer";
import Link from "next/link";
import { ExpandBoxWarning } from "~/components/Elements/ExpandBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
ReportWarning.layout = LayoutBase;
export default function ReportWarning() {
  const expandedRowRender = () => <ExpandBoxWarning />;
  const columns = [
    {
      title: "Trung tâm",
      dataIndex: "center",
      ...FilterColumn("center"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Học viên",
      dataIndex: "center",
      ...FilterColumn("center"),
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    {
      title: "Lớp",
      dataIndex: "rpCourse",
      ...FilterColumn("rpCourse"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "testDate",
      ...FilterDateColumn("testDate"),
    },
    {
      title: "Người tạo",
      dataIndex: "rpCreator",
      ...FilterColumn("rpCreator"),
    },
    { title: "Chủ nhiệm", dataIndex: "rpLeader", ...FilterColumn("rpLeader") },
    {
      title: "",
      render: () => (
        <>
          <Link
            href={{
              pathname:
                "/customer/report/report-customer-test/student-detail/[slug]",
              query: { slug: 2 },
            }}
          >
            <Tooltip title="Xem chi tiết">
              <button className="btn btn-icon view">
                <Eye />
              </button>
            </Tooltip>
          </Link>
        </>
      ),
    },
  ];

  return (
    <ExpandTable
      addClass="basic-header"
      TitlePage="Danh sách học viên bị cảnh báo"
      TitleCard={<StudyTimeForm showAdd={true} />}
      dataSource={dataService}
      columns={columns}
      expandable={{ expandedRowRender }}
      Extra={
        <div className="extra-table">
          <FilterTable />
          <SortBox dataOption={dataService} />
        </div>
      }
    />
  );
}
