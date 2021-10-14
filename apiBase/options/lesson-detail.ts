import { instance } from "~/apiBase/instance";

const url = "/api/LessonDetail"
class LessonDetailApi {
  update = (data: any) => instance.put(url , data, {});

  add = (data: any) => instance.post(url , data, {});

  UploadDocument(data) {
    const formdata = new FormData();
    formdata.append("file", data);
    return instance.post("/api/UploadDocumentLessonDetail", formdata);
  }
  UploadHtml(data) {
    const formdata = new FormData();
    formdata.append("file", data);
    return instance.post("/api/UploadHTML5LessonDetail", formdata);
  }
}

export const lessonDetailApi = new LessonDetailApi();
