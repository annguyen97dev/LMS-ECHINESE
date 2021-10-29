import React from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ExpandTable from "~/components/ExpandTable";
import { Switch } from "antd";
import { data } from "~/components/Dashboard/data";
import PowerTable from "~/components/PowerTable";
import TopicModal from "~/components/Global/TopicList/TopicModal";
import QuestionModal from "~/components/Global/TopicList/QuestionModal";

import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";

import { Eye, Filter, Search } from "react-feather";
import LayoutBase from "~/components/LayoutBase";
import { useWrap } from "~/context/wrap";

const QuestionList = () => {
  const { showNoti, pageSize } = useWrap();
  let dataSource = [];
  for (let i = 0; i < 50; i++) {
    dataSource.push({
      key: i,
      STT: i,
      PartTask: "Task" + i,
      Question:
        "IELTS Writing Task 1You should spend about 20 minutes on this task.The line graph below shows the oil production and consumption in China between 1982",
      Action: "",
    });
  }

  let columns = [
    {
      title: "No.",
      dataIndex: "STT",
      key: "STT",
    },
    {
      title: "Part/Task",
      dataIndex: "PartTask",
      key: "parttask",
    },
    {
      title: "Question",
      dataIndex: "Question",
      key: "question",
    },
    {
      title: "Action",
      dataIndex: "action",
      ket: "action",
      align: "center",
      width: "150px",
      render: () => (
        <>
          <QuestionModal showIcon={true} />

          <button className="btn btn-icon delete">
            <DeleteOutlined />
          </button>
        </>
      ),
    },
  ];

  return (
    <PowerTable
      Size="table-medium  table-child"
      dataSource={dataSource}
      columns={columns}
      TitleCard=""
      Extra={<QuestionModal showBtn={true} />}
    />
  );
};

const TopicList = () => {
  let dataSource = [];

  for (let i = 0; i < 50; i++) {
    dataSource.push({
      key: i,
      TopicName: "Topic 1",
      TopicDes: "IELTS Writing & Speaking Practice Test 1",
      Status: "",
      Action: "",
    });
  }

  let columns = [
    {
      title: "Topic Name",
      dataIndex: "TopicName",
      key: "topicname",
      ...FilterColumn("TopicName"),
    },
    {
      title: "Topic Description",
      dataIndex: "TopicDes",
      key: "topicdes",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "status",
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
      title: "",
      dataIndex: "Action",
      key: "action",
      align: "center",
      width: "150px",
      render: () => (
        <>
          <TopicModal showIcon={true} />
          <button className="btn btn-icon delete">
            <DeleteOutlined />
          </button>
        </>
      ),
    },
  ];

  const expandedRowRender = () => {
    return <QuestionList />;
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <ExpandTable
            dataSource={dataSource}
            columns={columns}
            TitlePage="Topic List"
            Extra={<TopicModal showBtn={true} />}
            expandable={{ expandedRowRender }}
          />
        </div>
      </div>
    </>
  );
};

TopicList.layout = LayoutBase;
export default TopicList;
