import React, { useState } from "react";
import { Table, Card, Tag, Tooltip } from "antd";
import { FormOutlined, EyeOutlined } from "@ant-design/icons";
import SearchBox from "~/components/Elements/SearchBox";
import Link from "next/link";
import PowerTable from "~/components/PowerTable";
import ModalAdd from "~/components/Global/SalerList/ModalAdd";

import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";

import { Eye, Filter, Search } from "react-feather";
import SortBox from "~/components/Elements/SortBox";
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

const SalerList = () => {
  const dataSource = [];

  for (let i = 0; i < 50; i++) {
    dataSource.push({
      key: i,
      Place: "Hồ Chí Minh",
      NameStaff: "Nguyễn An",
      NumberPhone: "012345678",
      Email: "annguyen97dev@gmail.com",
      Status: "",
      StartDay: "03/05/2021",
      Action: "",
    });
  }

  const columns = [
    {
      title: "Tỉnh/TP",
      dataIndex: "Place",
      key: "center",
      ...FilterColumn("Place"),
      render: (text) => <p className="font-weight-black">{text}</p>,
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
        columns={columns}
        dataSource={dataSource}
        TitlePage="Danh sách Salers"
        TitleCard={<ModalAdd />}
        Extra={<SortBox dataOption={dataOption} />}
        addClass={"basic-header"}
      />
    </>
  );
};

SalerList.layout = LayoutBase;

export default SalerList;
