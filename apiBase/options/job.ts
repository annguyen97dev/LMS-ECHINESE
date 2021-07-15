import { instance } from "~/apiBase/instance";

class JobApi {
  getAll = (jobParams: any) =>
    instance.get<IApiResultData<IJob[]>>("/api/Job", {
      params: jobParams,
    });

  getDetail = (id: number) => instance.get<IApiResult<IJob>>(`/api/Job/${id}`);

  add = (data: IJob) => instance.post("/api/Job", data);

  update = (data: IJob) => instance.put("/api/Job", data, {});
}

export const jobApi = new JobApi();
