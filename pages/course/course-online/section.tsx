import React, { useState } from "react";
import { Input, Card, Button, Tag } from "antd";
import { FormOutlined, EyeOutlined } from "@ant-design/icons";
import TitlePage from "~/components/TitlePage";
import PowerTable from "~/components/PowerTable";
import AddSection from "~/components/Global/CourseOnline/AddSection";
import LayoutBase from "~/components/LayoutBase";
const SectionListing = () => {
  const { Search } = Input;
  const [addSection, setAddSection] = useState(false);

  const onSearch = (value) => console.log(value);
  const data = [
    {
      key: "1",
      section: "Tổng quan khóa học",
      status: "Active",
      users: "Admin",
      createDay: "30/10/2020",
    },
    {
      key: "2",
      section: "Hướng dẫn kỹ năng quản lý cơ bản",
      status: "Active",
      users: "Admin",
      createDay: "30/10/2020",
    },
    {
      key: "3",
      section: "Đào tạo nghiệp vụ quản lý nâng cao",
      status: "Active",
      users: "Admin",
      createDay: "30/10/2020",
    },
    {
      key: "4",
      section: "Áp dụng quản lý thực tế",
      status: "Active",
      users: "Admin",
      createDay: "30/10/2020",
    },
    {
      key: "5",
      section: "Tổng kết khóa học",
      status: "Active",
      users: "Admin",
      createDay: "30/10/2020",
    },
  ];
  const columns = [
    {
      title: "No.",
      dataIndex: "key",
    },
    {
      title: "Section",
      dataIndex: "section",
      render: (section, idx) => {
        return <div>Section: {section}</div>;
      },
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
      title: "Họ và tên",
      dataIndex: "users",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createDay",
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
          <TitlePage title={"Quản lí khóa học"} />
          <div className="wrap-table">
            <Card
              className="cardRadius"
              title={
                <Button type="primary" onClick={() => setAddSection(true)}>
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
      <AddSection
        visible={addSection}
        onCancel={() => setAddSection(false)}
      ></AddSection>
    </>
  );
};

SectionListing.layout = LayoutBase;
export default SectionListing;
