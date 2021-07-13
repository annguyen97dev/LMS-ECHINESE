import { instance } from "~/apiBase/instance";

const getParams = (todoApi) => {
  let params = null;
  let action = todoApi.action;

  switch (action) {
    case "getAll":
      params = {
        pageSize: 10,
        pageIndex: todoApi.pageIndex,
      };
      break;
    case "BranchCode":
      params = {
        branchCode: todoApi.value,
      };
      break;
    case "BranchName":
      params = {
        branchName: todoApi.value,
      };
      break;
    case "sortField":
      params = {
        sort: todoApi.sort,
      };
      break;
    case "sortType":
      params = {
        sortType: todoApi.sortType,
      };
    default:
      break;
  }

  return params;
};

class GradeApi {
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IGrade[]>>("/api/Grade/GetAll", {
      params: getParams(todoApi),
    });

  getWithID = (CourseID: number) =>
    instance.get<IApiResult<IGrade[]>>("/api/Course/GetCourse", {
      params: {
        id: CourseID,
      },
    });

  addData = (data: IGrade) => instance.post("/api/Grade/Insert", data, {});
  put = (data: IGrade) => instance.put("/api/Course/UpdateCourse", data, {});
  patch = (data: any) => instance.patch("/api/Course/UpdateHiddenCourse", data);
}

export const gradeApi = new GradeApi();
