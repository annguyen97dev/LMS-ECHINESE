import React from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../lib/option/dataOption2";
import TeacherSalaryForm from "~/components/Global/Option/TeacherSalaryForm";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import SortBox from "~/components/Elements/SortBox";
import FilterTable from "~/components/Global/CourseList/FilterTable";
import LayoutBase from "~/components/LayoutBase";
const TeacherSalary = () => {
  const columns = [
    { title: "Full name", dataIndex: "teacher", ...FilterColumn("teacher") },
    {
      title: "Username",
      dataIndex: "userNameStaff",
      ...FilterColumn("userNameStaff"),
    },
    { title: "Email", dataIndex: "email", ...FilterColumn("email") },
    { title: "Role", dataIndex: "staffRole" },
    { title: "Salary", dataIndex: "price", ...FilterColumn("price") },
    { title: "Modified By", dataIndex: "modBy", ...FilterColumn("modBy") },
    {
      title: "Modified Date",
      dataIndex: "modDate",
      ...FilterDateColumn("modDate"),
    },
    {
      render: () => (
        <>
          <TeacherSalaryForm showIcon={true} />
        </>
      ),
    },
  ];

  return (
    <PowerTable
      addClass="basic-header"
      TitlePage="Teacher salary"
      TitleCard={<TeacherSalaryForm showAdd={true} />}
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
TeacherSalary.layout = LayoutBase;
export default TeacherSalary;
