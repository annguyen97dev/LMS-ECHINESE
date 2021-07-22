import { instance } from "~/apiBase/instance";

class DiscountApi {
    // Lấy tất cả data
    getAll = (todoApi: object) =>
        instance.get<IApiResultData<IDiscount[]>>("/api/Discount", {
            params: todoApi,
        });
    
    // Thêm mới data
    add = (data: IDiscount) => instance.post("/api/Discount", data, {});

    // Cập nhật data 
    update = (data: IDiscount) => instance.put("/api/Discount", data, {}); 
}

export const discountApi = new DiscountApi();