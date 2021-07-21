import { instance } from "~/apiBase/instance";

const url = "/api/FeedbackCategorys";
class FeedbackApi {
  getAll = (Params: any) =>
    instance.get<IApiResultData<IFeedback[]>>(url, {
      params: Params,
    });

  getDetail = (id: number) =>
    instance.get<IApiResultData<IFeedback>>(`${url}/${id}`);

  add = (data: IFeedback) => instance.post(url, data);

  update = (data: IFeedback) => instance.put(url, data, {});
}

export const feedbackApi = new FeedbackApi();
