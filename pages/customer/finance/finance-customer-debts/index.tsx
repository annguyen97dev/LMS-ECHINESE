import React from "react";
import PowerTable from "~/components/PowerTable";
import { Eye } from "react-feather";
import { Tooltip } from "antd";
import SortBox from "~/components/Elements/SortBox";
import { dataService } from "lib/customer/dataCustomer";
import Link from "next/link";
import Tuition from "~/components/Global/Customer/Finance/Tuition";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
FinanceDebts.layout = LayoutBase;
export default function FinanceDebts() {
  const columns = [
    {
      title: "Học viên",
      dataIndex: "nameStudent",
      ...FilterColumn("nameStudent"),
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    { title: "Khóa học", dataIndex: "rpCourse", ...FilterColumn("rpCourse") },
    { title: "Trung tâm", dataIndex: "center", ...FilterColumn("center") },
    {
      title: "Số tiền",
      dataIndex: "cost",
      ...FilterColumn("cost"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Ngày hẹn thu",
      dataIndex: "apmDate",
      ...FilterDateColumn("apmDate"),
    },
    {
      title: "Ngày nhập học",
      dataIndex: "testDate",
      ...FilterDateColumn("testDate"),
    },
    {
      title: "",
      render: () => (
        <>
          <Link
            href={{
              pathname:
                "/customer/finance/finance-customer-debts/student-detail/[slug]",
              query: { slug: 2 },
            }}
          >
            <Tooltip title="Xem chi tiết">
              <button className="btn btn-icon view">
                <Eye />
              </button>
            </Tooltip>
          </Link>
          <Tuition />
        </>
      ),
    },
  ];

  return (
    <PowerTable
      addClass="basic-header"
      TitlePage="Danh sách học viên nợ học phí"
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
