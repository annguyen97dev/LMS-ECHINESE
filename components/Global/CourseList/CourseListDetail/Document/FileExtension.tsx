import Checkbox from "antd/lib/checkbox/Checkbox";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { courseDetailApi } from "~/apiBase";
import { notificationCourseApi } from "~/apiBase/course-detail/notification-course";
import { rollUpApi } from "~/apiBase/course-detail/roll-up";
import FilterBase from "~/components/Elements/FilterBase/FilterBase";
import LayoutBase from "~/components/LayoutBase";
import PowerTable from "~/components/PowerTable";
import { useWrap } from "~/context/wrap";
import { List, Card, Spin } from "antd";
import { File } from "react-feather";
import { documentApi } from "~/apiBase/course-detail/document";

const FileExtension = (props: any) => {
  const { categoryID } = props;
  const [isLoading, setIsLoading] = useState(false);
  const { showNoti } = useWrap();
  const [document, setDocument] = useState<IDocument[]>([]);

  //   const data = [
  //     {
  //       title: "Title 1",
  //     },
  //     {
  //       title: "Title 2",
  //     },
  //     {
  //       title: "Title 3",
  //     },

  //   ];

  const getDataDocByCategoryID = () => {
    setIsLoading(true);
    (async () => {
      try {
        let res = await documentApi.getAll({
          CategoryID: 2,
        });
        //@ts-ignore
        res.status == 200 && setDocument(res.data.data);
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
    getDataDocByCategoryID();
  }, [categoryID]);

  return (
    <>
      <div className="pb-3 font-weight-black">Tài liệu</div>
      <Spin spinning={isLoading}>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3,
          }}
          dataSource={document}
          renderItem={(document) => (
            <a href={document.DocumentLink}>
              <List.Item>
                <div>
                  <File size={40} color={"#dd4667"} />
                </div>
                <div>Tài liệu {document.ID}</div>
              </List.Item>
            </a>
          )}
        />
      </Spin>
    </>
  );
};
FileExtension.layout = LayoutBase;
export default FileExtension;
