import React from "react";
import ExpandTable from "~/components/ExpandTable";
import { data4 } from "~/lib/customer-student/data";
import ExpandBox from "~/components/Elements/ExpandBox";
import RegInfo from "~/components/Global/Customer/Student/RegInfo";
import RegCancel from "~/components/Global/Customer/Student/RegCancel";
import RegRefund from "~/components/Global/Customer/Student/RegRefund";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
StudentAppointment.layout = LayoutBase;
export default function StudentAppointment() {
  const expandedRowRender = () => {
    return <ExpandBox />;
  };

  const columns = [
    {
      title: "Học viên",
      dataIndex: "nameStudent",
      ...FilterColumn("nameStudent"),
      render: (nameStudent) => (
        <p className="font-weight-blue">{nameStudent}</p>
      ),
    },
    {
      title: "Tỉnh/TP",
      dataIndex: "nameStudent",
      ...FilterColumn("nameStudent"),
    },
    {
      title: "Trung tâm",
      dataIndex: "center",
      ...FilterColumn("center"),
      render: (center) => <p className="font-weight-black">{center}</p>,
    },
    {
      title: "Lớp",
      dataIndex: "class",
      ...FilterColumn("class"),
      render: (class1) => <p className="font-weight-black">{class1}</p>,
    },
    {
      title: "Ca",
      dataIndex: "time",
      ...FilterColumn("time"),
      render: (time) => <p className="font-weight-blue">{time}</p>,
    },
    { title: "Đặt cọc", dataIndex: "deposit", ...FilterColumn("deposit") },
    {
      title: "",
      render: () => (
        <>
          <RegInfo />
          <RegCancel />
          <RegRefund />
        </>
      ),
    },
  ];

  return (
    <ExpandTable
      addClass="basic-header"
      TitlePage="Danh sách học viên hẹn đăng kí"
      expandable={{ expandedRowRender }}
      dataSource={data4}
      TitleCard={<StudyTimeForm showAdd={true} />}
      columns={columns}
      Extra={
        <div className="extra-table">
          <FilterTable />
          <SortBox dataOption={data4} />
        </div>
      }
    />
  );
}
