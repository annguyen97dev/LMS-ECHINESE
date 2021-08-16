import { instance } from "~/apiBase/instance";

class NewsFeed {
    // Lấy tất cả data
    getAll = (todoApi: object) =>
    instance.get<IApiResultData<INewsFeed[]>>("/api/NewsFeed", {
        params: todoApi,
    });

    // Thêm mới data
    add = ( data: INewsFeed ) => instance.post("/api/NewsFeed", data);

    // Cập nhật data
    update = ( data: any ) => instance.put("/api/NewsFeed", data, {});
}

export const newsFeedApi = new NewsFeed();