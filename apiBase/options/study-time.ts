import { instance } from "~/apiBase/instance";

class StudyTimeApi {
  getAll = (page: number) =>
    instance.get<IApiResultData<IStudyTime[]>>(
      "/api/ClassDetail/GetAllClassDetail",
      {
        params: {
          page: page,
        },
      }
    );
  //   getWithID = (CourseID: number) =>
  //     instance.get<IApiResult<ICourse[]>>("/api/Course/GetCourse", {
  //       params: {
  //         id: CourseID,
  //       },
  //     });
  //   post = (data: ICourse) => instance.post("/api/Class/InsertClass", data, {});
  //   put = (data: ICourse) => instance.put("/api/Course/UpdateCourse", data, {});
  //   patch = (data: any) => instance.patch("/api/Course/UpdateHiddenCourse", data);
}

export const studyTimeApi = new StudyTimeApi();
