import { Table, Card, Input } from "antd";
import React from "react";
import TitlePage from "~/components/TitlePage";
import LayoutBase from "~/components/LayoutBase";
const StudentContactBook = () => {
  const { Search } = Input;

  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: `${i + 1}`,
      name: "Đặng Phương Vy",
      grade: "2",
      score1: "9",
      score2: "9.5",
      score3: "10",
      score4: "7.7",
      score5: "8.7",
      score6: "8.3",
      score7: "8.7",
      score8: "5",
      score9: "10",
      score10: "9.0",
      rank: `${i + 1}`,
      attitude: "ngoan, hiền, lễ phép",
      note: `hihi x ${i + 2}`,
    });
  }

  const dataPoint = [
    {
      Sheet: "Lớp 5",
      ListStudent: [
        {
          StudentName: "Nguyễn An",
          ClassName: "Lớp 5",
          Reading1: 9,
          Reading2: 10,
          Reading3: 11,
        },
      ],
      ListCol: [
        {
          Title: "Họ và tên",
          DataIndex: "StudentName",
          Children: "",
        },
        {
          Title: "Lớp",
          DataIndex: "ClassName",
          Children: "",
        },
        {
          Title: "Bài tập",
          Children: [
            {
              Title: "Ngày 1",
              DataIndex: "Reading1",
            },
            {
              Title: "Ngày 2",
              DataIndex: "Reading3",
            },
            {
              Title: "Ngày 2",
              DataIndex: "Reading3",
            },
          ],
        },
      ],
    },
  ];

  const columns: any = [
    {
      title: "STT",
      dataIndex: "key",
      fixed: "left",
    },

    {
      title: "Họ và tên",
      dataIndex: "name",
      fixed: "left",
    },
    {
      title: "Lớp",
      dataIndex: "grade",
    },
    {
      title: "Vở bài học",
      children: [
        {
          title: "Ngày 1",
          dataIndex: "score1",
        },
        {
          title: "Ngày 2",
          dataIndex: "score2",
        },
        {
          title: "Ngày 3",
          dataIndex: "score3",
        },
      ],
    },
    {
      title: "Kiểm tra x2",
      children: [
        {
          title: "Ngày kiểm tra",
          dataIndex: "score4",
          colSpan: 3,
        },
        {
          dataIndex: "score5",
          colSpan: 0,
        },
        {
          dataIndex: "score6",
          colSpan: 0,
        },
      ],
    },
    {
      title: "Điểm trung bình *",
      dataIndex: "score7",
    },
    {
      title: "Thứ hạng *",
      dataIndex: "score8",
    },
    {
      title: "Điểm thi tại trường TH",
      dataIndex: "score9",
    },
    {
      title: "Điểm trung bình **",
      dataIndex: "score10",
    },
    {
      title: "Thứ hạng **",
      dataIndex: "rank",
    },
    {
      title: "Thái độ trên lớp",
      dataIndex: "attitude",
    },
    {
      title: "Note",
      dataIndex: "note",
    },
  ];
  return (
    <>
      <div className="row">
        <div className="col-12">
          <TitlePage title={"SỔ LIÊN LẠC"} />
          <div className="wrap-table">
            <Card
              className="cardRadius"
              extra={
                <Search
                  placeholder="input search text"
                  className="btn-search"
                  size="large"
                />
              }
            >
              <Table
                bordered
                columns={columns}
                dataSource={data}
                scroll={{ x: 2000 }}
                sticky
              />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
StudentContactBook.layout = LayoutBase;
export default StudentContactBook;
