import { instance } from "../instance";

const url = "/api/ExamTopicDetail/";
export const examDetailApi = {
  // Lấy tất cả data
  getAll(params) {
    return instance.get<IApiResultData<IExamDetail[]>>(url, {
      params,
    });
  },
  // Lấy theo ID
  getByID(ID) {
    return instance.get<IApiResultData<IExamDetail>>(`${url}${ID}`);
  },
  // Thêm mới data
  add(data: any) {
    return instance.post(url, data);
  },
  // Cập nhật data
  update(data: any) {
    return instance.put(url, data);
  },
  // Xóa data
  delete(data: any) {
    return instance.put(url, data);
  },
  // Tạo câu hỏi tự động
  createAuto(data: any) {
    return instance.post("api/AutoCreateExamtopicDetail", data);
  },
  // Đổi vị trí
  changePosition(data: any) {
    return instance.put("api/UpdateIndex", data);
  },
};
