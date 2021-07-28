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

  return <ProfileBase dataUser={dataUser} />;
};

ProFileStaff.layout = LayoutBase;
export default ProFileStaff;
