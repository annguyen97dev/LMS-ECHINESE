import React, { useState } from "react";
import { Card, Select, DatePicker, Input, Form, Popover } from "antd";
import { Eye, Filter } from "react-feather";
import moment from "moment";
import { useWrap } from "~/context/wrap";

const FilterProgram = (props) => {
  const { handleFilter, dataLevel, handleReset } = props;
  const { showNoti } = useWrap();
  const { RangePicker } = DatePicker;
  const dateFormat = "YYYY/MM/DD";

  const [listFilter, setListFilter] = useState({
    Type: null,
    Level: null,
    fromDate: "",
    toDate: "",
  });
  const [visible, setVisible] = useState(false);

  const { Option } = Select;

  console.log("VAlue: ", listFilter);

  // ------------- ON SUBMIT -----------------
  const onSubmit = () => {
    handleFilter(listFilter);
    setVisible(false);
  };

  // ------------- GET VALUE FILTER ----------------
  const getValueFilter = (value, typeFilter) => {
    console.log("Value: ", value);

    switch (typeFilter) {
      case "select":
        setListFilter({
          ...listFilter,
          Type: value,
        });
        break;

      case "date-range":
        if (value.length > 1) {
          let fromDate = moment(value[0].toDate()).format("YYYY/MM/DD");
          let toDate = moment(value[1].toDate()).format("YYYY/MM/DD");
          setListFilter({
            ...listFilter,
            fromDate: fromDate,
            toDate: toDate,
          });
        } else {
          showNoti("danger", "Chưa chọn đầy đủ ngày");
        }
        break;
      default:
        break;
    }
  };

  const handleChangeFilter = (visible) => {
    setVisible(visible);
  };

  const onReset = () => {
    handleReset();
    setVisible(false);
  };

  const content = (
    <div className={`wrap-filter small`}>
      <Form layout="vertical" onFinish={onSubmit}>
        <div className="row">
          <div className="col-12">
            <Form.Item label="Level">
              <Select
                placeholder="Chọn level.."
                className="style-input"
                onChange={(value) =>
                  setListFilter({
                    ...listFilter,
                    Level: value,
                  })
                }
              >
                {dataLevel.map((item, index) => (
                  <Option key={index} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="col-12">
            <Form.Item label="Loại">
              <Select
                placeholder="Chọn loại.."
                className="style-input"
                onChange={(value) =>
                  setListFilter({
                    ...listFilter,
                    Type: value,
                  })
                }
              >
                <Option value="1">Zoom</Option>
                <Option value="2">Offline</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="col-12">
            <Form.Item label="Từ - Đến">
              <RangePicker
                format={dateFormat}
                onChange={(value) => getValueFilter(value, "date-range")}
              />
            </Form.Item>
          </div>

          <div className="col-md-12">
            <Form.Item className="mb-0">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginRight: "10px" }}
              >
                Tìm kiếm
              </button>
              <button
                type="button"
                className="light btn btn-secondary"
                style={{ marginRight: "10px" }}
                onClick={onReset}
              >
                Reset
              </button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );

  return (
    <>
      <Popover
        visible={visible}
        placement="bottomRight"
        content={content}
        trigger="click"
        overlayClassName="filter-popover"
        onVisibleChange={handleChangeFilter}
      >
        <button className="btn btn-secondary light btn-filter">
          <Filter />
        </button>
      </Popover>
    </>
  );
};

export default FilterProgram;
