import React, { useState } from "react";
import { Table, Card, Tag, Tooltip } from "antd";

import SearchBox from "~/components/Elements/SearchBox";
import Link from "next/link";
import PowerTable from "~/components/PowerTable";
import SortBox from "~/components/Elements/SortBox";
import { Filter, Eye } from "react-feather";
import FilterTable from "~/components/Global/CostList/FilterTable";

import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import LayoutBase from "~/components/LayoutBase";

const dataOption = [
  {
    text: "Option 1",
    value: "option 1",
  },
  {
    text: "Option 2",
    value: "option 2",
  },
  {
    text: "Option 3",
    value: "option 3",
  },
];

const CostList = () => {
  const [showFilter, showFilterSet] = useState(false);
  const funcShowFilter = () => {
    showFilter ? showFilterSet(false) : showFilterSet(true);
  };

  const dataSource = [];

  for (let i = 0; i < 50; i++) {
    dataSource.push({
      key: i,
      Start: "21/12/2021",
      End: "31/12/2021",
      TotalDay: "10",
      Note: "Nothing",
      Action: "",
    });
  }

  const columns = [
    {
      title: "Start",
      dataIndex: "Start",
      key: "start",
      ...FilterDateColumn("Start"),
    },
    {
      title: "End",
      dataIndex: "End",
      key: "end",
      ...FilterDateColumn("End"),
    },
    {
      title: "Total Day",
      dataIndex: "TotalDay",
      key: "totalday",
    },
    {
      title: "Note",
      dataIndex: "Note",
      key: "checker",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "action",
      render: () => (
        <Link
          href={{
            pathname: "/staff/campaign-sales/[slug]",
            query: { slug: 2 },
          }}
        >
          <a className="btn btn-icon">
            <Tooltip title="Chi tiết">
              <Eye />
            </Tooltip>
          </a>
        </Link>
      ),
    },
  ];

  return (
    <>
      <PowerTable
        Size="table-small"
        columns={columns}
        dataSource={dataSource}
        TitlePage="Chiến dịch sale"
        TitleCard=""
        Extra={
          <div className="extra-table">
            <SortBox dataOption={dataOption} />
          </div>
        }
      ></PowerTable>
    </>
  );
};

CostList.layout = LayoutBase;
export default CostList;
