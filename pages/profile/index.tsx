import React, { useState } from "react";
import ProfileBase from "~/components/Profile";
import LayoutBase from "~/components/LayoutBase";
import { useSession } from "next-auth/client";

const ProFileStaff = () => {
  const [fileList, setFileList] = useState([]);
  const [session, loading] = useSession();

  let dataUser = null;
  if (session !== undefined) {
    dataUser = session?.user;
  }

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };
  return <ProfileBase dataUser={dataUser} />;
};

ProFileStaff.layout = LayoutBase;
export default ProFileStaff;
