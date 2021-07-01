import { Select } from "antd";

const SelectFilterBox = (props) => {
  const { Option } = Select;

  console.log("DATA: ", props.dataCity);

  function onChange(value) {
    console.log(`selected ${value}`);
  }

  function onBlur() {
    console.log("blur");
  }

  function onFocus() {
    console.log("focus");
  }

  function onSearch(val) {
    console.log("search:", val);
  }

  return (
    <Select
      style={{ width: "100%" }}
      className="style-input"
      showSearch
      placeholder="Select..."
      optionFilterProp="children"
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onSearch={onSearch}
      //   filterOption={(input, option) =>
      //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      //   }
    >
      {props.data?.map((item) => (
        <Option value={item.value}>{item.Text}</Option>
      ))}
    </Select>
  );
};

export default SelectFilterBox;
