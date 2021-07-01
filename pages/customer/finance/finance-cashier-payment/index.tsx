import React from "react";
import PowerTable from "~/components/PowerTable";
import { Image, Tooltip } from "antd";
import SortBox from "~/components/Elements/SortBox";
import { dataService } from "lib/customer/dataCustomer";
import ConsultantForm from "~/components/Global/Customer/Finance/ConsultantForm";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import { ShoppingCart } from "react-feather";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import Link from "next/link";
import LayoutBase from "~/components/LayoutBase";
FinancePayment.layout = LayoutBase;
export default function FinancePayment() {
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
      dataIndex: "fnReasonPayment",
      ...FilterColumn("fnReasonPayment"),

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
          <Tooltip title="Xuất phiếu chi">
            <Link
              href={{
                pathname:
                  "/customer/finance/finance-cashier-payment/invoice-detail/[slug]",
                query: { slug: 2 },
              }}
            >
              <button className="btn btn-icon exchange">
                <ShoppingCart />
              </button>
            </Link>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <PowerTable
      addClass="basic-header"
      TitlePage="Danh sách phiếu chi"
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
