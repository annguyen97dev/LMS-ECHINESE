import React from "react";
import { data } from "~/components/Dashboard/data";
import PowerTable from "~/components/PowerTable";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import ModalAdd from "~/components/Global/ExaminerList/ModalAdd";
import SortBox from "~/components/Elements/SortBox";

import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";

import { Eye, Filter, Search } from "react-feather";
import DecideModal from "~/components/Elements/DecideModal";
import LayoutBase from "~/components/LayoutBase";

const ExaminerList = () => {
  const dataSource = [];

  for (let i = 0; i < 50; i++) {
    dataSource.push({
      key: i,
      TeacherName: "Vân Anh",
      TeacherPhone: "01208399931",
      Action: "",
    });
  }

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

  const columns = [
    {
      title: "Teacher Name",
      dataIndex: "TeacherName",
      key: "teachername",
      ...FilterColumn("TeacherName"),
    },
    {
      title: "Teacher Phone",
      dataIndex: "TeacherPhone",
      key: "teacherphone",
      ...FilterColumn("TeacherPhone"),
    },
    {
      title: "",
      dataIndex: "Action",
      key: "action",
      align: "center",
      width: "50px",
      render: () => (
        // <button className="btn btn-icon delete">
        //   <DeleteOutlined />
        // </button>
        <DecideModal
          addBtn={
            <button className="btn btn-icon delete">
              <DeleteOutlined />
            </button>
          }
          content="Bạn có chắc muốn xóa?"
          addClass="color-red"
        />
      ),
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-12">
          <PowerTable
            addClass="basic-header"
            Size="table-small"
            dataSource={dataSource}
            columns={columns}
            TitlePage="List Examiner"
            TitleCard={<ModalAdd />}
            Extra={<SortBox />}
          />
        </div>
      </div>
    </>
  );
};
ExaminerList.layout = LayoutBase;
export default ExaminerList;
