import React from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../lib/option/dataOption2";
import StaffSalaryForm from "~/components/Global/Option/StaffSalaryForm";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import SortBox from "~/components/Elements/SortBox";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import LayoutBase from "~/components/LayoutBase";
const StaffSalary = () => {
  const columns = [
    { title: "Full name", dataIndex: "staff", ...FilterColumn("staff") },
    {
      title: "Username",
      dataIndex: "userNameStaff",
      ...FilterColumn("userNameStaff"),
    },
    { title: "Email", dataIndex: "email", ...FilterColumn("email") },
    { title: "Role", dataIndex: "staffRole", ...FilterColumn("staffRole") },
    { title: "Salary", dataIndex: "price" },
    { title: "Modified By", dataIndex: "modBy", ...FilterColumn("modBy") },
    {
      title: "Modified Date",
      dataIndex: "modDate",
      ...FilterDateColumn("modDate"),
    },
    {
      render: () => (
        <>
          <StaffSalaryForm showIcon={true} />
        </>
      ),
    },
  ];

  return (
    <PowerTable
      addClass="basic-header"
      TitlePage="Staff salary"
      TitleCard={<StaffSalaryForm showAdd={true} />}
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
StaffSalary.layout = LayoutBase;
export default StaffSalary;
