import { instance } from "~/apiBase/instance";

const url = "/api/Area";
class AreaApi {
  // Lấy tất cả data
  getAll = (params) => instance.get<IApiResultData<IArea[]>>(url, { params });

  // Thêm mới data
  add(data: IArea) {
    return instance.post(url, data);
  }
  // Cập nhật data
  update(data: IArea) {
    return instance.put(url, data);
  }
  // Xóa data
  delete(data: IArea) {
    return instance.put(url, data);
  }
}

export const areaApi = new AreaApi();
