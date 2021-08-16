import { instance } from "~/apiBase/instance";

class NewsFeedLike {
    // Lấy tất cả data
    getAll = (todoApi: object) =>
    instance.get<IApiResultData<INewsFeedLike[]>>("/api/NewsFeedLike", {
        params: todoApi,
    });

    // Thêm mới data
    add = ( data: any ) => instance.post("/api/NewsFeedLike", data);

}

export const newsFeedLikeApi = new NewsFeedLike();