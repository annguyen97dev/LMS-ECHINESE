import { instance } from "~/apiBase/instance";

class JobApi {
  getAll = (pageSize: number, pageIndex: number) =>
    instance.get<IApiResultData<IJob[]>>("/api/Job", {
      params: {
        pageSize: pageSize,
        pageIndex: pageIndex,
      },
    });

  getDetail = (id: number) => instance.get<IApiResult<IJob>>(`/api/Job/${id}`);

  add = (data: IJob) => instance.post("/api/Job", data);

  update = (data: IJob) => instance.put("/api/Job", data, {});
}

export const jobApi = new JobApi();
