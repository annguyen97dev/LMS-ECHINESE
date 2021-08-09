import { instance } from "~/apiBase/instance";

class ServiceCustomerExamResult {
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IServiceCustomerExamResult[]>>("/api/StudentExamOfServiceResult", {
      params: todoApi,
    });

  getWithID = (ID: number) =>
    instance.get<IApiResult<IServiceCustomerExamResult[]>>(`/api/StudentExamOfServiceResult/${ID}`);

  add = (data: IServiceCustomerExamResult) => instance.post("/api/StudentExamOfServiceResult/", data, {});

  update = (data) => instance.put("/api/StudentExamOfServiceResult/", data, {});
}

export const serviceCustomerExamResultApi = new ServiceCustomerExamResult();
