import React, { useState } from "react";
import { Input, Modal } from "antd";

import SearchBox from "~/components/Elements/SearchBox";
import Link from "next/link";
import PowerTable from "~/components/PowerTable";
import SortBox from "~/components/Elements/SortBox";

import FilterTable from "~/components/Global/CostList/FilterTable";

import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";

import { Eye, Filter, Search } from "react-feather";
import LayoutBase from "~/components/LayoutBase";
const { TextArea } = Input;

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

const SalaryHistory = () => {
  const [showFilter, showFilterSet] = useState(false);
  const funcShowFilter = () => {
    showFilter ? showFilterSet(false) : showFilterSet(true);
  };

  const dataSource = [];

  for (let i = 0; i < 50; i++) {
    dataSource.push({
      key: i,
      FullName: "Nguyễn An",
      Camp: "Something",
      Money: "4,500,000",
      Note: "Text",
      CreatedDate: "20-05-2020",
      CreatedPeople: "Hùng Nguyễn",
    });
  }

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "FullName",
      key: "fullname",
      ...FilterColumn("FullName"),
    },
    {
      title: "Chiến dịch",
      dataIndex: "Camp",
      key: "Camp",
      ...FilterColumn("Camp"),
    },
    {
      title: "Số tiền",
      dataIndex: "Money",
      key: "money",
    },
    {
      title: "Ghi chú",
      dataIndex: "Note",
      key: "note",
    },
    {
      title: "Ngày tạo",
      dataIndex: "CreatedDate",
      key: "createddate",
      ...FilterDateColumn("StartDay"),
    },
    {
      title: "Người tạo",
      dataIndex: "CreatedPeople",
      key: "createdpeople",
      ...FilterColumn("CreatedDate"),
    },
  ];

  return (
    <>
      <PowerTable
        columns={columns}
        dataSource={dataSource}
        TitlePage="Danh sách lương đã duyệt"
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

SalaryHistory.layout = LayoutBase;
export default SalaryHistory;
