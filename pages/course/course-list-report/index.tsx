import { Card, Table, Tag } from "antd";
import ActionTable from "~/components/ActionTable";
import SearchBox from "~/components/Elements/SearchBox";
import TitlePage from "~/components/Elements/TitlePage";
import SortBox from "~/components/Elements/SortBox";
import { Filter } from "react-feather";
import Link from "next/link";

import React, { useState } from "react";

import CourseListContent from "~/components/Global/CourseList/CourseListContent";
import FilterTable from "~/components/Global/CourseListReport/FilterTable";
import PowerTable from "~/components/PowerTable";
import { table } from "console";

import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";

import LayoutBase from "~/components/LayoutBase";

const CourseListReport = () => {
  const columns = [
    {
      title: "Tên khóa",
      dataIndex: "CourseName",
      key: "coursename",
      width: 450,
      ...FilterColumn("CourseName"),
      render: (text) => (
        <a className="color-primary" style={{ fontWeight: 500 }}>
          {text}
        </a>
      ),
    },
    {
      title: "Cơ sở",
      dataIndex: "Address",
      key: "address",
      width: 370,
      ...FilterColumn("Address"),
    },
    {
      title: "Tình trạng",
      dataIndex: "Status",
      key: "status",
      filters: [
        {
          text: "Đang mở",
          value: "active",
        },
        {
          text: "Chưa mở",
          value: "unactive",
        },
      ],
      onFilter: (value, record) => record.Status.indexOf(value) === 0,
      render: (Status) => {
        let color = "";
        let text = "";
        if (Status === "close") {
          color = "red";
          text = "Chưa mở";
        }
        if (Status === "open") {
          color = "green";
          text = "Đang mở";
        }
        return <span className={`tag ${color}`}>{text}</span>;
      },
    },
    {
      title: "Giá khóa",
      key: "pricecourse",
      dataIndex: "PriceCourse",
      width: 250,
    },
    {
      title: "Học viên",
      key: "student",
      dataIndex: "Student",
      align: "center",
    },
    {
      title: "Đã thu",
      dataIndex: "PriceReceived",
      key: "pricereceived",
      render: (text) => (
        <p style={{ fontWeight: 500, color: "#636363", marginBottom: 0 }}>
          {text}
        </p>
      ),
    },
    {
      title: "nợ",
      dataIndex: "Debt",
      key: "debt",
      render: (text) => (
        <p style={{ fontWeight: 500, color: "#636363", marginBottom: 0 }}>
          {text}
        </p>
      ),
    },
    {
      title: () => (
        <p className="mb-0">
          Tổng số <br /> buổi học
        </p>
      ),
      dataIndex: "TotalStudyDay",
      key: "totalstudyday",
      width: 200,
      align: "center",
    },
    {
      title: "Số buổi học",
      dataIndex: "StudyDay",
      key: "studyday",
      width: 150,
      align: "center",
    },
    {
      title: "Ngày khai giảng",
      dataIndex: "StartDay",
      key: "startday",
      ...FilterDateColumn("StartDay"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "EndDay",
      key: "enday",
      ...FilterDateColumn("EndDay"),
    },
  ];

  const dataOption = [
    {
      text: "Trung tâm A - Z",
      value: "option 1",
    },
    {
      text: "Trung tâm Z - A",
      value: "option 2",
    },
    {
      text: "Ngày mở(tăng) ",
      value: "option 3",
    },
    {
      text: "Ngày mở(giảm) ",
      value: "option 3",
    },
    {
      text: "Giá tiền(tăng) ",
      value: "option 3",
    },
    {
      text: "Giá tiền(giảm) ",
      value: "option 3",
    },
  ];

  const data = [];

  for (let i = 0; i < 50; i++) {
    data.push({
      key: i,
      CourseName:
        "[ZIM - 1A - 1B Dân Chủ] - AS - Pronunciation, 03/04, 18:30-20:30,",
      Address: "ZIM - 1A - 1B Dân Chủ",
      Status: i % 2 == 0 ? "close" : "open",
      PriceCourse: "2,950,000",
      Student: i + 20,
      PriceReceived: "3,500,000",
      Debt: "	-550,000",
      TotalStudyDay: i + 30,
      StudyDay: i + 25,
      StartDay: "03-04-2021",
      EndDay: "10-07-2021",
    });
  }

  const [showFilter, showFilterSet] = useState(false);

  const funcShowFilter = () => {
    showFilter ? showFilterSet(false) : showFilterSet(true);
  };

  return (
    <div className="course-list-page">
      <PowerTable
        TitlePage="Danh sách khóa học - báo cáo"
        dataSource={data}
        columns={columns}
        Extra={
          <div className="extra-table">
            <FilterTable />
            <SortBox dataOption={dataOption} />
          </div>
        }
      />
    </div>
  );
};

CourseListReport.layout = LayoutBase;
export default CourseListReport;
