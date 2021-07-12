import { instance } from "~/apiBase/instance";

const getParams = (todoApi) => {
  let params = {};
  let action = todoApi.action;

  console.log("PARAMS in api 111: ", params);

  switch (action) {
    case "getAll":
      params = { ...todoApi.params };
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

  console.log("PARAMS in api: ", params);
  return params;
};

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
