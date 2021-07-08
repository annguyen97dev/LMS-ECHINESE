import { instance } from "~/apiBase/instance";

class AreaApi {
  // getAll = () => instance.get<IApiResultData<IArea[]>>("/api/Area/GetAll");
  //   post = (data: IBranch) => instance.post("/api/Branch/InsertBranch", data);
  getAll = (selectAll: boolean) =>
    instance.get<IApiResultData<IArea[]>>("/api/Area/GetAll", {
      params: {
        selectall: selectAll,
      },
    });
}

export const areaApi = new AreaApi();
