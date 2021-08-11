import { Input, Select, Tooltip } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Link from "next/link";
import React, { Fragment } from "react";
import { Eye } from "react-feather";
import PowerTable from "~/components/PowerTable";
import { dataStudent } from "~/lib/customer/dataStudent";

const RollUp = () => {
  const { Option } = Select;
  const columns = [
    { title: "Student", dataIndex: "name" },
    {
      title: "Roll up",
      render: () => (
        <div style={{ width: "200px" }}>
          <Select className="style-input w-100" showSearch></Select>
        </div>
      ),
    },
    {
      title: "Capacity",
      render: () => (
        <div style={{ width: "200px" }}>
          <Select className="style-input w-100" showSearch></Select>
        </div>
      ),
    },
    {
      title: "Capacity",
      render: () => (
        <Fragment>
          <Input className="style-input"></Input>
        </Fragment>
      ),
    },
    {
      title: "Warning",
      render: () => (
        <div className="d-flex justify-content-center">
          <Checkbox></Checkbox>
        </div>
      ),
    },
  ];

  return (
    <>
      <PowerTable
        TitleCard={
          <div className="d-flex align-items-center">
            <div className="">
              <b>Roll up history:</b>
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
        Extra={<h5>Roll up</h5>}
      />
    </>
  );
};
export default RollUp;
