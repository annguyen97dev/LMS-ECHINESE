import React from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../lib/option/dataOption2";
import CustomerSupplierForm from "~/components/Global/Option/CustomerSupplierForm";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import SortBox from "~/components/Elements/SortBox";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import LayoutBase from "~/components/LayoutBase";
const CustomerSupplier = () => {
  const columns = [
    {
      title: "Customer Supplier",
      dataIndex: "source",
      ...FilterColumn("source"),
    },
    { title: "Modified By", dataIndex: "modBy", ...FilterColumn("modBy") },
    {
      title: "Modified Date",
      dataIndex: "modDate",
      ...FilterDateColumn("modDate"),
    },
    {
      title: "Hidden",
      dataIndex: "srcStatus",
      align: "center",
      render: (srcStatus) => {
        let isHidden = srcStatus % 2 == 0 ? true : false;
        return (
          <div>
            {isHidden ? (
              <span className="tag blue">Visible</span>
            ) : (
              <span className="tag black">Hidden</span>
            )}
          </div>
        );
      },
    },

    {
      render: () => (
        <>
          <CustomerSupplierForm showIcon={true} />
        </>
      ),
    },
  ];

  return (
    <PowerTable
      addClass="basic-header"
      TitlePage="CUSTOMER SUPPLIER LIST"
      TitleCard={<CustomerSupplierForm showAdd={true} />}
      dataSource={data}
      columns={columns}
      Extra={
        <div className="extra-table">
          <FilterTable />
          <SortBox />
        </div>
      }
    />
  );
};
CustomerSupplier.layout = LayoutBase;
export default CustomerSupplier;
