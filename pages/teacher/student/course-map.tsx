import React, { useState } from "react";
import { Input, Card, Button, Tag } from "antd";
import { FormOutlined, EyeOutlined } from "@ant-design/icons";
import TitlePage from "~/components/TitlePage";
import PowerTable from "~/components/PowerTable";
import AddCourseMap from "~/components/Global/CourseOnline/AddCourseMap";
import { Router, useRouter } from "next/router";

const CourseMap = () => {
  const router = useRouter();
  const { Search } = Input;
  const [addCourseMap, setAddCourseMap] = useState(false);
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: `${i + 1}`,
      courseName: `Lộ trình khóa học ${i + 1}`,
      student: `Học sinh ${i + 1}`,
    });
  }
  const columns = [
    {
      title: "No.",
      dataIndex: "key",
    },
    {
      title: "Học viên",
      dataIndex: "student",
    },
    {
      title: "Khóa học",
      dataIndex: "courseName",
    },

    {
      render: () => {
        return (
          <>
            <Button
              style={{ marginLeft: 10 }}
              icon={<EyeOutlined />}
              type="primary"
              onClick={() => router.push("./course-map-detail")}
            >
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
          <TitlePage title={"LỘ TRÌNH HỌC"} />
          <div className="wrap-table">
            <Card
              className="cardRadius"
              title={
                <Button type="primary" onClick={() => setAddCourseMap(true)}>
                  Thêm mới
                </Button>
              }
              extra={
                <Search
                  placeholder="input search text"
                  className="btn-search"
                  size="large"
                />
              }
            >
              <PowerTable columns={columns} dataSource={data} />
            </Card>
          </div>
        </div>
        <AddCourseMap
          visible={addCourseMap}
          onCancel={() => setAddCourseMap(false)}
        />
      </div>
    </>
  );
};

export default CourseMap;
