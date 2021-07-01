import React from "react";
import PowerTable from "~/components/PowerTable";
import { ShoppingCart, XCircle } from "react-feather";
import { Image, Tooltip } from "antd";
import { dataService } from "lib/customer/dataCustomer";
import Link from "next/link";
import SortBox from "~/components/Elements/SortBox";
import ConsultantForm from "~/components/Global/Customer/Finance/ConsultantForm";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
FinanceInvoice.layout = LayoutBase;
export default function FinanceInvoice() {
  const columns = [
    { title: "Trung tâm", dataIndex: "center", ...FilterColumn("center") },
    {
      title: "Học viên",
      dataIndex: "nameStudent",
      ...FilterColumn("nameStudent"),
      render: (a) => <p className="font-weight-blue">{a}</p>,
    },
    { title: "Số điện thoại", dataIndex: "tel", ...FilterColumn("tel") },
    {
      title: "Số tiền",
      dataIndex: "cost",
      ...FilterColumn("cost"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Lý do",
      dataIndex: "fnReason",
      ...FilterColumn("fnReason"),
      render: (a) => <p className="font-weight-black">{a}</p>,
    },
    {
      title: "Ngày giờ tạo",
      dataIndex: "regDate",
      ...FilterDateColumn("regDate"),
    },
    {
      title: "QR Code",
      render: () => (
        <>
          <Image alt="" />
        </>
      ),
    },
    {
      title: "",
      render: () => (
        <>
          <ConsultantForm />
          <Link
            href={{
              pathname: "/customer/finance/invoice/[slug]",
              query: { slug: 2 },
            }}
          >
            <Tooltip title="Xuất phiếu thu">
              <button className="btn btn-icon exchange">
                <ShoppingCart />
              </button>
            </Tooltip>
          </Link>
          <Tooltip title="Xóa phiếu thu">
            <button className="btn btn-icon delete">
              <XCircle />
            </button>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <PowerTable
      TitlePage="Danh sách phiếu thu"
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
