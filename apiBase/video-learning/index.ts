import { instance } from "../instance";
import { IVideoLearning } from "../types/video-learning/video-learning";

const url = "/api/LessonDetail";

export const VideoLearningAPI = {
  // Lấy tất cả data
  getAll(ID) {
    return instance.get<IApiResultData<IVideoLearning[]>>(
      `${url + "?CurriculumDetailID="}${ID}`
    );
  },

  // Lấy data theo user
  getByUser(ID) {
    return instance.get<IApiResultData<IVideoLearning[]>>(
      `${url + "GetByUser/"}${ID}`
    );
  },
};
