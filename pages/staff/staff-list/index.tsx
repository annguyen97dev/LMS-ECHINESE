import React, { useState } from "react";
import { Table, Card, Tag, Tooltip } from "antd";
import { FormOutlined, EyeOutlined } from "@ant-design/icons";
import TitlePage from "~/components/TitlePage";
import SearchBox from "~/components/Elements/SearchBox";
import Link from "next/link";
import PowerTable from "~/components/PowerTable";
import ModalAdd from "~/components/Global/StaffList/ModalAdd";

import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import { Eye, Filter, Search } from "react-feather";
import LayoutBase from "~/components/LayoutBase";

const StaffList = () => {
  const dataSource = [];

  for (let i = 0; i < 50; i++) {
    dataSource.push({
      key: i,
      Center: "ZIM – 65 Yên Lãng",
      NameStaff: "User name " + i,
      Account: "annguyen97dev",
      Email: "annguyen97dev@gmail.com",
      Position: "Dev",
      Status: i % 2 == 0 ? "Active" : "Unactive",
      StartDay: "03/05/2021",
      Action: "",
    });
  }

  const columns = [
    {
      title: "Trung tâm",
      dataIndex: "Center",
      key: "center",
      ...FilterColumn("Center"),
      render: (text) => (
        <a href="/" className="font-weight-blue">
          {text}
        </a>
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "NameStaff",
      key: "namestaff",
      ...FilterColumn("NameStaff"),
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Tài khoản",
      dataIndex: "Account",
      key: "account",
      ...FilterColumn("Account"),
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "email",
      ...FilterColumn("Email"),
    },
    {
      title: "Chức vụ",
      dataIndex: "Position",
      key: "position",
      ...FilterColumn("Position"),
    },
    {
      title: "Trạng thái",
      dataIndex: "Status",
      key: "status",
      align: "center",
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
      render: (Status) => {
        let color = "";
        let text = "";
        if (Status === "Active") {
          color = "red";
        }
        if (Status === "Unactive") {
          color = "green";
        }
        return (
          <span style={{ width: "90px" }} className={`tag ${color}`}>
            {Status}
          </span>
        );
      },
    },
    {
      title: "Ngày nhận việc",
      dataIndex: "StartDay",
      key: "startday",
      ...FilterDateColumn("StartDay"),
    },
    {
      title: "Thao tác",
      dataIndex: "Action",
      key: "action",
      align: "center",
      render: (Action) => (
        <Link
          href={{
            pathname: "/staff/staff-list/staff-detail/[slug]",
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
        TitlePage="Danh sách nhân viên"
        TitleCard={<ModalAdd />}
      />
    </>
  );
};
StaffList.layout = LayoutBase;

export default StaffList;
