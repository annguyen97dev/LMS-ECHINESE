import ProfileBase from "~/components/Profile";
import LayoutBase from "~/components/LayoutBase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TeacherProfile from "../TeacherProfile";
import { useWrap } from "~/context/wrap";
import { teacherApi } from "~/apiBase";


const TeacherDetail = () => {
  const router = useRouter();
  const slug = router.query.slug;
  const [dataUser, setDataUser] = useState({});
  const { showNoti } = useWrap();
  const [isLoading, setIsLoading] = useState({
    type: "",
    status: false,
  });

  const fetchTeacherList = async () => {
    setIsLoading({
      type: "GET_BYID",
      status: true,
    });
    try {
      let res = await teacherApi.getById(slug);
      if (res.status === 200) {
          setDataUser(res.data.data);
      } else if (res.status === 204) {
        showNoti("danger", "Không tìm thấy");
      }
    } catch (error) {
      showNoti("danger", error.message);
    } finally {
      setIsLoading({
        type: "GET_BYID",
        status: false,
      });
    }
  };

  useEffect(() => {
    fetchTeacherList();
  }, [slug]);

  return <TeacherProfile isLoading={isLoading} dataUser={dataUser} />;
};
export default TeacherDetail;
