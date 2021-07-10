import { instance } from "~/apiBase/instance";

const getParams = (todoApi) => {
  let params = null;
  let action = todoApi.action;

  switch (action) {
    case "getAll":
      params = {
        pageSize: 10,
        pageIndex: todoApi.pageIndex,
      };
      break;
    case "BranchCode":
      params = {
        branchCode: todoApi.value,
      };
      break;
    case "BranchName":
      params = {
        branchName: todoApi.value,
      };
      break;
    case "sortField":
      params = {
        sort: todoApi.sort,
      };
      break;
    case "sortType":
      params = {
        sortType: todoApi.sortType,
      };
    default:
      break;
  }

  return params;
};

class BranchApi {
  // Lấy tất cả data có phân trang
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IBranch[]>>("/api/Branch/GetAll", {
      params: getParams(todoApi),
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
