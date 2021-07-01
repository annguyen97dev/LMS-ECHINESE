import React, { useState } from "react";
import { Card, Select, DatePicker, Input, Form } from "antd";

const WrapFilter = ({ showFilter }) => {
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

  const teacher = [];
  for (let i = 10; i < 36; i++) {
    teacher.push(
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
          <div className="col-md-4">
            <Form.Item label="Tỉnh thành">
              <Select
                className="style-input"
                showSearch
                placeholder="Tỉnh thành"
                optionFilterProp="children"
                onChange={onChange}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Option value="jack">TP.HCM</Option>
                <Option value="lucy">Hà Nội</Option>
                <Option value="tom">Đà Nẵng</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="col-md-4">
            <Form.Item label="Giáo viên">
              <Select
                className="style-input"
                mode="tags"
                style={{ width: "100%" }}
                onChange={handleChange_StudyTime}
                tokenSeparators={[","]}
              >
                {teacher}
              </Select>
            </Form.Item>
          </div>

          <div className="col-md-2">
            <Form.Item label="Từ">
              <DatePicker className="style-input" onChange={onChange} />
            </Form.Item>
          </div>

          <div className="col-md-2">
            <Form.Item label="Đến">
              <DatePicker className="style-input" onChange={onChange} />
            </Form.Item>
          </div>

          <div className="col-md-12">
            <Form.Item label="Ca học">
              <Select
                className="style-input"
                mode="tags"
                style={{ width: "100%" }}
                onChange={handleChange_StudyTime}
                tokenSeparators={[","]}
              >
                {children}
              </Select>
            </Form.Item>
          </div>

          <div className="col-md-12">
            <Form.Item>
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
