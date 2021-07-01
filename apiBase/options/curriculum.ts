import { instance } from "~/apiBase/instance";

class CurriculumApi {
  getAll = (page: number) =>
    instance.get<IApiResult<ICurriculum[]>>(
      "/api/Curriculum/GetAllCurriculum",
      {
        params: {
          page: page,
        },
      }
    );
  getInClass = (className) =>
    instance.get<IApiResult<ICurriculum[]>>(
      `/api/Curriculum/GetSubjectFromCourse?code=${className}`
    );
  //   getWithID = (CourseID: number) =>
  //     instance.get<IApiResult<ICourse[]>>("/api/Course/GetCourse", {
  //       params: {
  //         id: CourseID,
  //       },
  //     });
  //   post = (data: ICourse) =>
  //     instance.post("/api/Curriculum/InsertCurriculum", data, {});
  //   put = (data: ICourse) => instance.put("/api/Course/UpdateCourse", data, {});
  //   patch = (data: any) => instance.patch("/api/Course/UpdateHiddenCourse", data);
}

export const curriculumApi = new CurriculumApi();
