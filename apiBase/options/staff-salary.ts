import { instance } from "~/apiBase/instance";

class StaffSalary {
    // Lấy tất cả data
    getAll = (todoApi: object) =>
    instance.get<IApiResultData<IStaffSalary[]>>("/api/Salary", {
        params: todoApi,
    });

    // Thêm mới data
    add = (data) => instance.post("/api/Salary", data);

    // Cập nhật data
    update = (data) => instance.put("/api/Salary", data, {});
}

export const staffSalaryApi = new StaffSalary();
