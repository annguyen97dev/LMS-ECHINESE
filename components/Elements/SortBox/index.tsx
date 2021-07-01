import { Card, Select, Input } from "antd";

const SortBox = (props) => {
  const { Option } = Select;
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  return (
    <>
      <Select
        style={{ marginLeft: props.space ? "10px" : "", width: 120 }}
        className="style-input"
        defaultValue="sort-title"
        onChange={handleChange}
        size="large"
      >
        <Option value="sort-title">-- Sort by --</Option>
        {props.dataOption?.length > 0 &&
          props.dataOption.map((option, index) => (
            <Option value={option.value}>{option.text}</Option>
          ))}
      </Select>
    </>
  );
};

export default SortBox;
