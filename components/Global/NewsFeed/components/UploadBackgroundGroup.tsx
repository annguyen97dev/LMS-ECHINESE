import React, { useEffect, useState } from "react";
import { Upload } from "antd";
import { useWrap } from "~/context/wrap";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { groupNewsFeedApi } from "~/apiBase";
const UploadBackGroundGroup = (props) => {
  const { getValue, imageUrl } = props;
  const { showNoti } = useWrap();
  const [imgUrl, setImgUrl] = useState();
  const [loadingImage, setLoadingImage] = useState(false);

  // ------------ AVATAR --------------
  const UploadButton = (props) => {
    const { img } = props;
    return (
      <>
        <div
          className={`bg-upload ${img && "have-img"} ${
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
      let res = await groupNewsFeedApi.uploadImage(info.file.originFileObj);
      res?.status == 200 &&
        (showNoti("success", "Upload ảnh thành công"),
        setImgUrl(res.data.data),
        getValue(res.data.data));
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setLoadingImage(false);
    }
  };

  useEffect(() => {
    setImgUrl(imageUrl);
  }, [imageUrl]);

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
          src={imgUrl}
          alt="avatar"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: imgUrl ? "block" : "none",
          }}
        />

        <UploadButton img={imgUrl} />
      </Upload>
    </>
  );
};

export default UploadBackGroundGroup;
