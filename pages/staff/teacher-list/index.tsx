import React, { useState, useRef } from "react";
import { Input, Tooltip, Table, Button, Space } from "antd";
import { FormOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import SearchBox from "~/components/Elements/SearchBox";
import Link from "next/link";
import PowerTable from "~/components/PowerTable";
import Highlighter from "react-highlight-words";
import SortBox from "~/components/Elements/SortBox";

import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";

import { Eye, Filter, Search } from "react-feather";

import ModalAdd from "~/components/Global/TeacherList/ModalAdd";
// import SearchInTable from "~/components/Tables/SearchInTable";
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

const dataSource = [];

for (let i = 0; i < 50; i++) {
  dataSource.push({
    key: i,
    Place: "HCM" + i,
    NameStaff: "Nguyễn An" + i,
    NumberPhone: "012345678",
    Email: "annguyen97dev@gmail.com" + i,
    Status: "active",
    StartDay: i === 34 ? "02-05-2021" : "12-05-2021",
    Action: "",
  });
}

const TeacherList = () => {
  const columns = [
    {
      title: "Tỉnh/TP",
      dataIndex: "Place",
      key: "center",
      ...FilterColumn("Place"),
    },
    {
      title: "Họ và tên",

      dataIndex: "NameStaff",
      key: "namestaff",
      ...FilterColumn("NameStaff"),
      render: (text) => <p className="font-weight-blue">{text}</p>,
    },
    {
      title: "SĐT",
      dataIndex: "NumberPhone",
      key: "numberphone",
      ...FilterColumn("Numberphone"),
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "email",
      ...FilterColumn("Email"),
      render: (text) => <p className="font-weight-black">{text}</p>,
    },

    {
      title: "Trạng thái",
      dataIndex: "Status",
      key: "status",
      filters: [
        {
          text: "Active",
          value: "active",
        },
        {
          text: "Unactive",
          value: "unactive",
        },
      ],
      onFilter: (value, record) => record.Status.indexOf(value) === 0,
      render: (Status) => <span className="tag green">Active</span>,
    },
    {
      title: "Ngày nhận việc",
      dataIndex: "StartDay",
      key: "startday",
      ...FilterDateColumn("StartDay"),
    },
    {
      title: "",
      dataIndex: "Action",
      key: "action",
      align: "center",
      render: (Action) => (
        <Link
          href={{
            pathname: "/staff/teacher-list/teacher-detail/[slug]",
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
        addClass={"basic-header"}
        columns={columns}
        dataSource={dataSource}
        TitlePage="Danh sách giáo viên"
        TitleCard={<ModalAdd />}
        Extra={
          <div className="extra-table">
            <SortBox dataOption={dataOption} />
          </div>
        }
      />
    </>
  );
};

TeacherList.layout = LayoutBase;

export default TeacherList;
