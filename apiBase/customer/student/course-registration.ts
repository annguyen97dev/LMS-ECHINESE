import { instance } from "~/apiBase/instance";

const url = "/api/CourseRegistration";

class CourseRegistrationApi {
  getAll = (Params: any) =>
    instance.get<IApiResultData<ICourseRegistration[]>>(url, {
      params: Params,
    });

  getDetail = (id: number) =>
    instance.get<IApiResultData<ICourseRegistration>>(`${url}/${id}`);

  add = (data: ICourseRegistration) => instance.post(url, data);

  update = (data: ICourseRegistration) => instance.put(url, data, {});

  // chuyển học viên vào khóa
  intoCourse = (data: ICourseRegistrationIntoCourse) =>
    instance.post("/api/InsertCourse", data);
}

export const courseRegistrationApi = new CourseRegistrationApi();
