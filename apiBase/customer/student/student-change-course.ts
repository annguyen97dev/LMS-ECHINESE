import { instance } from "~/apiBase/instance";

const url = "/api/CourseOfStudentChange/";

class StudentChangeCourseApi {
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IStudentChangeCourse[]>>(url, {
      params: todoApi,
    });

  getWithID = (ID: number) =>
    instance.get<IApiResultData<IStudentChangeCourse>>(url + ID);

  add = (data: IStudent) => instance.post(url, data, {});

  update = (data: any) => instance.put(url, data, {});

  changeCourse = (data: ICourseOfStudentChange) => instance.post(url, data, {});
}

export const studentChangeCourseApi = new StudentChangeCourseApi();
