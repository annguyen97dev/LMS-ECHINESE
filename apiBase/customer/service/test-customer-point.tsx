import { instance } from "~/apiBase/instance";

const url = "/api/ExamAppointmentResult/";
class TestCustomerPointApi {
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<ITestCustomerPoint[]>>(url, {
      params: todoApi,
    });

  getWithID = (ID: number) =>
    instance.get<IApiResultData<ITestCustomerPoint>>(url + ID);

  add = (data: IStudent) => instance.post(url, data, {});

  update = (data: any) => instance.put(url, data, {});
}

export const testCustomerPointApi = new TestCustomerPointApi();
