import { instance } from "~/apiBase/instance";

class DistrictApi {
  getAll = (id: number) =>
    instance.get<IApiResult<IDistrict[]>>("/api/District/GetDistrict", {
      params: {
        id: id,
      },
    });

  getByArea = (areaID: number) =>
    instance.get<IApiResultData<IDistrict[]>>("/api/District/GetByAreaID", {
      params: {
        id: areaID,
      },
    });

  //   post = (data: IBranch) => instance.post("/api/Branch/InsertBranch", data);
}

export const districtApi = new DistrictApi();
