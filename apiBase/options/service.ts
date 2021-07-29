import { instance } from "~/apiBase/instance";

class ServiceApi {
    // Lấy tất cả data
    getAll = (todoApi: object) =>
        instance.get<IApiResultData<IService[]>>("/api/Services", {
            params: todoApi,
        });
    
    // Thêm mới data
    add = (data: IService) => instance.post("/api/Services", data, {});

    // Cập nhật data 
    update = ( data: any ) => instance.put("/api/Services", data, {}); 
}

export const serviceApi = new ServiceApi();