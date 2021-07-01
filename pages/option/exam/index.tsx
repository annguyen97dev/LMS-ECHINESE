import React from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../lib/option/dataOption2";
import ExamForm from "~/components/Global/Option/ExamForm";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import LayoutBase from "~/components/LayoutBase";
const Exam = () => {
  const columns = [
    { title: "Center", dataIndex: "center", ...FilterColumn("center") },
    { title: "Supplier", dataIndex: "supplier", ...FilterColumn("supplier") },
    { title: "Exam", dataIndex: "exam" },
    { title: "Official Exam" },
    { title: "Date", dataIndex: "expires", ...FilterDateColumn("expires") },
    { title: "Slot", dataIndex: "slot" },
    { title: "Price", dataIndex: "price" },
    { title: "Hour", dataIndex: "hour" },
    {
      render: () => (
        <>
          <ExamForm showIcon={true} />
        </>
      ),
    },
  ];

  return (
    <PowerTable
      addClass="basic-header"
      TitlePage="Exams list"
      TitleCard={<ExamForm showAdd={true} />}
      dataSource={data}
      columns={columns}
      Extra={
        <div className="extra-table">
          <FilterTable />
          <SortBox />
        </div>
      }
    />
  );
};
Exam.layout = LayoutBase;
export default Exam;
