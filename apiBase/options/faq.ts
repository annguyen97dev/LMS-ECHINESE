import { instance } from "~/apiBase/instance";

const url = "/api/FrequentlyQuestions/";

class FAQ {
  getAll = (Params: any) =>
    // instance.get<IApiResultData<IFaq[]>>(url, { params: Params });
    instance.get(url, { params: Params });

  add = (data) => instance.post(url, data);

  update = (data) => instance.put(url, data, {});
}

export const faqApi = new FAQ();
