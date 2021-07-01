import { Table, Tag, Space, Card, Button, Select, Input } from "antd";
import TitlePage from "~/components/Elements/TitlePage";
import SearchBox from "~/components/Elements/SearchBox";
import { PlusOutlined } from "@ant-design/icons";
import LayoutBase from "~/components/LayoutBase";

export default function Tables() {
  // Search //

  const { Search } = Input;
  const onSearch = (value) => console.log(value);

  // Table //
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sidney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-12">
          <TitlePage title={"Tables"} />
          <div className="wrap-table">
            <Card
              className="card-radius"
              title={
                <Button type="primary" className="btn-add">
                  <PlusOutlined />
                  Thêm item
                </Button>
              }
              extra={<SearchBox />}
            >
              <Table columns={columns} dataSource={data} />
            </Card>
          </div>
        </div>
      </div>
      <div className="space-between"></div>
      <div className="row">
        <div className="col-12">
          <div className="wrap-table">
            <Card
              className="cardRadius"
              title="Table name"
              extra={<SearchBox />}
            >
              <Table columns={columns} dataSource={data} />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

Tables.layout = LayoutBase;
