import { instance } from "~/apiBase/instance";

const url = "/api/CustomerConsultationStatus";

class ConsultationStatusApi {
  getPaged = (Params: any) =>
    instance.get<IApiResultData<IConsultationStatus[]>>(url, {
      params: Params,
    });

  getAll = (Params: any) =>
    instance.get<IApiResultData<IConsultationStatus[]>>(url, {
      params: Params,
    });

  getDetail = (id: number) =>
    instance.get<IApiResultData<IConsultationStatus>>(`${url}/${id}`);

  add = (data: IConsultationStatus) => instance.post(url, data);

  update = (data: IConsultationStatus) => instance.put(url, data, {});
}

export const consultationStatusApi = new ConsultationStatusApi();
