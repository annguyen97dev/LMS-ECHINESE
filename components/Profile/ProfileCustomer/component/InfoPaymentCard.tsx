import React from "react";
import { Button, Collapse, Divider, Tag } from "antd";
import PowerTable from "~/components/PowerTable";
import { dataService } from "../../../../lib/customer/dataCustomer";
import ExpandTable from "~/components/ExpandTable";
import { File } from "react-feather";

const InfoPaymentCard = () => {
  const columns = [
    { title: "Ngày tạo", dataIndex: "regDate" },
    { title: "Số tiền", dataIndex: "cost" },
    { title: "Ghi chú", dataIndex: "service" },
    {
      render: () => (
        <button className="btn btn-icon">
          <File />
        </button>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <div className="pt-3">
        <h5>Học phí còn nợ: 00</h5>
      </div>
      <PowerTable
        noScroll
        dataSource={dataService}
        columns={columns}
        Extra={<h5>Lịch sử thanh toán</h5>}
      />

      <PowerTable
        noScroll
        Extra={<h5>Lịch sử hoàn tiền</h5>}
      />
    </div>
  );
};
export default InfoPaymentCard;
