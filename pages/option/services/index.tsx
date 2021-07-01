import React from "react";
import PowerTable from "~/components/PowerTable";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import SortBox from "~/components/Elements/SortBox";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import { data } from "../../../lib/option/dataOption2";
import ServiceForm from "~/components/Global/Option/ServiceForm";
import LayoutBase from "~/components/LayoutBase";
const ServiceList = () => {
  const columns = [
    { title: "Service", dataIndex: "services", ...FilterColumn("services") },
    { title: "Description", dataIndex: "note" },
    { title: "Modified By", dataIndex: "modBy", ...FilterColumn("modBy") },
    {
      title: "Modified Date",
      dataIndex: "modDate",
      ...FilterDateColumn("modDate"),
    },
    {
      render: () => (
        <>
          <ServiceForm showIcon={true} />
        </>
      ),
    },
  ];

  return (
    <PowerTable
      addClass="basic-header"
      TitlePage="Services List"
      TitleCard={<ServiceForm showAdd={true} />}
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
ServiceList.layout = LayoutBase;
export default ServiceList;
