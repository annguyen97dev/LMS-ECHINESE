import { instance } from "~/apiBase/instance";

class BackgroundNewsFeed {
    // Lấy tất cả data
    getAll = () =>
    instance.get<IApiResultData<IBackgroundNewsFeed[]>>("/api/Background");

    // Lấy theo id
    getByID = (id:number) => 
    instance.get<IApiResultDetail>(`/api/Background/${id}`);
}

export const backgroundNewsFeedApi = new BackgroundNewsFeed();