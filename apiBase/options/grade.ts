import { instance } from "~/apiBase/instance";

class GradeApi {
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IGrade[]>>("/api/Grade/", {
      params: todoApi,
    });

  getWithID = (CourseID: number) =>
    instance.get<IApiResult<IGrade[]>>(`/api/Grade/${CourseID}`);

  add = (data: IGrade) => instance.post("/api/Grade", data, {});

  update = (data: any) => instance.put("/api/Grade/", data, {});
}

export const gradeApi = new GradeApi();
