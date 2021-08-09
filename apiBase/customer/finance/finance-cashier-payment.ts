import { instance } from "~/apiBase/instance";

const url = "/api/Voucher";

class Voucher {
  getAll = (Params: any) =>
    instance.get<IApiResultData<IVoucher[]>>(url, {
      params: Params,
    });

  getDetail = (id: number) =>
    instance.get<IApiResultData<IVoucher>>(`${url}/${id}`);

  update = (data: IVoucher) => instance.put(url, data, {});
}

export const voucherApi = new Voucher();
