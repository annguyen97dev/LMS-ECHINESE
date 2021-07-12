import { Card, Select, Input } from "antd";

const SortBox = (props: any) => {
  const { Option } = Select;
  const { dataOption, handleSort } = props;

  function handleChange(value, option) {
    if (!handleSort) return;
    handleSort(option);
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
          dataOption.map((option: any, index) => (
            <Option title={option.dataSort} value={option.value} key={index}>
              {option.text}
            </Option>
          ))}
      </Select>
    </>
  );
};

export default SortBox;
