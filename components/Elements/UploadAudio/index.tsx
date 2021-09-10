import React, { useState } from "react";
import { Form, Upload, Spin, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useWrap } from "~/context/wrap";
import { exerciseGroupApi } from "~/apiBase/";

const UploadAudio = (props) => {
  const { getFile, valueFile } = props;
  const [linkUpload, setLinkUpload] = useState(valueFile);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const { showNoti } = useWrap();

  // Upload file audio
  const onchange_UploadFile = async (info) => {
    if (info.file.status === "uploading") {
      setLoadingUpload(true);
      return;
    }
    setLoadingUpload(true);
    try {
      let res = await exerciseGroupApi.UploadAudio(info.file.originFileObj);
      if (res.status == 200) {
        setLinkUpload(res.data.data);
        getFile && getFile(res.data.data);
        showNoti("success", "Upload file thành công");
      }
    } catch (error) {
      showNoti("danger", error);
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <div>
      <Upload onChange={onchange_UploadFile} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Bấm để tải file</Button>
      </Upload>
      <div className="d-block mt-3">
        {loadingUpload ? (
          <Spin />
        ) : (
          linkUpload && (
            <a href={linkUpload} target="_blank" style={{ color: "#3289c7" }}>
              {linkUpload}
            </a>
          )
        )}
      </div>
    </div>
  );
};

export default UploadAudio;
