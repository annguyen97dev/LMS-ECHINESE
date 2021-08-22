import {
  Button,
  Card,
  Divider,
  Input,
  Menu,
  Select,
  Spin,
  Tooltip,
} from "antd";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import TitlePage from "~/components/Elements/TitlePage";
import { Tree } from "antd";
import LayoutBase from "~/components/LayoutBase";
import { documentCategoryApi } from "~/apiBase/course-detail/document-category";
import { useWrap } from "~/context/wrap";
import { Edit, File, Folder } from "react-feather";
import FileExtension from "~/components/Global/CourseList/CourseListDetail/Document/FileExtension";

const DocumentCourse = (props: any) => {
  const { courseID } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [categoryDoc, setCategoryDoc] = useState<ICategoryDoc[]>([]);
  const { showNoti } = useWrap();
  const [categoryID, setCategoryID] = useState(null);

  const getDataCategoryDoc = () => {
    setIsLoading(true);
    (async () => {
      try {
        let res = await documentCategoryApi.getAll({
          CourseID: courseID,
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

  return (
    <div>
      <Card
        title="Tài liệu"
        extra={
          <>
            <button className="btn btn-success" style={{ marginRight: "10px" }}>
              <File size={15} />
              <span className="tab-title">Thêm tài liệu</span>
            </button>
            <button className="btn btn-warning" style={{ marginRight: "10px" }}>
              <Folder size={15} />
              <span className="tab-title">Thêm giáo trình</span>
            </button>
          </>
        }
      >
        <Spin spinning={isLoading}>
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
              </Menu>
            </div>
            <div className="col-9">
              <FileExtension categoryID={categoryID} />
            </div>
          </div>
        </Spin>
      </Card>
    </div>
  );
};

DocumentCourse.layout = LayoutBase;
export default DocumentCourse;
