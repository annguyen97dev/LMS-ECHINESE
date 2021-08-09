import { instance } from "~/apiBase/instance";

const url = "/api/CounselorsChange/";

class StudentChangeApi {
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IStudentChange[]>>(url, {
      params: todoApi,
    });

  getWithID = (ID: number) =>
    instance.get<IApiResultData<IStudentChange>>(url + ID);

  add = (data: IStudent) => instance.post(url, data, {});

  update = (data: any) => instance.put(url, data, {});
}

export const studentChangeApi = new StudentChangeApi();
