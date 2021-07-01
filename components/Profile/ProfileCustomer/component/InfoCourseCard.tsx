import React from "react";
import { Button, Collapse, Divider, Tag } from "antd";
import PowerTable from "~/components/PowerTable";
import { dataService } from "../../../../lib/customer/dataCustomer";
import ExpandTable from "~/components/ExpandTable";
import { Info } from "react-feather";
const expandedRowRender = () => {
  return (
    <>
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic magni,
      obcaecati optio, autem sapiente itaque eligendi deleniti dolor cumque
      suscipit iste incidunt quasi eveniet a laborum! Amet exercitationem nisi
      aspernatur.
    </>
  );
};
const InfoCourseCard = () => {
  const { Panel } = Collapse;
  const columns = [
    { title: "Ngày", dataIndex: "testDate" },
    { title: "Môn học", dataIndex: "pfSubject" },
    {
      title: "Học lực",
      dataIndex: "pfRank",
      render: (pfRank) => {
        let tag = pfRank == "Giỏi" ? "tag blue" : "tag red";
        if (pfRank == "Khá") {
          tag = "tag yellow";
        }
        return <span className={tag}>{pfRank}</span>;
      },
    },
    { title: "Giáo viên", dataIndex: "nameStudent" },
    {
      title: "Điểm danh",
      dataIndex: "pfRollCall",
      render: (pfRollCall) => {
        let tag = pfRollCall == "Có" ? "tag green" : "tag black";
        return (
          <span className={tag} key={pfRollCall}>
            {pfRollCall}
          </span>
        );
      },
    },
    { title: "Ghi chú" },
    { title: "Cảnh báo" },
  ];
  const columns2 = [
    { title: "Nhóm bài", dataIndex: "pfSubject" },
    { title: "Ngày tạo", dataIndex: "testDate" },
    {
      title: "Trạng thái",
      dataIndex: "pfRollCall",
      render: (pfRollCall) => {
        let tag = pfRollCall == "Có" ? "tag green" : "tag black";

        return (
          <Tag className={tag} key={pfRollCall}>
            {pfRollCall}
          </Tag>
        );
      },
    },
    {
      title: "Điểm",
      dataIndex: "listening",

      render: (listening) => {
        return <span className="tag blue">{listening}</span>;
      },
    },
    {
      dataIndex: "",
      render: () => (
        <>
          <button className="btn btn-icon">
            <Info />
          </button>
        </>
      ),
    },
  ];
  const columns3 = [
    {
      title: "Exam",
      dataIndex: "pkgName",
    },

    {
      title: "Listening",
      dataIndex: "listening",
      render: (listening) => {
        return <span className="tag blue">{listening}</span>;
      },
    },
    {
      title: "Reading",
      dataIndex: "reading",
      render: (reading) => {
        return <span className="tag blue">{reading}</span>;
      },
    },
    {
      title: "Writing",
      dataIndex: "writing",
      render: (writing) => {
        return <span className="tag blue">{writing}</span>;
      },
    },
    {
      title: "Speaking",
      dataIndex: "speaking",
      render: (speaking) => {
        return <span className="tag blue">{speaking}</span>;
      },
    },
    {
      title: "Ghi chú",
    },
  ];

  return (
    <>
      <Collapse accordion>
        <Panel
          header="[ZIM - 20L5 Thái Hà] - A-IELTS Foundation, 01/12, 18:30-20:30"
          key="1"
        >
          <PowerTable
            noScroll
            dataSource={dataService}
            columns={columns}
            Extra={<h5>Điểm danh</h5>}
          />
          <Divider />

          <ExpandTable
            noScroll
            Extra={<h5>Bài tập</h5>}
            expandable={{ expandedRowRender }}
            dataSource={dataService}
            columns={columns2}
          />

          <Divider />

          <PowerTable
            noScroll
            dataSource={dataService}
            columns={columns3}
            Extra={<h5>Điểm thi</h5>}
          />
        </Panel>
      </Collapse>
    </>
  );
};
export default InfoCourseCard;
