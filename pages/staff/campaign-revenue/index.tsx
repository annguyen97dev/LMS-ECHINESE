import React, { useState } from "react";
import { Select, DatePicker, Form, Modal } from "antd";
import { FormOutlined, EyeOutlined } from "@ant-design/icons";
import TitlePage from "~/components/TitlePage";
import SearchBox from "~/components/Elements/SearchBox";
import Link from "next/link";
import PowerTable from "~/components/PowerTable";
import SortBox from "~/components/Elements/SortBox";
import ExpandTable from "~/components/ExpandTable";
import FilterBox from "~/components/Elements/FilterBox";
import { Filter, Eye, CheckCircle } from "react-feather";
import { Tooltip } from "antd";
import FilterTable from "~/components/Global/CampaignRevenue/FilterTable";
import RevenueChart from "~/components/Dashboard/RevenueChart";

import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import LayoutBase from "~/components/LayoutBase";

const expandedRowRender = () => {
  const { Option } = Select;

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  function onChange(date, dateString) {
    console.log(date, dateString);
  }
  return (
    <>
      <div className="revenue-detail-row">
        <Form layout="vertical">
          <div className="row">
            <div className="col-md-2">
              <Form.Item>
                <DatePicker
                  placeholder="Từ ngày"
                  className="style-input w-100"
                  onChange={onChange}
                />
              </Form.Item>
            </div>

            <div className="col-md-2">
              <Form.Item>
                <DatePicker
                  placeholder="Đến ngày"
                  className="style-input w-100"
                  onChange={onChange}
                />
              </Form.Item>
            </div>

            <div className="col-md-3">
              <Form.Item>
                <button
                  className="btn btn-primary btn-height-input"
                  style={{ marginRight: "10px" }}
                >
                  Tìm kiếm
                </button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </div>
      <div className="revenue-chart">
        <RevenueChart />
      </div>
    </>
  );
};

const CampRevenue = () => {
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const dataSource = [];

  for (let i = 0; i < 50; i++) {
    dataSource.push({
      key: i,
      FullName: "Jack",
      NumberPhone: "0129303021",
      TotalMoney: "5,800,929,000",
      TotalPill: "500",
      TotalCustomer: "743",
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
      title: "Số diện thoại",
      dataIndex: "NumberPhone",
      key: "numberphone",
      ...FilterColumn("NumberPhone"),
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "TotalMoney",
      key: "totalmoney",
    },
    {
      title: "Số hóa đơn",
      dataIndex: "TotalPill",
      key: "totalpill",
    },

    {
      title: "Số khách hàng",
      dataIndex: "TotalCustomer",
      key: "totalcustomer",
    },
  ];

  const [showFilter, showFilterSet] = useState(false);

  const funcShowFilter = () => {
    showFilter ? showFilterSet(false) : showFilterSet(true);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <Modal
        title="Xác nhận thông tin"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Bạn chắc chắn đã xử lí xong phản hồi</p>
      </Modal>
      <ExpandTable
        columns={columns}
        dataSource={dataSource}
        TitlePage="THÔNG TIN SALER, DOANH THU THEO CHIẾN DỊCH
        "
        Extra={<FilterTable />}
        expandable={{ expandedRowRender }}
      ></ExpandTable>
    </>
  );
};

CampRevenue.layout = LayoutBase;
export default CampRevenue;
