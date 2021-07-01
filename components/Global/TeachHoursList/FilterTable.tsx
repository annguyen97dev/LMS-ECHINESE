import React, { useState } from "react";
import { Card, Select, DatePicker, Input, Form, Popover } from "antd";
import { Eye, Filter } from "react-feather";

const FilterTable = () => {
  const { Option } = Select;
  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  function onChange(date, dateString) {
    console.log(date, dateString);
  }

  const content = (
    <div className={`wrap-filter small`}>
      <Form layout="vertical">
        <div className="row">
          <div className="col-md-12">
            <Form.Item label="Từ ngày">
              <DatePicker className="style-input" onChange={onChange} />
            </Form.Item>
          </div>

          <div className="col-md-12">
            <Form.Item label="Đến ngày">
              <DatePicker className="style-input" onChange={onChange} />
            </Form.Item>
          </div>

          <div className="col-md-12">
            <Form.Item className="mb-0">
              <button
                className="btn btn-primary"
                style={{ marginRight: "10px" }}
              >
                Tìm kiếm
              </button>
              <button className="btn btn-success">Export</button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );

  return (
    <Popover
      placement="bottomRight"
      content={content}
      trigger="click"
      overlayClassName="filter-popover"
    >
      <button className="btn btn-secondary light btn-filter">
        <Filter />
      </button>
    </Popover>
  );
};

export default FilterTable;
