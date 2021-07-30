import { Input, Select, Tooltip } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Link from "next/link";
import React, { Fragment } from "react";
import { Eye } from "react-feather";
import PowerTable from "~/components/PowerTable";
import { dataStudent } from "~/lib/customer/dataStudent";

const Exam = () => {
  const { Option } = Select;
  const columns = [
    { title: "Student", dataIndex: "name" },
    {
      title: "Listening",
      render: () => (
        <div style={{ width: "80px" }}>
          <Input className="style-input" placeholder="0"></Input>
        </div>
      ),
    },
    {
      title: "Speaking",
      render: () => (
        <div style={{ width: "80px" }}>
          <Input className="style-input" placeholder="0"></Input>
        </div>
      ),
    },
    {
      title: "Reading",
      render: () => (
        <div style={{ width: "80px" }}>
          <Input className="style-input" placeholder="0"></Input>
        </div>
      ),
    },
    {
      title: "Writing",
      render: () => (
        <div style={{ width: "80px" }}>
          <Input className="style-input" placeholder="0"></Input>
        </div>
      ),
    },
    {
      title: "OverAll",
      render: () => (
        <div style={{ width: "80px" }}>
          <Input className="style-input" placeholder="0"></Input>
        </div>
      ),
    },
    {
      title: "Noted",
      render: () => (
        <Fragment>
          <div>
            <Input className="style-input"></Input>
          </div>
          <div className="pt-2">
            <Select showSearch className="style-input w-100" />
          </div>
        </Fragment>
      ),
    },
  ];

  return (
    <>
      <PowerTable
        TitleCard={
          <div className="d-flex align-items-center">
            <div className="">
              <b>History:</b>
            </div>
            <div>
              <Select
                showSearch
                className="style-input"
                style={{ width: "250px", paddingLeft: "20px" }}
              />
            </div>
          </div>
        }
        noScroll
        dataSource={dataStudent}
        columns={columns}
        Extra={
          <div className="d-flex align-items-center">
            <div className="">
              <b>Exam:</b>
            </div>
            <div style={{ width: "250px", paddingLeft: "20px" }}>
              <Input className="style-input" />
            </div>
          </div>
        }
      />
      <div className="d-flex justify-content-end mt-2">
        <button className="btn btn-warning add-new ">Submit</button>
      </div>
    </>
  );
};
export default Exam;
