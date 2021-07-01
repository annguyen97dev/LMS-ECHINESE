import React, { useState } from "react";
import { Table, Card, Tag } from "antd";

import SearchBox from "~/components/Elements/SearchBox";
import Link from "next/link";
import PowerTable from "~/components/PowerTable";
import SortBox from "~/components/Elements/SortBox";
import LayoutBase from "~/components/LayoutBase";
const dataSource = [
  {
    key: "1",
    Student: "Hùng Nguyễn",
    Type: "Đăng ký thi IELTS/Thi Thử IELTS",
    Homework: "Bài random lần thứ: 48",
    TVV: "Nguyễn An",
    Checker: "Mr.Andy",
    Status: "",
    Action: "",
    Remark: 5,
  },
];

const columns = [
  {
    title: "Học viên",
    dataIndex: "Student",
    key: "student",
  },
  {
    title: "Loại",
    dataIndex: "Type",
    key: "namestaff",
  },
  {
    title: "",
    dataIndex: "Homework",
    key: "homework",
  },
  {
    title: "Người kiểm tra",
    dataIndex: "Checker",
    key: "checker",
  },

  {
    title: "Trạng thái",
    dataIndex: "Status",
    key: "status",
    render: (Status) => <Tag color="blue">New</Tag>,
  },
  {
    title: "Đánh giá",
    dataIndex: "Remark",
    key: "remark",
  },
  {
    title: "Thao tác",
    dataIndex: "Action",
    key: "action",
    render: (Action) => (
      <Link
        href={{
          pathname: "/staff/saler-list/detail/[slug]",
          query: { slug: 2 },
        }}
      >
        <a className="btn btn-primary">View</a>
      </Link>
    ),
  },
];

const FeedbackListCheck = () => {
  return (
    <>
      <PowerTable
        columns={columns}
        dataSource={dataSource}
        TitlePage="Danh sách feedback"
        TitleCard={<button className="btn btn-primary">Thêm mới</button>}
        Extra={
          <div className="extra-table">
            <SortBox />
            <SearchBox />
          </div>
        }
      />
    </>
  );
};

FeedbackListCheck.layout = LayoutBase;
export default FeedbackListCheck;
