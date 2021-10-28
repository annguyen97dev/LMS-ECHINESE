import { instance } from "../instance";
import { IVideoLearning } from "../types/video-learning/video-learning";

const url = "/api/VideoCourseOfStudent/";
export const VideoCourseOfStudent = {
  // Lấy tất cả data
  getAll(params) {
    return instance.get<IApiResultData<IVideoLearning[]>>(url, {
      params,
    });
  },

  // Lấy data theo user
  GetByID(ID) {
    return instance.get<IApiResultData<IVideoLearning[]>>(
      `${url + "GetByID/"}${ID}`
    );
  },

  // Lấy data GetLessonInProgress
  GetLessonInProgress() {
    return instance.get<IApiResultData<IVideoLearning[]>>(
      url + "GetLessonInProgress/"
    );
  },
};

const urlInteractio = "/api/VideoCourseInteraction/";
export const VideoCourseInteraction = {
  GetByID(ID) {
    return instance.get<IApiResultData<IVideoLearning[]>>(
      `${urlInteractio + "GetByID/"}${ID}`
    );
  },

  ListQA(params) {
    return instance.get<IApiResultData<IVideoLearning[]>>(
      urlInteractio + "ListQA",
      {
        params,
      }
    );
  },

  ListNote(params) {
    return instance.get<IApiResultData<IVideoLearning[]>>(
      urlInteractio + "ListNote",
      {
        params,
      }
    );
  },

  add(data) {
    return instance.post(urlInteractio + "Insert", data);
  },
};

const urlVideoCourses = "/api/VideoCourses/";
export const VideoCourses = {
  ListSection(ID) {
    return instance.get<IApiResultData<IVideoLearning[]>>(
      `${urlVideoCourses + "ListSection/"}${ID}`
    );
  },

  ListLesson(params) {
    return instance.get<IApiResultData<IVideoLearning[]>>(
      urlVideoCourses + "ListLesson",
      {
        params,
      }
    );
  },

  ListQA(params) {
    return instance.get<IApiResultData<IVideoLearning[]>>(
      urlVideoCourses + "ListQA",
      {
        params,
      }
    );
  },

  LessonDetail(params) {
    return instance.get<IApiResultData<IVideoLearning[]>>(
      urlVideoCourses + "LessonDetail",
      {
        params,
      }
    );
  },
};
