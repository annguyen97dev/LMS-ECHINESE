import { instance } from "~/apiBase/instance";

class Purose {
    // Lấy tất cả data
    getAll = (todoApi: object) =>
    instance.get<IApiResultData<IPurpose[]>>("/api/Purposes", {
        params: todoApi,
    });

    // Thêm mới data
    add = (data) => instance.post("/api/Purposes", data);

    // Cập nhật data
    update = (data) => instance.put("/api/Purposes", data, {});
}

export const puroseApi = new Purose();