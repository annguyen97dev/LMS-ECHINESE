import { instance } from "~/apiBase/instance";

const url = "/api/SetPackageResult";

class PackageResultApi {
  getAll = (Params: any) =>
    instance.get<IApiResultData<ISetPackageResult[]>>(url, {
      params: Params,
    });

  getDetail = (id: number) =>
    instance.get<IApiResultData<ISetPackageResult>>(`${url}/${id}`);

  add = (data: ISetPackageResult) => instance.post(url, data);

  update = (data: ISetPackageResult) => instance.put(url, data, {});
}

export const packageResultApi = new PackageResultApi();
