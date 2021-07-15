import { instance } from "~/apiBase/instance";

class Supplier {
    // Lấy tất cả data
    getAll = (todoApi: object) =>
    instance.get<IApiResultData<ISupplier[]>>("/api/SupplierServices", {
        params: todoApi,
    });

    // Thêm mới data
    add = (data) => instance.post("/api/SupplierServices", data);

    // Cập nhật data
    update = (data) => instance.put("/api/SupplierServices", data, {});
}

export const supplierApi = new Supplier();
