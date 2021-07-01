import React, { useState } from "react";
import { Card, Select, DatePicker, Input, Form, Popover } from "antd";

const ScheduleTeacher = (props) => {
  const [showFilter, showFilterSet] = useState(false);

  const funcShowFilter = () => {
    showFilter ? showFilterSet(false) : showFilterSet(true);
  };
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

  const content = (
    <div className={`wrap-filter small`}>
      <Form layout="vertical">
        <div className="row">
          <div className="col-md-12">
            <Form.Item label="Giáo viên">
              <Select
                showSearch
                className="style-input"
                defaultValue="lucy"
                onChange={handleChange}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="col-md-12">
            <Form.Item label="Từ">
              <DatePicker className="style-input" onChange={onChange} />
            </Form.Item>
          </div>

          <div className="col-md-12">
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
            <Form.Item className="mb-0">
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

  return (
    <>
      <div className="wrap-filter-parent">
        <Popover
          placement="bottomLeft"
          content={content}
          trigger="click"
          overlayClassName="filter-popover"
        >
          <button className="btn btn-success light" onClick={funcShowFilter}>
            Kiểm tra lịch giáo viên
          </button>
        </Popover>
      </div>
    </>
  );
};

export default ScheduleTeacher;
