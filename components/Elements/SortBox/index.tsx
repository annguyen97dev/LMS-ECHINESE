import { Card, Select, Input } from "antd";

const SortBox = (props: any) => {
  const { Option } = Select;
  const { dataOption, handleSort } = props;

  function handleChange(value) {
    handleSort(value);
  }

  return (
    <>
      <Select
        style={{ marginLeft: props.space ? "10px" : "", width: 120 }}
        className="style-input"
        // defaultValue="sort-title"
        placeholder="Sort By"
        onChange={handleChange}
        size="large"
      >
        {/* <Option value="sort-title">-- Sort by --</Option> */}
        {dataOption?.length > 0 &&
          dataOption.map((option: any) => (
            <Option value={option.value}>{option.text}</Option>
          ))}
      </Select>
    </>
  );
};

export default SortBox;
