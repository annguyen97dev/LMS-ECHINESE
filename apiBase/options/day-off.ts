import { instance } from "../instance";

const dayOffApi = {
  // Lấy tất cả data có phân trang
  getAll(params) {
    console.log("prarams: ", params);
    const url = "/api/DayOff/GetAll";
    return instance.get<IApiResultData<IDayOff[]>>(url, {
      params,
    });
  },
  // Thêm mới data
  add(data: IDayOff) {
    const url = "/api/DayOff/insert";
    return instance.post(url, data);
  },

  // Cập nhật data
  update(data: IDayOff) {
    const url = `api/DayOff/update`;
    return instance.put(url, data);
  },
  // Xóa data
  delete(id: number) {
    const url = `/api/DayOff/Hide/${id}`;
    return instance.put(url);
  },
};
export default dayOffApi;
