import { instance } from "~/apiBase/instance";

const url = "/api/Idioms";
class IdiomsApi {
  getPaged = (Params: any) =>
    instance.get<IApiResultData<IIdioms[]>>(url, {
      params: Params,
    });

  getDetail = (id: number) =>
    instance.get<IApiResultData<IIdioms>>(`${url}/${id}`);

  add = (data: IIdioms) => instance.post(url, data);

  update = (data: IIdioms) => instance.put(url, data, {});
  getRandom = () => instance.get<IApiResultData<IIdioms>>(`${url}/getRandoms`)
}

export const idiomsApi = new IdiomsApi();
