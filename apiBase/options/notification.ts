import { instance } from "~/apiBase/instance";

class Notification {
    // Lấy tất cả data
    getAll = (todoApi: object) =>
    instance.get<IApiResultData<INotification[]>>("/api/Notifications", {
        params: todoApi,
    });

    // Thêm mới data
    add = ( data ) => instance.post("/api/Notifications", data);

    // Cập nhật data
    // update = ( data: any ) => instance.put("/api/Salary", data, {});
}

export const notificationApi = new Notification();
