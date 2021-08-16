import React, { useState } from "react";
import { Table, Card, Tag, Select, Modal } from "antd";
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
import FilterTable from "~/components/Global/FeedbackList/FitlerTable";

import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
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

  const dataSource = [];

  for (let i = 0; i < 50; i++) {
    dataSource.push({
      key: i,
      Type: "Hỗ trợ học viên",
      Title: "Xin nghỉ một sồ buổi học",
      SendPeople: "Lan Anh",
      Tvv: "Hải Tú",
      StartDay: "02-03-2021",
      Done: "",
      Remark: "Tốt",
      Action: "",
    });
  }

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

  const columns = [
    {
      title: "Loại phản hồi",
      dataIndex: "Type",
      key: "type",
    },
    {
      title: "Title",
      dataIndex: "Title",
      key: "title",
    },
    {
      title: "Người gửi",
      dataIndex: "SendPeople",
      key: "sendpeople",
      ...FilterColumn("SendPeople"),
      render: (text) => <p className="font-weight-blue">{text}</p>,
    },
    {
      title: "Tư vấn viên",
      dataIndex: "Tvv",
      key: "tvv",
      ...FilterColumn("Tvv"),
      render: (text) => <p className="font-weight-black">{text}</p>,
    },

    {
      title: "Ngày gửi",
      dataIndex: "StartDay",
      key: "status",
      ...FilterDateColumn("StartDay"),
    },
    {
      title: "Xong",
      dataIndex: "Done",
      key: "done",
      align: "center",
      filters: [
        {
          text: "Active",
          value: "active",
        },
        {
          text: "Unactive",
          value: "unactive",
        },
      ],
      onFilter: (value, record) => record.Status.indexOf(value) === 0,
      render: (Status) => <span className="tag green">Active</span>,
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
                pathname: "/staff/feedback-list/detail/[slug]",
                query: { slug: 2 },
              }}
            >
              <a className="btn btn-icon">
                <Eye />
              </a>
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
        TitlePage="Duyệt feedback"
        columns={columns}
        dataSource={dataSource}
        Extra={
          <div className="extra-table">
            <FilterTable />
            <SortBox dataOption={dataOption} />
          </div>
        }
        expandable={{ expandedRowRender }}
      ></ExpandTable>
    </>
  );
};

FeedbackList.layout = LayoutBase;
export default FeedbackList;
