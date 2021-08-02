import React from "react";
import PowerTable from "~/components/PowerTable";
import { data } from "../../../lib/option/dataOption2";
import FilterColumn from "~/components/Tables/FilterColumn";
import LayoutBase from "~/components/LayoutBase";
import ConfigZoomForm from "~/components/Global/Course/ConfigZoomForm";

const TeacherConfigZoom = () => {
  const columns = [
    {
      title: "Giáo viên",
      dataIndex: "teacherName",
      // ...FilterColumn("teacherName"),
    },
    { title: "Số điện thoại", dataIndex: "tel" },
    { title: "API Key", dataIndex: "apiKey" },
    {
      title: "API Secrect",
      dataIndex: "apiSr",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "dateMod",
    },
    {
      render: () => (
        <>
          <ConfigZoomForm showIcon={true} />
        </>
      ),
    },
  ];

  return (
    <PowerTable
      addClass="basic-header"
      TitlePage="Danh sách cấu hình"
      TitleCard={<ConfigZoomForm showAdd={true} />}
      dataSource={data}
      columns={columns}
    />
  );
};
TeacherConfigZoom.layout = LayoutBase;
export default TeacherConfigZoom;
