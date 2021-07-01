import { instance } from "~/apiBase/instance";

class BranchApi {
  getAll = () =>
    instance.get<IApiResult<IBranch[]>>("/api/Branch/GetAllBranch");
  getAllNoPage = () =>
    instance.get<IApiResult<IBranch[]>>("/api/Branch/GetAll");
  getPagination = (pageIndex: number) =>
    instance.get<IApiResultData<IBranch[]>>("/api/Branch/GetAllBranch", {
      params: {
        page: pageIndex,
      },
    });

  getDetail = (id: number) =>
    instance.get<IApiResult<IBranch>>(`/api/Branch/GetBranch?id=${id}`);

  post = (data: IBranch) => instance.post("/api/Branch/InsertBranch", data);
  put = (data: IBranch) => instance.put("/api/Branch/UpdateBranch", data, {});
}

export const branchApi = new BranchApi();
