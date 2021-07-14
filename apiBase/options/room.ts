import { instance } from "~/apiBase/instance";

class RoomApi {
  // Lấy tất cả
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IRoom[]>>("/api/Room/", {
      params: todoApi,
    });

  // Get by ID
  getById = (id: any) =>
    instance.get<IApiResultData<IRoom[]>>(`/api/Room/${id}`);

  // Update data
  update = (data: any) => instance.put("/api/Room", data);

  // Add data
  add = (data: IRoom) => instance.post("/api/Room/", data);
}

export const roomApi = new RoomApi();
