import React, { useState } from "react";
import { Input, Card, Button, Tag } from "antd";
import { FormOutlined, EyeOutlined } from "@ant-design/icons";
import TitlePage from "~/components/TitlePage";
import PowerTable from "~/components/PowerTable";
import AddPromotion from "~/components/Global/CourseOnline/AddPromotion";
import LayoutBase from "~/components/LayoutBase";
const CourseListing = () => {
  const { Search } = Input;
  const onSearch = (value) => console.log(value);
  const [addPromotion, setAddPromotion] = useState(false);
  const data = [
    {
      code: "U70SDWQBU1",
      courseName: "Khóa học Javascript 1",
      promotionCost: 2000000,
      percent: 1,
      users: "Admin",
      status: "Đang sử dụng",
      quantity: 20,
      note: "Mã giảm giá cho khóa ABC 1",
      endDay: "24/08/2020",
    },
    {
      code: "U70SDWQBU2",
      courseName: "Khóa học Javascript 2",
      promotionCost: 2000000,
      percent: 2,
      users: "Admin",
      status: "Đang sử dụng",
      quantity: 20,

      note: "Mã giảm giá cho khóa ABC 2",
      endDay: "24/08/2020",
    },
    {
      code: "U70SDWQBU3",
      courseName: "Khóa học Javascript 3",
      promotionCost: 2000000,
      percent: 3,
      users: "Admin",
      quantity: 40,
      status: "Đang sử dụng",
      note: "Mã giảm giá cho khóa ABC 3",
      endDay: "31/10/2020",
    },
  ];
  const columns = [
    {
      title: "Code",
      dataIndex: "code",
    },
    {
      title: "Khóa học",
      dataIndex: "courseName",
    },

    {
      title: "Giá tiền",
      dataIndex: "promotionCost",
    },
    {
      title: "Phần trăm",
      dataIndex: "percent",
      render: (percent) => {
        return <div>{percent}%</div>;
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        let color = status == "Đang sử dụng" ? "green" : "volcano";
        return (
          <Tag color={color} key={status}>
            <b> {status.toUpperCase()}</b>
          </Tag>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "endDay",
    },
    {
      title: "",
      render: () => {
        return (
          <Button type="primary" icon={<FormOutlined />}>
            Update
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-12">
          <TitlePage title="Danh sách mã khuyến mãi" />
          <div className="wrap-table">
            <Card
              className="cardRadius"
              title={
                <Button
                  type="primary"
                  onClick={() => {
                    setAddPromotion(true);
                  }}
                >
                  Thêm khuyến mãi
                </Button>
              }
              extra={
                <Search
                  placeholder="input search text"
                  onSearch={onSearch}
                  style={{ width: 250 }}
                  className="btn-search"
                  size="large"
                />
              }
            >
              <PowerTable columns={columns} dataSource={data} />
              <AddPromotion
                visible={addPromotion}
                onCancel={() => setAddPromotion(false)}
              />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
CourseListing.layout = LayoutBase;
export default CourseListing;
