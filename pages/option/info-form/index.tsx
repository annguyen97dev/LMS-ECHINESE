import React from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../lib/option/dataOption2";
import InfoForm from "~/components/Global/Option/InfoForm";
import FilterColumn from "~/components/Tables/FilterColumn";
import SortBox from "~/components/Elements/SortBox";
import FilterTable from "~/components/Global/CourseList/FilterTable";
import LayoutBase from "~/components/LayoutBase";
const InfoFormList = () => {
  const columns = [
    { title: "Title", dataIndex: "title", ...FilterColumn("title") },
    { title: "Note", dataIndex: "note" },
    { title: "Source", dataIndex: "source" },
    { title: "Seller", dataIndex: "staff", ...FilterColumn("staff") },
    {
      title: "Receive",
      dataIndex: "modBy",
      ...FilterColumn("modBy"),
      render: (modBy) => <span className="tag yellow">{modBy}</span>,
    },
    {
      render: () => <InfoForm showIcon={true} />,
    },
  ];

  return (
    <PowerTable
      addClass="basic-header"
      TitlePage="Info form"
      TitleCard={<InfoForm showAdd={true} />}
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
InfoFormList.layout = LayoutBase;
export default InfoFormList;
