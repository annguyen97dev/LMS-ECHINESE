import { instance } from "~/apiBase/instance";

const url = "/api/CourseSchedule";

class TeacherCourseScheduleApi {
  getAll = (Params: any) =>
    instance.get<IApiResultData<ITeacherCourseSchedule[]>>(url, {
      params: Params,
    });

  getDetail = (id: number) =>
    instance.get<IApiResultData<ITeacherCourseSchedule>>(`${url}/${id}`);

  add = (data: ITeacherCourseSchedule) => instance.post(url, data);

  update = (data: ITeacherCourseSchedule) => instance.put(url, data, {});
}

export const teacherCourseScheduleApi = new TeacherCourseScheduleApi();
