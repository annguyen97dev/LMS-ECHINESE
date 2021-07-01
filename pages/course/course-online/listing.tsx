import React, { useState } from "react";
import { Input, Card, Button, Tag } from "antd";
import { FormOutlined, EyeOutlined } from "@ant-design/icons";
import TitlePage from "~/components/TitlePage";
import PowerTable from "~/components/PowerTable";
import AddCourse from "~/components/Global/CourseOnline/AddCourse";
import LayoutBase from "~/components/LayoutBase";
const CourseListing = () => {
  const { Search } = Input;
  const [addCourse, setAddCourse] = useState(false);
  console.log(addCourse);
  const onSearch = (value) => console.log(value);
  const data = [
    {
      key: "1",
      name: "Khóa học Javascript 1",
      description: "Mô tả nội dung khóa học tại đây",
      cost: 2000000,
      users: "Admin",
      status: "Active",
      day: "24/08/2020",
    },
    {
      key: "2",
      name: "Khóa học Javascript 2",
      description: "Mô tả nội dung khóa học tại đây",
      cost: 2000000,
      users: "Admin",
      status: "Active",
      day: "24/08/2020",
    },
    {
      key: "3",
      name: "	Khóa học Javascript 3",
      description: "Mô tả nội dung khóa học tại đây",
      cost: 3000000,
      users: "Admin",
      status: "Active",
      day: "24/08/2020",
    },
  ];
  const columns = [
    {
      title: "No.",
      dataIndex: "key",
    },
    {
      title: "Tên khóa học",
      dataIndex: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
    },
    {
      title: "Giá tiền",
      dataIndex: "cost",
    },
    {
      title: "Họ và tên",
      dataIndex: "users",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        let color = status == "Active" ? "green" : "volcano";
        return (
          <Tag color={color} key={status}>
            <b> {status.toUpperCase()}</b>
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "day",
    },
    {
      render: () => {
        return (
          <>
            <Button type="primary" icon={<FormOutlined />}>
              Update
            </Button>
            <Button style={{ marginLeft: 10 }} icon={<EyeOutlined />}>
              Detail
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-12">
          <TitlePage title="Danh sách khóa học" />
          <div className="wrap-table">
            <Card
              className="cardRadius"
              title={
                <Button type="primary" onClick={() => setAddCourse(true)}>
                  Thêm mới
                </Button>
              }
              extra={
                <Search
                  placeholder="input search text"
                  onSearch={onSearch}
                  className="btn-search"
                  size="large"
                />
              }
            >
              <PowerTable columns={columns} dataSource={data} />
            </Card>
          </div>
        </div>
      </div>
      <AddCourse
        visible={addCourse}
        onCancel={() => setAddCourse(false)}
      ></AddCourse>
    </>
  );
};

CourseListing.layout = LayoutBase;
export default CourseListing;
