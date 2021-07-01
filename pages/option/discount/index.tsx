import React from "react";
import PowerTable from "~/components/PowerTable";
import TitlePage from "~/components/TitlePage";
import { data } from "../../../lib/option/dataOption2";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import DiscountForm from "~/components/Global/Option/DiscountForm";
import SortBox from "~/components/Elements/SortBox";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import LayoutBase from "~/components/LayoutBase";
const Discount = () => {
  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      ...FilterColumn("code"),
      render: (code) => <span className="tag green">{code}</span>,
    },
    { title: "Price", dataIndex: "price", ...FilterColumn("price") },
    { title: "Percent", dataIndex: "percent" },
    { title: "Status", dataIndex: "status" },
    { title: "Quantity", dataIndex: "quantity" },
    { title: "Quantity Left", dataIndex: "quantityLeft" },
    { title: "Note", dataIndex: "note" },
    { title: "Expires", dataIndex: "expires", ...FilterDateColumn("expires") },
    {
      render: () => (
        <>
          <DiscountForm showIcon={true} />
        </>
      ),
    },
  ];

  return (
    <div className="row">
      <div className="col-12">
        <TitlePage title="Discount List" />
      </div>
      <div className="col-12">
        <PowerTable
          addClass="basic-header"
          TitleCard={<DiscountForm showAdd={true} />}
          dataSource={data}
          columns={columns}
          Extra={
            <div className="extra-table">
              <FilterTable />
              <SortBox />
            </div>
          }
        />
      </div>
    </div>
  );
};
Discount.layout = LayoutBase;
export default Discount;
