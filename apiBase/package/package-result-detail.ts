import { instance } from "~/apiBase/instance";

const url = "/api/SetPackageResultDetail";

class PackageResultDetailApi {
  getAll = (Params: any) =>
    instance.get<IApiResultData<ISetPackageResultDetail[]>>(url, {
      params: Params,
    });

  getDetail = (id: number) =>
    instance.get<IApiResultData<ISetPackageResultDetail>>(`${url}/${id}`);
}

export const packageResultDetailApi = new PackageResultDetailApi();
