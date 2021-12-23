import { instance } from "~/apiBase/instance";

const url = "/api/CourseReserve";

class CourseReserveApi {
  getAll = (Params: any) =>
    instance.get<IApiResultData<ICourseReserve[]>>(url, {
      params: Params,
    });

  getDetail = (id: number) =>
    instance.get<IApiResultData<ICourseReserve>>(`${url}/${id}`);

  add = (data: ICourseReserve) => instance.post(url, data);

  update = (data: {ID: string, ExpirationDate: string}) => instance.put(url, data, {});

  // reserve insert student to course
  reserveAddCourse = (data: ICourseReserve) =>
    instance.post("/api/ReserveInsertCourse", data);
}

export const courseReserveApi = new CourseReserveApi();
