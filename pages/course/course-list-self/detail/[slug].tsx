import TitlePage from "~/components/Elements/TitlePage";
import { Card, Tag, Space, Table } from "antd";
import SearchBox from "~/components/Elements/SearchBox";
import SortBox from "~/components/Elements/SortBox";
import { table } from "console";
import { useRouter } from "next/router";
import Link from "next/link";

import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";
import LayoutBase from "~/components/LayoutBase";
import { Eye, Filter, Search } from "react-feather";

const CourseListSelfDetail = () => {
  const columns = [
    {
      title: "Ngày học",
      dataIndex: "startday",
      key: "startday",
      ...FilterDateColumn("startDay"),
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Giáo viên",
      dataIndex: "teacher",
      key: "teacher",
      ...FilterColumn("teacher"),
    },
    {
      title: "Trung tâm",
      dataIndex: "center",
      key: "center",
      ...FilterColumn("center"),
    },
    {
      title: "Ca",
      key: "studytime",
      dataIndex: "studytime",
    },
    {
      title: "Phòng học",
      key: "room",
      dataIndex: "room",
      ...FilterColumn("room"),
    },
  ];

  const data = [];

  for (let i = 0; i < 50; i++) {
    data.push({
      key: i,
      center: "ZIM - 35 Võ Oanh",
      studytime: "Tự học sáng",
      startday: "12/05/2021",
      room: "1B",
      teacher: "Mr.An",
    });
  }

  return (
    <>
      <div className="row">
        <div className="col-12 course-list-self-detail">
          <TitlePage title="Danh sách khóa tự học" />
          <div className="wrap-table">
            <Card
              className="table-small"
              title={
                <p className="detail-title mb-0">
                  PHÒNG TỰ HỌC (30/9 - 5/10) - CA SÁNG
                </p>
              }
            >
              <Table columns={columns} dataSource={data} />
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};
CourseListSelfDetail.layout = LayoutBase;
export default CourseListSelfDetail;
