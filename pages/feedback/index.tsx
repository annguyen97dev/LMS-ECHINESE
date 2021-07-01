import React, { useState } from "react";
import { Table, Card, Tag, Select, Modal } from "antd";
import TitlePage from "~/components/TitlePage";
import SearchBox from "~/components/Elements/SearchBox";
import Link from "next/link";
import ExpandTable from "~/components/ExpandTable";
import { Filter, Eye, CheckCircle } from "react-feather";
import { Tooltip } from "antd";
import FilterTable from "~/components/Global/FeedbackList/FitlerTable";
import { data } from "~/lib/option/dataOption2";
import LayoutBase from "~/components/LayoutBase";
const FeedbackList = () => {
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Loại phản hồi",
      dataIndex: "fbType",
      key: "fbType",
    },
    {
      title: "Title",
      dataIndex: "fbReason",
      key: "fbReason",
    },
    {
      title: "Người gửi",
      dataIndex: "staff",
      key: "staff",
    },
    {
      title: "Tư vấn viên",
      dataIndex: "modBy",
      key: "modBy",
    },

    {
      title: "Ngày gửi",
      dataIndex: "modDate",
      key: "modDate",
    },
    {
      title: "Xong",
      dataIndex: "Done",
      key: "done",
      align: "center",
      render: () => (
        <Tag className="style-tag" color="#06d6a0">
          Xong
        </Tag>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "Remark",
      key: "remark",
    },
    {
      title: "Thao tác",
      dataIndex: "Action",
      key: "action",
      render: (Action) => (
        <div>
          <Tooltip title="Xử lý xong">
            <a className="btn btn-icon" onClick={showModal}>
              <CheckCircle />
            </a>
          </Tooltip>

          <Tooltip title="Xem chi tiết">
            <Link
              href={{
                pathname: "/feedback/[slug]",
                query: { slug: 2 },
              }}
            >
              <button className="btn btn-icon">
                <Eye />
              </button>
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];

  const [showFilter, showFilterSet] = useState(false);

  const funcShowFilter = () => {
    showFilter ? showFilterSet(false) : showFilterSet(true);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const expandedRowRender = () => {
    const { Option } = Select;
    return (
      <>
        <div className="feedback-detail-text">
          Dương Lan Anh Advance1412. Buổi nghỉ: tối 02/03/2021 (writìng) và
          03/03/2021(speaking) Lý do: Em đang ở vùng dịch ạ (thị xã Kinh Môn,
          huyện Kinh Môn, tỉnh Hải Dương)
        </div>
      </>
    );
  };

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
        dataSource={data}
        TitlePage="Feedback List"
        Extra={
          <div className="extra-table">
            <SearchBox />
            <button
              className="btn btn-secondary light btn-filter"
              onClick={funcShowFilter}
            >
              <Filter />
            </button>
          </div>
        }
        expandable={{ expandedRowRender }}
      >
        <FilterTable />
      </ExpandTable>
    </>
  );
};
FeedbackList.layout = LayoutBase;
export default FeedbackList;
