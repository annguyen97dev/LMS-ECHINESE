import { Card, Select, Input } from "antd";

const ActionTable = () => {
  const { Search } = Input;
  const { Option } = Select;
  const onSearch = (value) => console.log(value);
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  return (
    <div className="list-action-table">
      <Select
        defaultValue="sort-title"
        style={{ width: 120 }}
        onChange={handleChange}
        size="large"
      >
        <Option value="sort-title">Sort by</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="disabled" disabled>
          Disabled
        </Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>

      <Search
        placeholder="input search text"
        onSearch={onSearch}
        className="btn-search"
        size="large"
      />
    </div>
  );
};

export default ActionTable;
