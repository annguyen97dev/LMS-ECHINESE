import { instance } from "~/apiBase/instance";

const url = "/api/UserInformation/";
class UserApi {
  // Lấy tất cả data
  getAll = (params) => instance.get<IApiResultData<IUser[]>>(url, { params });

  // Thêm mới data
  add(data: IUser) {
    return instance.post(url, data);
  }
  // Cập nhật data
  update(data: IUser) {
    return instance.put(url, data);
  }
  // Xóa data
  delete(data: IUser) {
    return instance.put(url, data);
  }
}

export const userApi = new UserApi();
