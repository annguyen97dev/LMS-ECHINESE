import { Tooltip } from "antd";
import { dataService } from "lib/customer/dataCustomer";
import Link from "next/link";
import React from "react";
import { Eye } from "react-feather";
import { ExpandRefundRow } from "~/components/Elements/ExpandBox";
import SortBox from "~/components/Elements/SortBox";
import ExpandTable from "~/components/ExpandTable";
import FilterTable from "~/components/Global/CourseList/FilterTable";
import RegRefund from "~/components/Global/Customer/Student/RegRefund";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
import FilterColumn from "~/components/Tables/FilterColumn";
CustomerService.layout = LayoutBase;
export default function CustomerService() {
  const expandedRowRender = () => {
    return "";
  };

  const columns = [
    {
      title: "Học viên",
      dataIndex: "nameStudent",
      ...FilterColumn("nameStudent"),
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    {
      title: "Dịch vụ",
      dataIndex: "service",
      ...FilterColumn("service"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Giá tiền",
      dataIndex: "cost",
      ...FilterColumn("cost"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "provider",
      ...FilterColumn("provider"),
    },
    {
      title: "",
      render: () => (
        <>
          <Link
            href={{
              pathname:
                "/customer/service/service-customer/student-detail/[slug]",
              query: { slug: 2 },
            }}
          >
            <Tooltip title="Xem chi tiết">
              <button className="btn btn-icon view">
                <Eye />
              </button>
            </Tooltip>
          </Link>

          <RegRefund />
        </>
      ),
    },
  ];

  return (
    <ExpandTable
      addClass="basic-header"
      TitlePage="Khách mua dịch vụ"
      expandable={{ expandedRowRender }}
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
