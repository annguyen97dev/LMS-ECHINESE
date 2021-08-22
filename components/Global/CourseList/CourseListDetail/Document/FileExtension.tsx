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
    <div className="container-fluid border-left border-right">
      <div className="card-file-box">
        <div className="pb-3 font-weight-black">Tài liệu</div>

        <div className="row">
          {document.map((doc) => (
            <div className="col-12 col-md-4">
              <div className="file-man-box">
                <div className="file-img-box">
                  <img
                    src="https://coderthemes.com/highdmin/layouts/assets/images/file_icons/doc.svg"
                    alt="icon"
                  />
                </div>

                <a href={doc.DocumentLink} className="file-download">
                  <i className="fa fa-download"></i>
                </a>

                <div className="file-man-title">
                  <h5 className="mb-0 text-overflow">{doc.DocumentName}</h5>
                  <p className="mb-0">
                    <small>0.0 kb</small>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <Spin spinning={isLoading}>
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
      </Spin> */}
      </div>
    </div>
  );
};
FileExtension.layout = LayoutBase;
export default FileExtension;
