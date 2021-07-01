import React from "react";
import ExpandTable from "~/components/ExpandTable";
import { Eye, CheckCircle, XCircle } from "react-feather";
import { Tooltip } from "antd";
import SortBox from "~/components/Elements/SortBox";
import { dataService } from "lib/customer/dataCustomer";
import Link from "next/link";
import TestInfo from "~/components/Global/Customer/Service/TestInfo";
import { ExpandBoxService } from "~/components/Elements/ExpandBox";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
AppointmentServiceTest.layout = LayoutBase;
export default function AppointmentServiceTest() {
  const expandedRowRender = () => {
    return <ExpandBoxService />;
  };
  const columns = [
    {
      title: "Học viên",
      dataIndex: "nameStudent",
      ...FilterColumn("nameStudent"),
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    { title: "Nguồn", dataIndex: "source", ...FilterColumn("source") },
    {
      title: "Trung tâm",
      dataIndex: "center",
      ...FilterColumn("center"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Người hẹn",
      dataIndex: "apmConsultant",
      ...FilterColumn("apmConsultant"),
    },
    {
      title: "Ngày hẹn",
      dataIndex: "apmDate",
      ...FilterDateColumn("apmDate"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Giờ hẹn",
      dataIndex: "apmTime",
      ...FilterColumn("apmTime"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Xong",
      dataIndex: "apmStatus",
      align: "center",
      render: (apmStatus) => {
        let color = apmStatus == "Xong" ? "green" : "red";
        if (apmStatus == "Xong") {
          return <CheckCircle color={color} />;
        } else return <XCircle color={color} />;
      },
    },
    {
      title: "Đã đăng kí",
      dataIndex: "apmReg",
      align: "center",
      render: (apmReg) => {
        return (
          <>
            {apmReg == "Đã đăng kí" ? (
              <span className="tag blue">{apmReg}</span>
            ) : (
              <span className="tag black">{apmReg}</span>
            )}
          </>
        );
      },
      filters: [
        {
          text: "Đã đăng kí",
          value: "Đã đăng kí",
        },
        {
          text: "Chưa đăng kí",
          value: "Chưa đăng kí",
        },
      ],
      onFilter: (value, record) => record.apmReg.indexOf(value) === 0,
    },
    {
      title: "",
      render: () => (
        <>
          <Link
            href={{
              pathname:
                "/customer/service/service-appointment-test/student-detail/[slug]",
              query: { slug: 2 },
            }}
          >
            <Tooltip title="Xem chi tiết">
              <button className="btn btn-icon view">
                <Eye />
              </button>
            </Tooltip>
          </Link>

          <TestInfo />
        </>
      ),
    },
  ];

  return (
    <ExpandTable
      addClass="basic-header"
      TitlePage="Danh sách khách hẹn test"
      TitleCard={<StudyTimeForm showAdd={true} />}
      dataSource={dataService}
      columns={columns}
      expandable={{ expandedRowRender }}
      Extra={
        <div className="extra-table">
          <FilterTable />
          <SortBox dataOption={dataService} />
        </div>
      }
    />
  );
}
