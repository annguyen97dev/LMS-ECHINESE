import { instance } from "~/apiBase/instance";

const url = "/api/ExamOfService";
class ExamServiceApi {
  getPaged = (Params: any) =>
    instance.get<IApiResultData<IExamServices[]>>(url, {
      params: Params,
    });

  getDetail = (id: number) =>
    instance.get<IApiResultData<IExamServices>>(`${url}/${id}`);

  add = (data: IExamServices) => instance.post(url, data);

  update = (data: IExamServices) => instance.put(url, data, {});
}

export const examServiceApi = new ExamServiceApi();
