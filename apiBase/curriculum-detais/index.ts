import { instance } from "../instance";
import { ICurriculumDetail } from "../types/curriculum-detais/curriculum-detais";

const url = "/api/LessonDetail";

export const LessonDetail = {
  // Lấy tất cả data
  getAll(ID) {
    return instance.get<IApiResultData<ICurriculumDetail[]>>(
      `${url + "?CurriculumDetailID="}${ID}`
    );
  },

  // Lấy data theo ID
  GetByID(ID) {
    return instance.get<IApiResultData<ICurriculumDetail[]>>(
      `${url + "/"}${ID}`
    );
  },

  // Cập nhật
  update(data) {
    return instance.put(url, data);
  },
};
