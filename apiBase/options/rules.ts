import { instance } from "~/apiBase/instance";

class Rules {
    // Lấy tất cả data
    getAll = (params) =>
    instance.get<IApiResultData<IRules[]>>("/api/Rules", {
        params
    });

    // Thêm mới data
    // add = ( data: IPurpose ) => instance.post("/api/Purposes", data);

    // Cập nhật data
    update = ( data: any ) => instance.put("/api/Rules", data, {});
}

export const rulesApi = new Rules();