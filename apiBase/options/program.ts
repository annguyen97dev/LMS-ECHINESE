import { instance } from "~/apiBase/instance";

class ProgramApi {
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IProgram[]>>("/api/Program", {
      params: todoApi,
    });

  getWithID = (ID: number) =>
    instance.get<IApiResult<IGrade[]>>(`/api/Program/${ID}`);

  add = (data: IProgram) => instance.post("/api/Program", data, {});

  update = (data: any) => instance.put("/api/Program", data, {});
}

export const programApi = new ProgramApi();
