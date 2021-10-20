import { instance } from "~/apiBase/instance";

class StatisticalApi {
  // Lấy tất cả data
  getStatisticalTotal = (params) =>
    instance.get<IApiResultData<IStatistical[]>>("/api/StatisticalTotal", {
      params,
    });
  getStatisticalRevenueYear = (params) =>
    instance.get<IApiResultData<IStatRevenueYear[]>>(
      "/api/StatisticalRevenueYear",
      { params }
    );
  getStatisticalRevenueMonth = (params) =>
    instance.get<IApiResultData<IStatRevenueMonth[]>>(
      "/api/StatisticalRevenueMonth",
      { params }
    );
  getStatisticalRevenueDay = (params) =>
    instance.get<IApiResultData<IStatRevenueDay[]>>(
      "/api/StatisticalRevenueDay",
      { params }
    );
  getStatisticalStudentYear = (params) =>
    instance.get<IApiResultData<IStatStudentYear[]>>(
      "/api/StatisticalStudentYear",
      { params }
    );
  getStatisticalStudentMonth = (params) =>
    instance.get<IApiResultData<IStatStudentMonth[]>>(
      "/api/StatisticalStudentMonth",
      { params }
    );
  getStatisticalStudentDay = (params) =>
    instance.get<IApiResultData<IStatStudentDay[]>>(
      "/api/StatisticalStudentDay",
      { params }
    );
  getStatisticalRate = (params) =>
    instance.get<IApiResultData<IStatRate[]>>("/api/StatisticalRale", {
      params,
    });
  getStatisticalCourse = () =>
    instance.get<IApiResultData<IStatCourse[]>>(
      "/api/StatisticalCourse/2021",
      {}
    );
}

export const statisticalApi = new StatisticalApi();
