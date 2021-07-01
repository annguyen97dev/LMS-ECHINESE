import React from "react";
import PowerTable from "~/components/PowerTable";
import Link from "next/link";
import { Tooltip } from "antd";
import { Eye } from "react-feather";
import ModalAdd from "~/components/Global/ParentsList/ModalAdd";
import LayoutBase from "~/components/LayoutBase";

const ParentList = () => {
  const dataSource = [];

  for (let i = 0; i < 50; i++) {
    dataSource.push({
      key: i,
      Name: "Nguyễn Phi Hùng",
      Phone: "0123948382",
      Email: "hungmaster@gmail.com",
      CreateDay: "12-06-2012",
      CreateMan: "Admin",
      Action: "",
    });
  }

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "Name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "Phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "email",
    },
    {
      title: "Ngày khởi tạo",
      dataIndex: "CreateDay",
      key: "createday",
    },
    {
      title: "Người khởi tạo",
      dataIndex: "CreateMan",
      key: "createman",
    },
    {
      title: "",
      dataIndex: "Action",
      key: "action",
      align: "center",
      render: (Action) => (
        <Link
          href={{
            pathname: "/customer/parents/detail/[slug]",
            query: { slug: 2 },
          }}
        >
          <a className="btn btn-icon view">
            <Tooltip title="Chi tiết">
              <Eye />
            </Tooltip>
          </a>
        </Link>
      ),
    },
  ];

  return (
    <div className="row">
      <div className="col-12">
        <PowerTable
          TitlePage="Danh sách phụ huynh"
          TitleCard={<ModalAdd />}
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    </div>
  );
};
ParentList.layout = LayoutBase;
export default ParentList;
