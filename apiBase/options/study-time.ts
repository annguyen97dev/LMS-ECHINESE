import { instance } from "~/apiBase/instance";

class StudyTimeApi {
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IStudyTime[]>>("/api/StudyTime", {
      params: todoApi,
    });

  getWithID = (ID: number) =>
    instance.get<IApiResult<IStudyTime[]>>(`/api/StudyTime/${ID}`);

  add = (data: IStudyTime) => instance.post("/api/StudyTime", data, {});

  update = (data: any) => instance.put("/api/StudyTime", data, {});
}

export const studyTimeApi = new StudyTimeApi();
