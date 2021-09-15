import { instance } from "~/apiBase/instance";

const url = "/api/ExerciseGroup";
class ExerciseGroupApi {
  // Lấy tất cả data
  getAll = (params) =>
    instance.get<IApiResultData<IExerciseGroup[]>>(url, { params });

  // Lấy 1 data
  getWithID = (ID) =>
    instance.get<IApiResultData<IExerciseGroup>>(`${url}/${ID}`);

  // Thêm mới data
  add(data) {
    return instance.post(url, data);
  }
  // Cập nhật data
  update(data) {
    return instance.put(url, data);
  }
  // Xóa data
  delete(data: IExerciseGroup) {
    return instance.put(url, data);
  }

  // Upload file
  UploadAudio(data) {
    const formdata = new FormData();
    formdata.append("file", data);
    return instance.post("/api/uploadfileExercise", formdata);
  }
}

export const exerciseGroupApi = new ExerciseGroupApi();
