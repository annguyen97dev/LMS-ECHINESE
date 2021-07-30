import { Input, Select, Tooltip } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Link from "next/link";
import React, { Fragment } from "react";
import { Eye } from "react-feather";
import PowerTable from "~/components/PowerTable";
import { dataStudent } from "~/lib/customer/dataStudent";
import NotificationCreate from "./NotificationCreate";

const NotificationCourse = () => {
  const { Option } = Select;
  const columns = [
    { title: "Title", dataIndex: "title" },
    {
      title: "Content",
      dataIndex: "content",
    },
    {
      title: "Create By",
      dataIndex: "createBy",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
  ];

  return (
    <>
      <PowerTable
        TitleCard={
          <>
            <NotificationCreate />
          </>
        }
        noScroll
        dataSource={dataStudent}
        columns={columns}
        Extra="Notification"
      />
    </>
  );
};
export default NotificationCourse;
