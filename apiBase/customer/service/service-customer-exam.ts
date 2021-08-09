import { instance } from "~/apiBase/instance";

class ServiceCustomerExam {
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IServiceCustomerExam[]>>("/api/StudentExamOfService", {
      params: todoApi,
    });

  getWithID = (ID: number) =>
    instance.get<IApiResult<IServiceCustomerExam[]>>(`/api/StudentExamOfService/${ID}`);

  add = (data: IServiceCustomerExam) => instance.post("/api/StudentExamOfService/", data, {});
}

export const serviceCustomerExamApi = new ServiceCustomerExam();
