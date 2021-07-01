import React from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../lib/option/dataOption2";
import DayOffForm from "~/components/Global/Option/DayOffForm";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import SortBox from "~/components/Elements/SortBox";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import LayoutBase from "~/components/LayoutBase";
const DayOff = () => {
  const columns = [
    { title: "Day", dataIndex: "dayOff", ...FilterDateColumn("dayOff") },
    { title: "Note", dataIndex: "noteDayOff", ...FilterColumn("noteDayOff") },
    { title: "Modified By", dataIndex: "modBy", ...FilterColumn("modBy") },
    {
      title: "Modified Date",
      dataIndex: "expires",
      ...FilterDateColumn("expires"),
    },
    {
      render: () => (
        <>
          <DayOffForm showIcon={true} />
        </>
      ),
    },
  ];

  return (
    <PowerTable
      addClass="basic-header"
      TitlePage="DAY OFF list"
      TitleCard={<DayOffForm showAdd={true} />}
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

DayOff.layout = LayoutBase;
export default DayOff;
