import React, { useState } from "react";
import { Input, Card, Button, Tag, Rate } from "antd";
import { FormOutlined, EyeOutlined } from "@ant-design/icons";
import TitlePage from "~/components/TitlePage";
import PowerTable from "~/components/PowerTable";
// import AddLesson from "~/components/Global/CourseOnline/AddLesson";
import LayoutBase from "~/components/LayoutBase";

const LessonListing = () => {
  const { Search } = Input;
  const [addLesson, setAddLesson] = useState(false);
  const onSearch = (value) => console.log(value);
  const data = [
    {
      key: "1",
      name: "Cơ cấu phòng và dịch vụ của phòng 1",
      timeOut: 10,
      status: "Active",
      rate: "",
      users: "Admin",
      day: "24/08/2020",
    },
    {
      key: "2",
      name: "Cơ cấu phòng và dịch vụ của phòng 2",
      timeOut: 10,
      status: "Active",
      rate: "",
      users: "Admin",
      day: "24/08/2020",
    },
    {
      key: "3",
      name: "Cơ cấu phòng và dịch vụ của phòng 3",
      timeOut: 10,
      status: "Active",
      rate: "",
      users: "Admin",
      day: "24/08/2020",
    },
    {
      key: "4",
      name: "Cơ cấu phòng và dịch vụ của phòng 4",
      timeOut: 10,
      status: "Active",
      rate: "",
      users: "Admin",
      day: "24/08/2020",
    },
    {
      key: "5",
      name: "Cơ cấu phòng và dịch vụ của phòng 5",
      timeOut: 10,
      status: "Active",
      rate: "",
      users: "Admin",
      day: "24/08/2020",
    },
    {
      key: "6",
      name: "Cơ cấu phòng và dịch vụ của phòng 6",
      timeOut: 10,
      status: "Active",
      rate: "",
      users: "Admin",
      day: "24/08/2020",
    },
    {
      key: "7",
      name: "Cơ cấu phòng và dịch vụ của phòng 7",
      timeOut: 10,
      status: "Active",
      rate: "",
      users: "Admin",
      day: "24/08/2020",
    },
    {
      key: "8",
      name: "Cơ cấu phòng và dịch vụ của phòng 8",
      timeOut: 10,
      status: "Active",
      rate: "",
      users: "Admin",
      day: "24/08/2020",
    },
    {
      key: "9",
      name: "Cơ cấu phòng và dịch vụ của phòng 9",
      timeOut: 10,
      status: "Active",
      rate: "",
      users: "Admin",
      day: "24/08/2020",
    },
    {
      key: "10",
      name: "Cơ cấu phòng và dịch vụ của phòng 10",
      timeOut: 10,
      status: "Active",
      rate: "",
      users: "Admin",
      day: "24/08/2020",
    },
    {
      key: "11",
      name: "Cơ cấu phòng và dịch vụ của phòng 11",
      timeOut: 10,
      status: "Active",
      rate: "",
      users: "Admin",
      day: "24/08/2020",
    },
    {
      key: "12",
      name: "Cơ cấu phòng và dịch vụ của phòng 12",
      timeOut: 10,
      status: "Active",
      rate: "",
      users: "Admin",
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
      title: "Time out",
      dataIndex: "timeOut",
      render: (timeOut) => {
        return <div>{timeOut} phút</div>;
      },
    },
    {
      title: "Học viên",
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
      title: "Đánh giá",
      dataIndex: "rate",
      render: () => {
        return <Rate />;
      },
    },

    {
      title: "Họ và tên",
      dataIndex: "users",
    },
    {
      title: "Ngày tạo",
      dataIndex: "day",
    },

    {
      render: () => {
        return (
          <>
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
          <TitlePage title="Danh sách bài học" />
          <div className="wrap-table">
            <Card
              className="cardRadius"
              title={
                <Button type="primary" onClick={() => setAddLesson(true)}>
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
      {/* <AddLesson
        visible={addLesson}
        onCancel={() => setAddLesson(false)}
      ></AddLesson> */}
    </>
  );
};

LessonListing.layout = LayoutBase;
export default LessonListing;
