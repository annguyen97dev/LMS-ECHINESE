import React from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../lib/option/dataOption2";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import SortBox from "~/components/Elements/SortBox";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import PurposeForm from "~/components/Global/Option/PurposeForm";
import LayoutBase from "~/components/LayoutBase";
const Purpose = () => {
  const columns = [
    { title: "Purposes", dataIndex: "purpose", ...FilterColumn("purpose") },
    { title: "Modified By", dataIndex: "modBy", ...FilterColumn("modBy") },
    {
      title: "Modified Date",
      dataIndex: "expires",
      ...FilterDateColumn("expires"),
    },
    {
      render: () => (
        <>
          <PurposeForm showIcon={true} />
        </>
      ),
    },
  ];

  return (
    <PowerTable
      addClass="basic-header"
      TitlePage="PURPOSES list"
      TitleCard={<PurposeForm showAdd={true} />}
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
Purpose.layout = LayoutBase;
export default Purpose;
