import { instance } from "~/apiBase/instance";

const url = "/api/CustomerConsultation/";
class StudentAdviseApi {
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IStudentAdvise[]>>(url, {
      params: todoApi,
    });

  getWithID = (ID: number) =>
    instance.get<IApiResult<IStudentAdvise[]>>(url + ID);

  add = (data: IStudent) => instance.post(url, data, {});

  update = (data: any) => instance.put(url, data, {});
}

export const studentAdviseApi = new StudentAdviseApi();
