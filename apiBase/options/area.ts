import { instance } from "~/apiBase/instance";

class AreaApi {
  getAll = () => instance.get<IApiResult<IArea[]>>("/api/Area/GetAllArea");
  //   post = (data: IBranch) => instance.post("/api/Branch/InsertBranch", data);
}

export const areaApi = new AreaApi();
