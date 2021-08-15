import { instance } from "~/apiBase/instance";

const url = "/api/RollUp";

class RollUpApi {
  getAll = (Params: any) =>
    instance.get<IApiResultData<IRollUp[]>>(url, {
      params: Params,
    });

  add = (data: IRollUp) => instance.post(url, data);
}

export const rollUpApi = new RollUpApi();
