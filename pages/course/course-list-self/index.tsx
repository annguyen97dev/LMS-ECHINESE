import TitlePage from "~/components/Elements/TitlePage";
import { Card, Tag, Space, Table, Tooltip } from "antd";
import SearchBox from "~/components/Elements/SearchBox";
import SortBox from "~/components/Elements/SortBox";
import { table } from "console";
import { useRouter } from "next/router";
import Link from "next/link";
import { useWrap } from "~/context/wrap";
import PowerTable from "~/components/PowerTable";
import { Eye, Filter, Search } from "react-feather";

import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";

import LayoutBase from "~/components/LayoutBase";

const dataOption = [
  {
    text: "Trung tâm A - Z",
    value: "1",
  },
  {
    text: "Trung tâm Z - A",
    value: "2",
  },
  {
    text: "Khóa A - Z",
    value: "3",
  },
  {
    text: "Khóa Z - A",
    value: "4",
  },
  {
    text: "Ngày tạo(low)",
    value: "5",
  },
  {
    text: "Ngày tạo(high)",
    value: "6",
  },
];

const CourseListSelf = () => {
  const { getTitlePage } = useWrap();
  getTitlePage("Danh sách khóa tự học");

  const columns = [
    {
      title: "Trung tâm",
      dataIndex: "center",
      key: "trungtam",
      ...FilterColumn("center"),
      render: (text) => (
        <a href="/" className="font-weight-blue">
          {text}
        </a>
      ),
    },
    {
      title: "Khóa",
      dataIndex: "course",
      key: "course",
      ...FilterColumn("course"),
      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Ngày mở",
      dataIndex: "startday",
      key: "ngaymo",
      ...FilterColumn("startday"),
    },
    {
      title: "Phòng",
      key: "phong",
      dataIndex: "room",
      ...FilterColumn("room"),
    },
    {
      title: "Ngày tạo",
      key: "ngaytao",
      dataIndex: "createday",
      ...FilterDateColumn("createday"),
    },
    {
      title: "",
      key: "action",
      dataIndex: "action",
      render: (Action) => (
        <Link
          href={{
            pathname: "/course/course-list-self/detail/[slug]",
            query: { slug: 2 },
          }}
        >
          <a className="btn btn-icon">
            <Tooltip title="Chi tiết">
              <Eye />
            </Tooltip>
          </a>
        </Link>
      ),
    },
  ];

  const data = [];

  for (let i = 0; i < 50; i++) {
    data.push({
      key: i,
      center: "ZIM - 35 Võ Oanh chi nhánh " + i,
      course: "Phòng tự học (30/9 - 5/10) - Ca chiều",
      startday: "12/05/2021",
      room: "Room " + i,
      createday: "30-05-2021",
      action: ["view"],
    });
  }

  return (
    <>
      <PowerTable
        TitlePage="Danh sách khóa tự học"
        Size="table-medium"
        dataSource={data}
        columns={columns}
        Extra={
          <div className="list-action-table">
            <SortBox dataOption={dataOption} />
          </div>
        }
      />
    </>
  );
};

CourseListSelf.layout = LayoutBase;
export default CourseListSelf;
