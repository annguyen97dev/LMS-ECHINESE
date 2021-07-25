import { instance } from "~/apiBase/instance";

const url = "/api/Ward";
class WardApi {
  // Lấy tất cả data
  getAll = (params) => instance.get<IApiResultData<IWard[]>>(url, { params });

  // Thêm mới data
  add(data: IWard) {
    return instance.post(url, data);
  }
  // Cập nhật data
  update(data: IWard) {
    return instance.put(url, data);
  }
  // Xóa data
  delete(data: IWard) {
    return instance.put(url, data);
  }
}

export const wardApi = new WardApi();
