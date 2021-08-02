import { instance } from "~/apiBase/instance";

class Warning {
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IWarning[]>>("/api/Warning", {
      params: todoApi,
  });
}

export const warningApi = new Warning();
