import { instance } from "~/apiBase/instance";

class RoomApi {
  getAll = () => instance.get<IApiResult<IRoom[]>>("/api/Room/GetAllRoom");
  getWithID = (ID: number) =>
    instance.get<IApiResult<IRoom[]>>("/api/Room/GetRoom", {
      params: {
        id: ID,
      },
    });
  //   post = (data: IRoom) => instance.post("/api/Branch/InsertBranch", data);
  getRoomInBranch = (branchId: number) =>
    instance.get<IApiResult<IRoom>>(`/api/Room/GetRoom?id=${branchId}`);

  post = (data: IRoom) => instance.post("/api/Room/InsertRoom", data);
}

export const roomApi = new RoomApi();
