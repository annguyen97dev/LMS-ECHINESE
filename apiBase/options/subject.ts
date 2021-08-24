import { instance } from "~/apiBase/instance";

class SubjectApi {
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<ISubject[]>>("/api/Subject/", {
      params: todoApi,
    });

  getWithID = (ID: number) =>
    instance.get<IApiResultData<ISubject>>(`/api/Subject/${ID}`);

  add = (data: ISubject) => instance.post("/api/Subject", data, {});

  update = (data: any) => instance.put("/api/Subject/", data, {});
}

export const subjectApi = new SubjectApi();
