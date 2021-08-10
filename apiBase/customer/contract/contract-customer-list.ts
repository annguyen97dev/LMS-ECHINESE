import { instance } from "~/apiBase/instance";

const url = "/api/ContractOfStudent";

class ContractCustomerList {
  getAll = (Params: any) =>
    instance.get<IApiResultData<IContractCustomerList[]>>(url, {
      params: Params,
    });

  getDetail = (id: number) =>
    instance.get<IApiResultData<IContractCustomerList>>(`${url}/${id}`);

  update = (data) => instance.put(url, data, {});
}

export const contractCustomerListApi = new ContractCustomerList();
