import { instance } from "~/apiBase/instance";

class NewsFeedComment {
    // Lấy tất cả data
    getAll = (todoApi: object) =>
    instance.get<IApiResultData<INewsFeedComment[]>>("/api/NewsFeedComment", {
        params: todoApi,
    });

    // Thêm mới data
    add = ( data: any ) => instance.post("/api/NewsFeedComment", data);

}

export const newsFeedCommentApi = new NewsFeedComment();