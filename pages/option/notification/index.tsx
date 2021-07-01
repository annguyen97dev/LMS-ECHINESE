import React from "react";
import { data } from "../../../lib/option/dataOption2";
import NotificationForm from "~/components/Global/Option/NotificationForm";
import ExpandTable from "~/components/ExpandTable";
import { CheckCircle } from "react-feather";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import SortBox from "~/components/Elements/SortBox";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import LayoutBase from "~/components/LayoutBase";

const Notification = () => {
  const expandedRowRender = () => {
    return (
      <div>
        Tuần tới đội chuyên môn HN sẽ họp tại tầng 8 CS Thái Hà. Thời gian: 10h
        sáng thứ 2 (26/10) Nội dung: Phát triển trong môi trường ZIM và những kĩ
        năng cần thiết.
      </div>
    );
  };
  const columns = [
    { title: "Date", dataIndex: "expires", ...FilterDateColumn("expires") },
    {
      title: "Role",
      dataIndex: "teacher",
      ...FilterColumn("teacher"),
      render: (teacher) => <span className="tag yellow">{teacher}</span>,
    },
    { title: "Center", dataIndex: "center", ...FilterColumn("center") },
    {
      title: "Email",
      dataIndex: "postStatus",
      render: (postStatus) => {
        if (postStatus % 2 == 0) {
          return <CheckCircle color="#06d6a0" />;
        }
      },
    },
    { title: "Title", dataIndex: "title" },
  ];

  return (
    <ExpandTable
      addClass="basic-header"
      TitlePage="Notification List"
      expandable={{ expandedRowRender }}
      TitleCard={<NotificationForm showAdd={true} />}
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
Notification.layout = LayoutBase;
export default Notification;
