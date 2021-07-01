import React from "react";
import PowerTable from "~/components/PowerTable";
import SortBox from "~/components/Elements/SortBox";
import { dataService } from "lib/customer/dataCustomer";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
CustomerServiceResult.layout = LayoutBase;

export default function CustomerServiceResult() {
  const columns = [
    { title: "Ngày", dataIndex: "testDate", ...FilterDateColumn("testDate") },
    {
      title: "Họ và tên",
      dataIndex: "nameStudent",
      ...FilterColumn("nameStudent"),
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    { title: "Số điện thoại", dataIndex: "tel", ...FilterColumn("tel") },
    {
      title: "Test",
      dataIndex: "pkgName",
      ...FilterColumn("pkgName"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Skills",
      dataIndex: "pkgSkill",
      ...FilterColumn("pkgSkill"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Listening",
      dataIndex: "listening",
      render: (listening) => {
        return <span className="tag blue">{listening}</span>;
      },
    },
    {
      title: "Reading",
      dataIndex: "reading",
      render: (reading) => {
        return <span className="tag blue">{reading}</span>;
      },
    },
    {
      title: "Writing",
      dataIndex: "writing",
      render: (writing) => {
        return <span className="tag blue">{writing}</span>;
      },
    },
    {
      title: "Speaking",
      dataIndex: "speaking",
      render: (speaking) => {
        return <span className="tag blue">{speaking}</span>;
      },
    },
    {
      title: "Overall",
      dataIndex: "overall",
      render: (overall) => {
        return <span className="tag green">{overall}</span>;
      },
    },
  ];

  return (
    <PowerTable
      addClass="basic-header"
      TitlePage="Danh sách kết quả test"
      TitleCard={<StudyTimeForm showAdd={true} />}
      dataSource={dataService}
      columns={columns}
      Extra={
        <div className="extra-table">
          <FilterTable />

          <SortBox dataOption={dataService} />
        </div>
      }
    />
  );
}
