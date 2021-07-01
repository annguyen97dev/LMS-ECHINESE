import React, { useState } from "react";
import { Table, Card, Tag, Select, Tooltip } from "antd";
import { FormOutlined, EyeOutlined } from "@ant-design/icons";

import Link from "next/link";
import ExpandTable from "~/components/ExpandTable";
import { table } from "console";
import SearchBox from "~/components/Elements/SearchBox";

import FilterColumn from "~/components/Tables/FilterColumn";
import FilterDateColumn from "~/components/Tables/FilterDateColumn";

import { Eye, Filter, Search } from "react-feather";

import FilterTable from "~/components/Global/ExerciseDoneList/FilterTable";
import LayoutBase from "~/components/LayoutBase";

const ExerciseDoneList = () => {
  const [showFilter, showFilterSet] = useState(false);
  const funcShowFilter = () => {
    showFilter ? showFilterSet(false) : showFilterSet(true);
  };

  const dataSource = [];

  for (let i = 0; i < 50; i++) {
    dataSource.push({
      key: i,
      Student: "Lê Kha",
      Course: "[ZIM – 12 Huỳnh Lan Khanh] - AM - Advanced, 18/01, 09:30-11:30",
      Teacher: "Thầy An",
      Rating: 5,
      CreateDate: "25-02-2020",
      SubmitDate: "27-01-2020",
      ModifiedDate: "27-01-2020",
      Action: "",
    });
  }

  const columns = [
    {
      title: "Học viên",
      dataIndex: "Student",
      key: "student",
      ...FilterColumn("Student"),
      render: (text) => <p className="font-weight-blue">{text}</p>,
    },
    {
      title: "Khóa học",
      dataIndex: "Course",
      key: "course",
      ...FilterColumn("Course"),

      render: (text) => <p className="font-weight-black">{text}</p>,
    },
    {
      title: "Giáo viên",
      dataIndex: "Teacher",
      key: "teacher",
      ...FilterColumn("Teacher"),
    },
    {
      title: "Đánh giá",
      dataIndex: "Rating",
      key: "rating",
    },

    {
      title: "Ngày khởi tạo",
      dataIndex: "CreateDate",
      key: "createdate",
      ...FilterDateColumn("CreateDay"),
    },
    {
      title: "Ngày submit",
      dataIndex: "SubmitDate",
      key: "submitdate",
      ...FilterDateColumn("SubmitDay"),
    },
    {
      title: "Ngày sửa",
      dataIndex: "ModifiedDate",
      key: "modifiedDate",
      ...FilterDateColumn("ModifiedDate"),
    },
    {
      title: "Thao tác",
      dataIndex: "Action",
      key: "action",
      align: "center",
      render: (Action) => (
        <Link
          href={{
            pathname: "/staff/exercise-done-list/[slug]",
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

  const expandedRowRender = () => {
    const { Option } = Select;
    return (
      <>
        <div className="feedback-detail-text">
          Bài tập trong thời gian nghỉ: Paraphrase các câu sau (thử nhiều cách
          nhé, ít nhất hai cách): 1. There will be a few changes in the office.
          2. You weren't careful, so you made many mistakes. 3. He seems very
          well-educated, however, he is not very bright. 4. He drank a cup of
          tea. He felt dizzy afterwards. 5. She loves watching rom-com. Her
          brother loves it, too. 6. He said that it was Mary who had stolen the
          money.
        </div>
      </>
    );
  };

  return (
    <>
      <ExpandTable
        TitlePage="Bài đã chấm"
        dataSource={dataSource}
        columns={columns}
        Extra={<FilterTable />}
        expandable={{ expandedRowRender }}
      ></ExpandTable>
    </>
  );
};

ExerciseDoneList.layout = LayoutBase;
export default ExerciseDoneList;
