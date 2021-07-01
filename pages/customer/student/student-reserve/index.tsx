import React from "react";
import ExpandTable from "~/components/ExpandTable";
import { data5 } from "~/lib/customer-student/data";
import SortBox from "~/components/Elements/SortBox";
import ExpandBox from "~/components/Elements/ExpandBox";
import RegInfo from "~/components/Global/Customer/Student/RegInfo";
import ReserveChangeCourse from "~/components/Global/Customer/Student/ReserveChangeCourse";
import RegCancel from "~/components/Global/Customer/Student/RegCancel";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
StudentReserve.layout = LayoutBase;
export default function StudentReserve() {
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
    { title: "Tỉnh/TP", dataIndex: "city", ...FilterColumn("city") },
    { title: "Trung tâm", dataIndex: "center", ...FilterColumn("center") },
    { title: "Lớp", dataIndex: "class", ...FilterColumn("class") },
    { title: "Ca", dataIndex: "time", ...FilterColumn("time") },
    {
      title: "Đóng thêm",
      dataIndex: "reserve",
      ...FilterColumn("reserve"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "",
      render: () => (
        <>
          <RegInfo />
          <ReserveChangeCourse />
          <RegCancel />
        </>
      ),
    },
  ];

  return (
    <ExpandTable
      addClass="basic-header"
      TitlePage="Học viên bảo lưu"
      expandable={{ expandedRowRender }}
      dataSource={data5}
      TitleCard={<StudyTimeForm showAdd={true} />}
      columns={columns}
      Extra={
        <div className="extra-table">
          <FilterTable />
          <SortBox dataOption={data5} />
        </div>
      }
    />
  );
}
