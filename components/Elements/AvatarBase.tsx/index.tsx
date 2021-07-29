import React, { useEffect, useState } from "react";
import { Upload } from "antd";
import { useWrap } from "~/context/wrap";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { studentApi } from "~/apiBase";
const AvatarBase = (props) => {
  const { getValue } = props;
  const { showNoti } = useWrap();
  const [imageUrl, setImageUrl] = useState();
  const [loadingImage, setLoadingImage] = useState(false);
  // ------------ AVATAR --------------
  const UploadButton = (props) => {
    const { imageUrl } = props;
    return (
      <>
        <div
          className={`bg-upload ${imageUrl && "have-img"} ${
            loadingImage && "loading"
          }`}
        >
          {loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
        </div>
      </>
    );
  };

  const handleChange_img = async (info: any) => {
    console.log("Info file: ", info.file.originFileObj);
    if (info.file.status === "uploading") {
      setLoadingImage(true);
      return;
    }

    try {
      let res = await studentApi.uploadImage(info.file.originFileObj);
      res?.status == 200 &&
        (showNoti("success", "Upload ảnh thành công"),
        setImageUrl(res.data.data),
        getValue(res.data.data));
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        // beforeUpload={beforeUpload}
        onChange={handleChange_img}
      >
        <img
          src={imageUrl}
          alt="avatar"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: imageUrl ? "block" : "none",
          }}
        />

        <UploadButton imageUrl={imageUrl} />
      </Upload>
    </>
  );
};

export default AvatarBase;
