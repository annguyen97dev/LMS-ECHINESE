import { instance } from "~/apiBase/instance";

class CourseApi {
  getAll = () =>
    instance.get<IApiResultAcc<ICourse[]>>("/api/Course/GetAllCourse");
  getWithID = (CourseID: number) =>
    instance.get<IApiResult<ICourse[]>>("/api/Course/GetCourse", {
      params: {
        id: CourseID,
      },
    });
  post = (data: ICourse) => instance.post("/api/Course/InsertCourse", data, {});
  put = (data: ICourse) => instance.put("/api/Course/UpdateCourse", data, {});
  patch = (data: any) => instance.patch("/api/Course/UpdateHiddenCourse", data);
}

export const courseApi = new CourseApi();
