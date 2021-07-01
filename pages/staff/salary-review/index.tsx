import React, { useState } from "react";
import { Input, Modal, Tooltip } from "antd";

import SearchBox from "~/components/Elements/SearchBox";
import Link from "next/link";
import PowerTable from "~/components/PowerTable";
import SortBox from "~/components/Elements/SortBox";
import { Filter, Eye, CreditCard } from "react-feather";
import FilterTable from "~/components/Global/CostList/FilterTable";
import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import LayoutBase from "~/components/LayoutBase";

const { TextArea } = Input;

const dataOption = [
  {
    text: "Option 1",
    value: "option 1",
  },
  {
    text: "Option 2",
    value: "option 2",
  },
  {
    text: "Option 3",
    value: "option 3",
  },
];

const AcceptPay = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <button className="btn btn-icon" onClick={showModal}>
        <Tooltip title="Thanh toán">
          <CreditCard />
        </Tooltip>
      </button>

      <Modal
        title="Xác nhận"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h6 style={{ color: "#e17d00" }}>Xác nhận bảng lương?</h6>
      </Modal>
    </>
  );
};

const SalaryReview = () => {
  const [showFilter, showFilterSet] = useState(false);
  const funcShowFilter = () => {
    showFilter ? showFilterSet(false) : showFilterSet(true);
  };

  const dataSource = [];

  for (let i = 0; i < 50; i++) {
    dataSource.push({
      key: i,
      FullName: "Nguyễn Phi Hùng",
      SaleCamp: "Giai đoạn 1 - 7/2019",
      Money: "2,200,000",
      MoneyBonus: "",
      Total: "2,200,000",
      Note: "",
      Action: "",
    });
  }

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "FullName",
      key: "fullname",
      ...FilterColumn("FullName"),
    },
    {
      title: "Chiến dịch sale",
      dataIndex: "SaleCamp",
      key: "salecamp",
      ...FilterColumn("SaleCamp"),
    },
    {
      title: "Số tiền",
      dataIndex: "Money",
      key: "money",
    },
    {
      title: "Thưởng",
      dataIndex: "MoneyBonus",
      key: "moneybonus",
      render: () => <Input style={{ width: 150 }} placeholder="2,500,000" />,
    },
    {
      title: "Tổng",
      dataIndex: "Total",
      key: "total",
    },
    {
      title: "Ghi chú",
      dataIndex: "Note",
      key: "note",
      render: () => <TextArea rows={3} />,
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "action",
      align: "center",
      render: () => <AcceptPay />,
    },
  ];

  return (
    <>
      <PowerTable
        columns={columns}
        dataSource={dataSource}
        TitlePage="Duyệt lương Office"
        TitleCard=""
        Extra={
          <div className="extra-table">
            <SortBox dataOption={dataOption} />
          </div>
        }
      ></PowerTable>
    </>
  );
};

SalaryReview.layout = LayoutBase;
export default SalaryReview;
