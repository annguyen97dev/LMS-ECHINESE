import React from "react";
import PropTypes from "prop-types";
import TitlePage from "~/components/Elements/TitlePage";
import { Table, Card, Switch, Tooltip } from "antd";
import SearchBox from "~/components/Elements/SearchBox";
import SortBox from "~/components/Elements/SortBox";
import { Check } from "react-feather";
import Link from "next/link";

import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import LayoutBase from "~/components/LayoutBase";
import { Eye, Filter, Search } from "react-feather";
import PowerTable from "~/components/PowerTable";

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

function onChange_Show(checked) {
  console.log(`switch to ${checked}`);
}

const PackageList = (props) => {
  const data = [];

  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      Thumbnail: "",
      Name: "IELTS Practice Test 10",
      Type: "Free",
      Listening: true,
      Reading: false,
      Writting: true,
      Speaking: false,
      Status: "",
      DateCreated: "25/02/2021",
      Action: "",
    });
  }

  const columns = [
    {
      title: "Thumbnail",
      dataIndex: "Thumbnail",
      key: "thumbnail",
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "name",
      ...FilterColumn("Name"),
    },
    {
      title: "Type",
      dataIndex: "Type",
      key: "type",
    },
    {
      title: "SET options",
      children: [
        {
          title: "Listening",
          dataIndex: "Listening",
          key: "listening",
          align: "center",
          render: (Listening) =>
            Listening ? (
              <Check className="icon-check" />
            ) : (
              <p className="text-no-ques">No question</p>
            ),
        },
        {
          title: "Reading",
          dataIndex: "Reading",
          key: "reading",
          align: "center",
          render: (Reading) =>
            Reading ? (
              <Check className="icon-check" />
            ) : (
              <p className="text-no-ques">No question</p>
            ),
        },
        {
          title: "Writting",
          dataIndex: "Writting",
          key: "writting",
          align: "center",
          render: (Writting) =>
            Writting ? (
              <Check className="icon-check" />
            ) : (
              <p className="text-no-ques">No question</p>
            ),
        },
        {
          title: "Speaking",
          dataIndex: "Speaking",
          key: "speaking",
          align: "center",
          render: (Speaking) =>
            Speaking ? (
              <Check className="icon-check" />
            ) : (
              <p className="text-no-ques">No question</p>
            ),
        },
      ],
    },
    {
      title: "Status",
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
      render: (Status) => <span className="tag green">Active</span>,
    },
    {
      title: "Date created",
      dataIndex: "DateCreated",
      key: "datecreated",
      align: "center",
      ...FilterDateColumn("DateCreated"),
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "action",
      align: "center",
      render: () => (
        <Link
          href={{
            pathname: "/package/package-create",
            query: { slug: 2 },
          }}
        >
          <a className="btn btn-icon edit">
            <Tooltip title="Chi tiết">
              <EditOutlined />
            </Tooltip>
          </a>
        </Link>
      ),
    },
  ];

  return (
    <>
      <PowerTable
        addClass="basic-header"
        Size="package-list-table"
        haveBorder={true}
        dataSource={data}
        columns={columns}
        TitlePage="Danh sách gói bài tập"
        Extra={
          <div className="extra-table">
            <SortBox dataOption={dataOption} />
          </div>
        }
        TitleCard={
          <Link href="/package/package-create">
            <a className="btn btn-warning">Tạo gói mới</a>
          </Link>
        }
      />
    </>
  );
};

PackageList.propTypes = {};

PackageList.layout = LayoutBase;
export default PackageList;
