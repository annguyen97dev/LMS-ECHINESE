import { instance } from "~/apiBase/instance";

class Notification {
    // Lấy tất cả data
    getAll = (todoApi: object) =>
    instance.get<IApiResultData<INotification[]>>("/api/Notifications", {
        params: todoApi,
    });

    // Lấy data with user
    getAllWithUser = ( todoApi: object ) =>
    instance.get<IApiResultData>("/api/NotificationUser", {
        params: todoApi,
    });

    // Thêm mới data
    add = ( data ) => instance.post("/api/Notifications", data);

    // Cập nhật data đã xem
    upadteSeen = ( data: any ) => instance.put("/api/NotificationUser", data, {});
}

export const notificationApi = new Notification();
