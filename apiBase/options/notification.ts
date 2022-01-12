import { instance } from "~/apiBase/instance";

class Notification {
    // Lấy tất cả data
    getAll = (todoApi: object) =>
    instance.get<IApiResultData<INotification[]>>("/api/Notifications", {
        params: todoApi,
    });

    // Get data with id
    // getByID = (id) => 
    // instance.get<IApiResultData>(`/api/Notifications/${id}`);

    // Thêm mới data
    add = ( data ) => instance.post("/api/Notifications", data);

    // Lấy data with user
    getAllWithUser = ( todoApi: object ) =>
    instance.get<IApiResultData>("/api/NotificationUser", {
        params: todoApi,
    });

    // Cập nhật data đã xem
    updateSeen = ( data: any ) => instance.put("/api/NotificationUser", data, {});
}

export const notificationApi = new Notification();
