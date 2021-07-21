import { instance } from "~/apiBase/instance";

class SourceInfomation {
    // Lấy tất cả data
    getAll = (todoApi: object) =>
    instance.get<IApiResultData<ISourceInfomation[]>>("/api/SourceInformation", {
        params: todoApi,
    });

    // Thêm mới data
    add = ( data: ISourceInfomation ) => instance.post("/api/SourceInformation", data);

    // Cập nhật data
    update = ( data: any ) => instance.put("/api/SourceInformation", data, {});
}

export const sourceInfomationApi = new SourceInfomation();
