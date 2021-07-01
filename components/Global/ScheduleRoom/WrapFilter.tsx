import React, { useState } from "react";
import { Card, Select, DatePicker, Input, Form } from "antd";

const WrapFilter = (props) => {
  const { Option } = Select;
  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  function onChange(date, dateString) {
    console.log(date, dateString);
  }

  const children = [];
  for (let i = 10; i < 36; i++) {
    children.push(
      <Option value={i.toString(36) + i} key={i.toString(36) + i}>
        {i.toString(36) + i}
      </Option>
    );
  }

  function handleChange_StudyTime(value) {
    console.log(`selected ${value}`);
  }

  return (
    <div className={`wrap-filter show`}>
      <Form layout="vertical">
        <div className="row">
          <div className="col-md-3">
            <Form.Item label="Trung tâm">
              <Select
                showSearch
                className="style-input"
                defaultValue="hi"
                onChange={handleChange}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Option value="jack">Jim - Trần Phú</Option>
                <Option value="lucy">Jim - Ngô Quyền</Option>
                <Option value="hi">Jim - Nguyễn Trãi</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="col-md-3">
            <Form.Item label="Từ">
              <DatePicker className="style-input" onChange={onChange} />
            </Form.Item>
          </div>

          <div className="col-md-3">
            <Form.Item label="Đến">
              <DatePicker className="style-input" onChange={onChange} />
            </Form.Item>
          </div>

          <div className="col-md-3">
            <Form.Item label="Thao tác">
              <button
                className="btn btn-primary"
                style={{ marginRight: "10px" }}
              >
                Kiểm tra
              </button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default WrapFilter;
