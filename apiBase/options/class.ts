import { instance } from "~/apiBase/instance";

class ClassApi {
  getAll = (page: number) =>
    instance.get<IApiResultData<IClass[]>>("/api/Class/GetAllClass", {
      params: {
        page: page,
      },
    });

  //   getWithID = (CourseID: number) =>
  //     instance.get<IApiResult<ICourse[]>>("/api/Course/GetCourse", {
  //       params: {
  //         id: CourseID,
  //       },
  //     });
  post = (data: ICourse) => instance.post("/api/Class/InsertClass", data, {});
  //   put = (data: ICourse) => instance.put("/api/Course/UpdateCourse", data, {});
  //   patch = (data: any) => instance.patch("/api/Course/UpdateHiddenCourse", data);
}

export const classApi = new ClassApi();
