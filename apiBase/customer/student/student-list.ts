import { instance } from "~/apiBase/instance";

class StudentApi {
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IStudent[]>>("/api/Student/", {
      params: todoApi,
    });

  getWithID = (ID: number) =>
    instance.get<IApiResult<IStudent[]>>(`/api/Student/${ID}`);

  add = (data: IStudent) => instance.post("/api/Student", data, {});

  update = (data: any) => instance.put("/api/Student/", data, {});
}

export const studentApi = new StudentApi();
