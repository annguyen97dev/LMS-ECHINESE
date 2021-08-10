import { instance } from "~/apiBase/instance";

const url = "/api/PaymentMethods";

class PaymentMethodApi {
  getAll = (Params: any) =>
    instance.get<IApiResultData<IPaymentMethod[]>>(url, {
      params: Params,
    });

  getDetail = (id: number) =>
    instance.get<IApiResultData<IPaymentMethod>>(`${url}/${id}`);

  add = (data: IPaymentMethod) => instance.post(url, data);

  update = (data: IPaymentMethod) => instance.put(url, data, {});
}

export const paymentMethodApi = new PaymentMethodApi();
