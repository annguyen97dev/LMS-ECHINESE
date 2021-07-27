import React, { useState } from "react";
import { Card, Select, DatePicker, Input, Form, Popover } from "antd";
import { Eye, Filter } from "react-feather";
import moment from "moment";
import { useWrap } from "~/context/wrap";

const FilterBase = (props) => {
  const { dataFilter } = props;
  console.log("DATA filter: ", dataFilter);
  const { handleFilter, handleReset } = props;
  const { showNoti } = useWrap();
  const { RangePicker } = DatePicker;

  const [listFilter, setListFilter] = useState(dataFilter);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const { Option } = Select;
  const dateFormat = "YYYY/MM/DD";
  console.log("List Filter: ", listFilter);

  // ------------ RESET FILTER -------------
  const resetFilter = () => {
    let newFilter = listFilter.map((item) => {
      item.value = null;
      return item;
    });
    setListFilter(newFilter);
  };

  // ------------- ON SUBMIT -----------------
  const onSubmit = () => {
    handleFilter(listFilter);
    resetFilter();
    form.resetFields();
    setVisible(false);
  };

  // ------------- RETURN NAME FILTER --------------
  const returnListFilter = (value, nameFilter) => {
    listFilter.every((item, index) => {
      if (item.name == nameFilter) {
        item.value = value;
        return false;
      }
      return true;
    });
    setListFilter([...listFilter]);
  };

  // ------------- GET VALUE FILTER ----------------
  const getValueFilter = (value, typeFilter, nameFilter) => {
    console.log("getValueFilter: ", value);

    switch (typeFilter) {
      case "date-range":
        if (value.length > 1) {
          let fromDate = moment(value[0].toDate()).format("YYYY/MM/DD");
          let toDate = moment(value[1].toDate()).format("YYYY/MM/DD");
          let valueFromDate = {
            name: "fromDate",
            value: fromDate,
          };
          let valueToDate = {
            name: "toDate",
            value: toDate,
          };
          listFilter.push(valueFromDate, valueToDate);
          setListFilter([...listFilter]);
        } else {
          showNoti("danger", "Chưa chọn đầy đủ ngày");
        }
        break;
      default:
        returnListFilter(value, nameFilter);
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

  const fieldOfFilter = (item) => {
    switch (item.type) {
      case "select":
        return (
          <div className={item.col}>
            <Form.Item name={item.name} label={item.title}>
              <Select
                style={{ width: "100%" }}
                className="style-input"
                showSearch
                optionFilterProp="children"
                onChange={(value) => getValueFilter(value, "select", item.name)}
              >
                {item.optionList?.map((item, index) => (
                  <Option key={index} value={item.value}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        );
      case "text":
        return (
          <div className={item.col}>
            <Form.Item name={item.name} label={item.title}>
              <Input
                placeholder=""
                className="style-input"
                onChange={(e) =>
                  getValueFilter(e.target.value, "text", item.name)
                }
                allowClear={true}
              />
            </Form.Item>
          </div>
        );
      case "date-range":
        return (
          <div className={item.col}>
            <Form.Item name={item.name} label={item.title}>
              <RangePicker
                format={dateFormat}
                onChange={(value) =>
                  getValueFilter(value, "date-range", item.name)
                }
              />
            </Form.Item>
          </div>
        );
        break;

      default:
        break;
    }
  };

  const content = (
    <div className={`wrap-filter small`}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <div className="row">
          {dataFilter.map((item, index) => fieldOfFilter(item))}

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

export default FilterBase;
