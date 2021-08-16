import { instance } from "~/apiBase/instance";

class GroupNewsFeed {
    // Lấy tất cả data
    getAll = (todoApi: object) =>
    instance.get<IApiResultData<IGroupNewsFeed[]>>("/api/GroupNewsFeed", {
        params: todoApi,
    });

    // Thêm mới data
    add = ( data: IGroupNewsFeed ) => instance.post("/api/GroupNewsFeed", data);

    // Cập nhật data
    update = ( data: any ) => instance.put("/api/GroupNewsFeed", data, {});
}

export const groupNewsFeedApi = new GroupNewsFeed();