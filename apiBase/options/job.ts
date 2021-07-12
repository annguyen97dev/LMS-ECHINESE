import { instance } from "~/apiBase/instance";

class JobApi {
  getAll = (pageSize: number, pageIndex: number) =>
    instance.get<IApiResultData<IJob[]>>("/api/Job/GetAll", {
      params: {
        pageSize: pageSize,
        pageIndex: pageIndex,
      },
    });

  getDetail = (id: number) =>
    instance.get<IApiResult<IJob>>(`/api/Job/GetByID/${id}`);

  add = (data: IJob) => instance.post("/api/Job/Insert", data);

  update = (data: IJob) => instance.put("/api/Job/Update", data, {});
}

export const jobApi = new JobApi();
