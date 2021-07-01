import React, { useState } from "react";
import { Filter } from "react-feather";
import { Select, Form, DatePicker } from "antd";

const FilterBox = () => {
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

  return (
    <>
      <button
        className="btn btn-secondary light btn-filter"
        onClick={funcShowFilter}
      >
        <Filter />
      </button>
      <div className={`wrap-filter show`}>
        <Form layout="vertical">
          <div className="row">
            <div className="col-md-4">
              <Form.Item label="Trung tâm">
                <Select
                  className="style-input"
                  defaultValue="lucy"
                  onChange={handleChange}
                >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="disabled" disabled>
                    Disabled
                  </Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              </Form.Item>
            </div>

            <div className="col-md-4">
              <Form.Item label="Ca học">
                <Select
                  className="style-input"
                  defaultValue="lucy"
                  onChange={handleChange}
                >
                  <Option value="jack">Ca 1</Option>
                  <Option value="lucy">Ca 2</Option>
                  <Option value="disabled" disabled>
                    Ca 3
                  </Option>
                  <Option value="Yiminghe">Ca 4</Option>
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
              <Form.Item label="Phòng">
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
    </>
  );
};

export default FilterBox;
