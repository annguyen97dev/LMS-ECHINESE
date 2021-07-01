import React from "react";
import PowerTable from "~/components/PowerTable";
import { Eye } from "react-feather";
import { Tooltip } from "antd";
import SortBox from "~/components/Elements/SortBox";
import { dataService } from "lib/customer/dataCustomer";
import Link from "next/link";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
CustomerServiceExam.layout = LayoutBase;

export default function CustomerServiceExam() {
  const columns = [
    {
      title: "Học viên",
      dataIndex: "nameStudent",
      ...FilterColumn("nameStudent"),
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    {
      title: "Đợt thi",
      dataIndex: "testTime",
      ...FilterColumn("testTime"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Loại",
      dataIndex: "typeTest",
      render: (typeTest) => {
        return (
          <>
            {typeTest == "Thi Thử" ? (
              <span className="tag blue">{typeTest}</span>
            ) : (
              <span className="tag green">{typeTest}</span>
            )}
          </>
        );
      },
      filters: [
        {
          text: "Thi thử",
          value: "Thi thử",
        },
      ],
      onFilter: (value, record) => record.typeTest.indexOf(value) === 0,
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "provider",
      ...FilterColumn("provider"),
    },
    {
      title: "Giá tiền",
      dataIndex: "testCost",
      ...FilterColumn("testCost"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Ngày thi",
      dataIndex: "testDate",
      ...FilterDateColumn("testDate"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Ngày đăng kí",
      dataIndex: "regDate",
      ...FilterDateColumn("regDate"),
    },
    {
      title: "",
      render: () => (
        <Link
          href={{
            pathname:
              "/customer/service/service-customer-exam/student-detail/[slug]",
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
    <PowerTable
      addClass="basic-header"
      TitlePage="Danh sách đăng kí đi thi"
      dataSource={dataService}
      TitleCard={<StudyTimeForm showAdd={true} />}
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
