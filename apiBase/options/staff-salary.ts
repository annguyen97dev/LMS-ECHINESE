import { instance } from "~/apiBase/instance";

class StaffSalary {
    // Lấy tất cả data có phân trang
    getAll = (pageSize: number, pageIndex: number) =>
    instance.get<IApiResultData<IStaffSalary[]>>("/api/Salary/GetAll", {
        params: {
            pageSize: pageSize,
            pageIndex: pageIndex,
        },
    });

    // Lấy tất cả nhân viên 
    getAllStaff = () => 
        instance.get<IApiResultData>("/api/Salary/GetAllStaff");
    
    // Lấy List ROLE
    getListRole = () => 
        instance.get("/api/Salary/GetListRole");

    // Search branch code
    // searchBranchCode = (code: number) =>
    // instance.get<IApiResultData<IBranch[]>>("/api/Branch/GetAll", {
    //     params: {
    //     branchCode: code,
    //     },
    // });

    // Search branch code
    // searchBranchName = (name: string) =>
    // instance.get<IApiResultData<IBranch[]>>("/api/Branch/GetAll", {
    //     params: {
    //     branchName: name,
    //     },
    // });

    // Lấy chi tiết data theo ID
    getByID = (id: number) =>
    instance.get<IApiResultData<IStaffSalary[]>>(`/api/Salary/GetByID/${id}`);

    // Thêm mới data
    add = (data) => instance.post("/api/Salary/Insert", data);

    // Cập nhật data
    update = (data) => instance.put("/api/Salary/Update", data, {});
}

export const staffSalaryApi = new StaffSalary();
