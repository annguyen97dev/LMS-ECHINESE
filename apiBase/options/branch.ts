import { instance } from "~/apiBase/instance";

class BranchApi {
  // Lấy tất cả data có phân trang
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IBranch[]>>("/api/Branch/GetAll", {
      // params: getParams(todoApi),
      params: todoApi,
    });

  // Lấy chi tiết data theo ID
  getByID = (id: number) =>
    instance.get<IApiResultData<IBranch>>(`/api/Branch/GetById`, {
      params: {
        id: id,
      },
    });

  // Cập nhật trạng thái ẩn/hiện
  changeStatus = (id: number) =>
    instance.put<IApiResultData<IBranch[]>>(`/api/Branch/Hide/${id}`);

  // Thêm mới data
  add = (data: IBranch) => instance.post("/api/Branch/Insert", data);

  // Cập nhật data
  update = (data: IBranch) => instance.put("/api/Branch/Update", data, {});
}

export const branchApi = new BranchApi();
