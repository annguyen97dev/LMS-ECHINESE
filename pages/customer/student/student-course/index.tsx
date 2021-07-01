import React from "react";
import ExpandTable from "~/components/ExpandTable";
import { Eye } from "react-feather";
import { Tooltip } from "antd";
import Link from "next/link";
import { data2 } from "~/lib/customer-student/data";
import SortBox from "~/components/Elements/SortBox";
import ChangeCourse from "~/components/Global/Customer/Student/ChangeCourse";
import ReserveCourse from "~/components/Global/Customer/Student/ReserveCourse";
import RefundCourse from "~/components/Global/Customer/Student/RefundCourse";
import ExpandBox from "~/components/Elements/ExpandBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
CourseStudent.layout = LayoutBase;
export default function CourseStudent() {
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
      dataIndex: "center",
      ...FilterColumn("center"),
      render: (center) => <p className="font-weight-black">{center}</p>,
    },
    {
      title: "Cảnh báo",
      dataIndex: "warning",
      render: (warning) => {
        return (
          <>
            {warning == "Có" ? (
              <span className="tag red">{warning}</span>
            ) : (
              <span className="tag blue">{warning}</span>
            )}
          </>
        );
      },
      filters: [
        {
          text: "Có",
          value: "Có",
        },
        {
          text: "Không",
          value: "Không",
        },
      ],
      onFilter: (value, record) => record.warning.indexOf(value) === 0,
    },
    {
      title: "Kết quả thi",
      dataIndex: "result",
      render: (result) => {
        return (
          <>
            {result == "Không đạt" ? (
              <span className="tag black">{result}</span>
            ) : (
              <span className="tag green">{result}</span>
            )}
          </>
        );
      },
      filters: [
        {
          text: "Đạt",
          value: "Đạt",
        },
        {
          text: "Không đạt",
          value: "Không đạt",
        },
      ],
      onFilter: (value, record) => record.result.indexOf(value) === 0,
    },
    {
      title: "Còn lại",
      dataIndex: "money",
      ...FilterColumn("money"),
      render: (money) => <p className="font-weight-black">{money}</p>,
    },
    {
      title: "",
      render: () => (
        <>
          <Link
            href={{
              pathname:
                "/customer/student/student-course/student-detail/[slug]",
              query: { slug: 2 },
            }}
          >
            <Tooltip title="Xem chi tiết">
              <button className="btn btn-icon view">
                <Eye />
              </button>
            </Tooltip>
          </Link>

          <ChangeCourse />

          <ReserveCourse />

          <RefundCourse />
        </>
      ),
    },
  ];

  return (
    <ExpandTable
      addClass="basic-header"
      TitlePage="Học viên trong khóa"
      expandable={{ expandedRowRender }}
      dataSource={data2}
      columns={columns}
      TitleCard={<StudyTimeForm showAdd={true} />}
      Extra={
        <div className="extra-table">
          <FilterTable />
          <SortBox dataOption={data2} />
        </div>
      }
    />
  );
}
