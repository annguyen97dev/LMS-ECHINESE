import { instance } from "~/apiBase/instance";

const url = "/api/ExerciseGroup";
class ExerciseGroupApi {
  // Lấy tất cả data
  getAll = (params) =>
    instance.get<IApiResultData<IExerciseGroup[]>>(url, { params });

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
    return instance.post("/api/uploadfileExercise", data);
  }
}

export const exerciseGroupApi = new ExerciseGroupApi();
