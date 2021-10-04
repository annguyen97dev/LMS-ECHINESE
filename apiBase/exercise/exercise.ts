import { Upload } from "antd";
import { instance } from "~/apiBase/instance";

const url = "/api/Exercise";
class ExerciseApi {
  // Lấy tất cả data
  getAll = (params) =>
    instance.get<IApiResultData<IExercise[]>>(url, { params });

  // Thêm mới data
  add(data: IExercise) {
    return instance.post(url, data);
  }
  // Cập nhật data
  update(data: IExercise) {
    return instance.put(url, data);
  }
  // Xóa data
  delete(data: IExercise) {
    return instance.put(url, data);
  }

  // Import Excel
  importExcel(file: File) {
    let fData = new FormData();
    fData.append("File", file);
    return instance.post("/api/ImportExercise", fData, {});
  }
}

export const exerciseApi = new ExerciseApi();
