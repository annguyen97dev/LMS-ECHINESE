import { instance } from "~/apiBase/instance";

class ExamComingSoon {
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IExamComingSoon[]>>("/api/ExamComingSoon", {
      params: todoApi,
    });
}

export const examComingSoonApi = new ExamComingSoon();
