import React from "react";
import ExpandTable from "~/components/ExpandTable";
import { Eye } from "react-feather";
import { Tooltip } from "antd";
import Link from "next/link";
import { data3 } from "~/lib/customer-student/data";
import ExpandBox from "~/components/Elements/ExpandBox";
import SortBox from "~/components/Elements/SortBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
StudentCourseChange.layout = LayoutBase;
export default function StudentCourseChange() {
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
      title: "Khóa học",
      dataIndex: "course",
      ...FilterColumn("course"),
      render: (course) => <p className="font-weight-black">{course}</p>,
    },
    { title: "Giá tiền", dataIndex: "money", ...FilterColumn("money") },
    { title: "Đã đóng", dataIndex: "payed", ...FilterColumn("payed") },
    { title: "Giảm giá", dataIndex: "discount", ...FilterColumn("discount") },
    { title: "Còn lại", dataIndex: "left", ...FilterColumn("left") },

    {
      title: "",
      render: () => (
        <Link
          href={{
            pathname:
              "/customer/student/student-change-course/student-detail/[slug]",
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
      TitlePage="Học viên chuyển khóa"
      expandable={{ expandedRowRender }}
      dataSource={data3}
      TitleCard={<StudyTimeForm showAdd={true} />}
      columns={columns}
      Extra={
        <div className="extra-table">
          <FilterTable />
          <SortBox dataOption={data3} />
        </div>
      }
    />
  );
}
