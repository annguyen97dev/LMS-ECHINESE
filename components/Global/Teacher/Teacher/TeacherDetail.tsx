import ProfileBase from "~/components/Profile";

import LayoutBase from "~/components/LayoutBase";
import { useRouter } from "next/router";
import { useState } from "react";
import TeacherProfile from "../TeacherProfile";

const TeacherDetail = () => {
  const router = useRouter();
  const slug = router.query.slug;
  const [dataUser, setDataUser] = useState({});

  return <TeacherProfile dataUser={dataUser} />;
};
export default TeacherDetail;
