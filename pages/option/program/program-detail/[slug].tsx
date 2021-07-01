import React, { useEffect, useState } from "react";
import PowerTable from "~/components/PowerTable";
import TitlePage from "~/components/TitlePage";
import SearchBox from "~/components/Elements/SearchBox";
import { data } from "../../../../lib/option/dataOption";
import LayoutBase from "~/components/LayoutBase";
import { Tag } from "antd";

import SortBox from "~/components/Elements/SortBox";
import { useRouter } from "next/router";
import { curriculumApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";
import CurriculumForm from "~/components/Global/Option/CurriculumForm";

const Program = () => {
  const router = useRouter();
  const slug = router.query.slug;
  const [dataCurriculum, setDataCurriculum] = useState<ICurriculum[]>();
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });

  console.log("is Loading outside: ", isLoading);

  const getCurriculum = async () => {
    setIsLoading({
      type: "GET_ALL",
      status: true,
    });
    try {
      let rs = await curriculumApi.getInClass(slug);
      rs.status == 200 && setDataCurriculum(rs.data.createAcc);
    } catch (error) {
      console.log("Error: ", error);
      showNoti("success", error);
    } finally {
      setIsLoading({
        type: "GET_ALL",
        status: false,
      });
    }
  };

  useEffect(() => {
    getCurriculum();
  }, []);

  const dataSubject = [
    {
      key: 1,
      SubjectName: "grammar",
      Des: "abcd",
      action: "",
    },
    {
      key: 1,
      SubjectName: "grammar",
      Des: "abcd",
      action: "",
    },
    {
      key: 1,
      SubjectName: "grammar",
      Des: "abcd",
      action: "",
    },
  ];

  const colSub = [
    {
      title: "Tên môn học",
      dataIndex: "SubjectName",
      key: "subjectname",
    },
    {
      title: "Mô tả",
      dataIndex: "Des",
      key: "des",
    },
  ];

  const columns = [
    { title: "Khóa học", dataIndex: "ListCourseName" },
    { title: "Lớp học", dataIndex: "ListClassName" },
    { title: "Giáo trình", dataIndex: "CurriculumsName" },

    {
      render: () => (
        <>
          <CurriculumForm isLoading={isLoading} showIcon={true} />
        </>
      ),
    },
  ];

  return (
    <>
      <div className="row">
        <div className="col-12">
          <TitlePage title="Danh sách khối học chi tiết" />
        </div>
      </div>
      <div className="row">
        <div className="col-md-5 col-12">
          {/* <PowerTable
          
            dataSource={dataSubject}
            columns={colSub}
            Extra={
              "Môn học"
            }
          /> */}
        </div>
        <div className="col-md-7 col-12">
          <PowerTable
            loading={isLoading}
            TitleCard={<CurriculumForm showAdd={true} isLoading={isLoading} />}
            dataSource={dataCurriculum}
            columns={columns}
            Extra={
              // <div className="extra-table">
              //   <SearchBox />
              // </div>
              "Giáo trình"
            }
          />
        </div>
      </div>
    </>
  );
};
Program.layout = LayoutBase;
export default Program;
