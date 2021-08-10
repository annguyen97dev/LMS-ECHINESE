import { instance } from "~/apiBase/instance";

const url = "/api/CourseOfStudent";

class CourseStudentApi {
  getAll = (Params: any) =>
    instance.get<IApiResultData<ICourseOfStudent[]>>(url, {
      params: Params,
    });

  getDetail = (id: number) =>
    instance.get<IApiResultData<ICourseOfStudent>>(`${url}/${id}`);

  update = (data: ICourseOfStudent) => instance.put(url, data, {});
}

export const courseStudentApi = new CourseStudentApi();
