import React, { useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";

import FilterColumn from "~/components/Tables/FilterColumn";
import FilterTable from "~/components/Global/CourseList/FitlerTable";
import SortBox from "~/components/Elements/SortBox";
import { Switch } from "antd";
import StudyTimeForm from "~/components/Global/Option/StudyTimeForm";
import LayoutBase from "~/components/LayoutBase";
import { useWrap } from "~/context/wrap";
import { studyTimeApi } from "~/apiBase";

const StudyTime = () => {
  const [dataSource, setDataSource] = useState<IStudyTime[]>([]);
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });
  const { showNoti } = useWrap();

  console.log("is Loading: ", isLoading);

  // GET ALL DATA
  const getAllData = (page: number) => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });

    (async () => {
      try {
        const res = await studyTimeApi.getAll(page);

        res.status == 200 && setDataSource(res.data.data);
      } catch (error) {
        showNoti("danger", error.message);
      } finally {
        setIsLoading({
          type: "GET_ALL",
          status: false,
        });
      }
    })();
  };

  useEffect(() => {
    getAllData(1);
  }, []);

  const columns = [
    {
      title: "Trung tâm",
      dataIndex: "BranchName",
      render: (BranchName) => {
        return <p className="font-weight-black">{BranchName}</p>;
      },
    },
    {
      title: "Lớp học",
      dataIndex: "ClassName",
      ...FilterColumn("ClassName"),
      render: (ClassName) => {
        return <p className="font-weight-blue">{ClassName}</p>;
      },
    },
    { title: "Phòng học", dataIndex: "ClassRoom", ...FilterColumn("ClasRoom") },
    { title: "Giờ học", dataIndex: "StudyTime", ...FilterColumn("StudyTime") },
    { title: "Bắt đầu", dataIndex: "DateOfOpen" },
    { title: "Kết thúc", dataIndex: "DateOfClose" },
    {
      title: "Hidden",
      render: () => (
        <Switch
          checkedChildren="Hidden"
          unCheckedChildren="Hidden"
          size="default"
        />
      ),
    },
    {
      render: () => (
        <>
          <StudyTimeForm showIcon={true} />
        </>
      ),
    },
  ];

  return (
    <PowerTable
      loading={isLoading}
      addClass="basic-header"
      TitlePage="Danh sách ca học"
      TitleCard={<StudyTimeForm showAdd={true} />}
      dataSource={dataSource}
      columns={columns}
      Extra={
        <div className="extra-table">
          <FilterTable />
          <SortBox />
        </div>
      }
    />
  );
};
StudyTime.layout = LayoutBase;
export default StudyTime;
