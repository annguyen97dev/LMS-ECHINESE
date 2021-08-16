import { Button, Card, Input, Menu, Select, Tooltip } from "antd";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import TitlePage from "~/components/Elements/TitlePage";
import { Tree } from "antd";
import LayoutBase from "~/components/LayoutBase";
import { documentCategoryApi } from "~/apiBase/course-detail/document-category";
import { useWrap } from "~/context/wrap";
import { Folder } from "react-feather";
import FileExtension from "~/components/Global/CourseList/CourseListDetail/Document/FileExtension";

const DocumentList = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categoryDoc, setCategoryDoc] = useState<ICategoryDoc[]>([]);
  const { showNoti } = useWrap();
  const [categoryID, setCategoryID] = useState(null);

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
  }, []);

  console.log(categoryDoc);
  console.log("id", categoryID);

  return (
    <div className="h-100">
      <Card title="Document course" className="h-100">
        <div className="row">
          <div className="col-3">
            <div className="pb-3 font-weight-black">Giáo trình</div>

            <Menu
              // defaultSelectedKeys={["1"]}
              mode="vertical"
            >
              {categoryDoc.map((cate) => (
                <Menu.Item
                  key={cate.CategoryName}
                  icon={<Folder />}
                  onClick={() => {
                    setCategoryID(cate.ID);
                  }}
                >
                  {cate.CategoryName}
                </Menu.Item>
              ))}

              <Menu.Item key="3" icon={<Folder />}>
                Test Category
              </Menu.Item>
            </Menu>
          </div>
          <div className="col-9">
            <FileExtension />
          </div>
        </div>
      </Card>
    </div>
  );
};

DocumentList.layout = LayoutBase;
export default DocumentList;
