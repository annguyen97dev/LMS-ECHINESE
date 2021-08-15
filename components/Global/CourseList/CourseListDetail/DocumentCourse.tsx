import { Card, Input, Select, Tooltip } from "antd";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import TitlePage from "~/components/Elements/TitlePage";
import { Tree } from "antd";
import { documentCategoryApi } from "~/apiBase/course-detail/document-category";
import { useWrap } from "~/context/wrap";

const DocumentCourse = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categoryDoc, setCategoryDoc] = useState<ICategoryDoc[]>([]);
  const { showNoti } = useWrap();

  const getDataCategoryDoc = () => {
    setIsLoading(true);
    (async () => {
      try {
        let res = await documentCategoryApi.getAll({
          CourseID: 1,
        });
        //@ts-ignore
        res.status == 200 && setCategoryDoc(res.data.data);
        if (res.status == 204) {
          showNoti("danger", "Không tìm thấy dữ liệu!");
        }
      } catch (error) {
        showNoti("danger", error.message);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  useEffect(() => {
    getDataCategoryDoc();
    console.log(categoryDoc);
  }, []);

  const { DirectoryTree } = Tree;

  const treeData = [
    {
      title: "parent 0",
      key: "0-0",
    },
    {
      title: "parent 1",
      key: "0-1",
    },
  ];

  return (
    <>
      <Card title="Document course">
        <div className="row">
          <div className="col-2">
            <DirectoryTree treeData={treeData} />
          </div>
          <div className="col-10">file div</div>
        </div>
      </Card>
    </>
  );
};

export default DocumentCourse;
