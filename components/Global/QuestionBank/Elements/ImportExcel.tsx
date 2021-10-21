import React, { useEffect, useState } from "react";
import { Upload, Spin, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { exerciseApi } from "~/apiBase";
import { useWrap } from "~/context/wrap";

const ImportExcel = (props) => {
  const { onFetchData } = props;
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState(false);

  const onChange_ImportExcel = async (info) => {
    if (info.file.status === "uploading") {
      return;
    }

    setIsLoading(true);

    try {
      let res = await exerciseApi.importExcel(info.file.originFileObj);
      if (res.status == 200) {
        showNoti("success", "Import thành công");
        onFetchData && onFetchData();
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Upload onChange={onChange_ImportExcel} showUploadList={false}>
        <button
          className="btn btn-warning mr-2 d-flex align-items-center"
          style={{ height: "42.59px" }}
        >
          <UploadOutlined className="mr-2" /> Import Excel
          {isLoading && <Spin className="loading-base" />}
        </button>
      </Upload>
    </>
  );
};

export default ImportExcel;
