import { instance } from "~/apiBase/instance";

class CurriculumDetailApi {
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<ICurriculumDetail[]>>(
      "/api/CurriculumDetail/",
      {
        params: todoApi,
      }
    );

  getWithID = (ID: number) =>
    instance.get<IApiResult<ICurriculumDetail[]>>(
      `/api/CurriculumDetail/${ID}`
    );

  add = (data: ICurriculumDetail) =>
    instance.post("/api/CurriculumDetail", data, {});

  update = (data: any) => instance.put("/api/CurriculumDetail/", data, {});
}

export const curriculumDetailApi = new CurriculumDetailApi();
