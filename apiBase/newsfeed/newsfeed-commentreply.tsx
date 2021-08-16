import { instance } from "~/apiBase/instance";

class NewsFeedCommentReply {
    // Lấy tất cả data
    getAll = (todoApi: object) =>
    instance.get<IApiResultData<INewsFeedCommentReply[]>>("/api/CommentReply", {
        params: todoApi,
    });

    // Thêm mới data
    add = ( data: INewsFeedCommentReply ) => instance.post("/api/CommentReply", data);

    // Update data
    update = ( data:any ) => instance.put("/api/CommentReply", data);

}

export const newsFeedCommentReplyApi = new NewsFeedCommentReply();