import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Space } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

const FilterColumn = (dataIndex, handleSearch, handleReset, type = "text") => {
  const [isVisible, setIsVisible] = useState(false);
  const [valueSearch, setValueSearch] = useState<any>(null);
  const { RangePicker } = DatePicker;
  const inputRef = useRef<any>(null);

  const getValueSearch = (value) => {
    setValueSearch(value);
  };

  const checkHandleSearch = (value) => {
    if (!handleSearch) return;
    if (!valueSearch) return;

    switch (type) {
      case "text":
        handleSearch(value, dataIndex);
        break;
      case "date":
        value = moment(valueSearch.toDate()).format("YYYY/MM/DD");
        handleSearch(value, dataIndex);
        break;
      case "date-range":
        let fromDate = moment(valueSearch[0].toDate()).format("YYYY/MM/DD");
        let toDate = moment(valueSearch[1].toDate()).format("YYYY/MM/DD");
        let listRange = {
          fromDate: fromDate,
          toDate: toDate,
        };
        console.log("List Range: ", listRange);
        handleSearch(listRange, dataIndex);
        break;
      default:
        break;
    }

    getValueSearch(null);
    setIsVisible(false);
  };

  const checkHandleReset = () => {
    if (!handleReset) return;
    handleReset();
    getValueSearch(null);
    setIsVisible(false);
  };

  const checkType = () => {
    let fControl;
    switch (type) {
      case "text":
        fControl = (
          <Input
            ref={inputRef}
            value={valueSearch}
            placeholder={`Search ${dataIndex}`}
            onPressEnter={(e) => checkHandleSearch(valueSearch)}
            onChange={(e) => getValueSearch(e.target.value)}
            style={{ marginBottom: 8, display: "block" }}
          />
        );
        break;
      case "date":
        fControl = (
          <DatePicker
            style={{ marginBottom: 8, display: "block" }}
            autoFocus={true}
            format="DD/MM/YYYY"
            onChange={(date, dateString) => getValueSearch(date)}
          />
        );
        break;
      case "date-range":
        fControl = (
          <div style={{ marginBottom: 8, display: "block" }}>
            <RangePicker
              format="DD/MM/YYYY"
              autoFocus={true}
              ranges={{
                Today: [moment(), moment()],
                "This Month": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
              }}
              onChange={(date, dateString) => getValueSearch(date)}
            />
          </div>
        );
        break;
      default:
        break;
    }
    return fControl;
  };
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        inputRef.current?.select?.();
      }, 100);
    }
  }, [isVisible]);
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: () => (
      <div style={{ padding: 8 }}>
        {checkType()}
        <Space>
          <Button
            type="primary"
            onClick={() => checkHandleSearch(valueSearch)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={checkHandleReset} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterDropdownVisible: isVisible,
    filterIcon: (filtered) => <SearchOutlined />,
    onFilterDropdownVisibleChange: (visible) => {
      visible ? setIsVisible(true) : setIsVisible(false);
    },
  });

  return getColumnSearchProps(dataIndex);
};

export default FilterColumn;
