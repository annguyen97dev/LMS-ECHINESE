import { instance } from "~/apiBase/instance";

class DistrictApi {
  getAll = (id: number) =>
    instance.get<IApiResult<IDistrict[]>>("/api/District/GetDistrict", {
      params: {
        id: id,
      },
    });
  //   post = (data: IBranch) => instance.post("/api/Branch/InsertBranch", data);
}

export const districtApi = new DistrictApi();
