import { instance } from "~/apiBase/instance";

class BranchApi {
  // Lấy tất cả data có phân trang
  getAll = (pageSize: number, pageIndex: number) =>
    instance.get<IApiResultData<IBranch[]>>("/api/Branch/GetAll", {
      params: {
        pageSize: pageSize,
        pageIndex: pageIndex,
      },
    });

  // Search branch code
  searchBranchCode = (code: number) =>
    instance.get<IApiResultData<IBranch[]>>("/api/Branch/GetAll", {
      params: {
        branchCode: code,
      },
    });

  // Search branch code
  searchBranchName = (name: string) =>
    instance.get<IApiResultData<IBranch[]>>("/api/Branch/GetAll", {
      params: {
        branchName: name,
      },
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
