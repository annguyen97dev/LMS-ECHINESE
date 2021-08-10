import { instance } from "~/apiBase/instance";

class StudentApi {
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IStudent[]>>("/api/Student/", {
      params: todoApi,
    });

  getWithID = (ID: number) =>
<<<<<<< HEAD
    instance.get<IApiResultData<IStudent[]>>(`/api/Student/${ID}`);
=======
    instance.get<IApiResultData<IStudent>>(`/api/Student/${ID}`);
>>>>>>> 2226ecb0821090b727c071718e74b7ea5bab23d0

  add = (data: IStudent) => instance.post("/api/Student", data, {});

  update = (data: any) => instance.put("/api/Student/", data, {});

  // uploadImage = (file: any) =>

  //   instance.post("/api/UserInformation/uploadImage", file, {});

  uploadImage = (file: any) => {
    let fData = new FormData();
    fData.append("File", file);
    console.log("FDATA: ", fData);
    return instance.post("/api/UserInformation/uploadImage", fData, {});
  };
}

export const studentApi = new StudentApi();
