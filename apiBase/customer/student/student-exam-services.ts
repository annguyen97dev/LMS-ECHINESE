import { instance } from "~/apiBase/instance";

const url = "/api/StudentExamOfService";

class StudentExamServicesApi {
  getAll = (Params: any) =>
    instance.get<IApiResultData<IStudentExamServices[]>>(url, {
      params: Params,
    });

  getDetail = (id: number) =>
    instance.get<IApiResultData<IStudentExamServices>>(`${url}/${id}`);

  add = (data: IStudentExamServices) => instance.post(url, data);

  update = (data: IStudentExamServices) => instance.put(url, data, {});
}

export const studentExamServicesApi = new StudentExamServicesApi();
