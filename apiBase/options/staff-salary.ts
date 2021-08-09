import { instance } from "~/apiBase/instance";

class StaffSalary {
  // Lấy tất cả data
  getAll = (todoApi: object) =>
    instance.get<IApiResultData<IStaffSalary[]>>("/api/Salary", {
      params: todoApi,
    });

  // Lấy dât theo id

  getByID = (id: number) =>
    instance.get<IApiResultData<IStaffSalary[]>>(`/api/Salary/${id}`);

  // Thêm mới data
  add = (data: IStaffSalary) => instance.post("/api/Salary", data);

  // Cập nhật data
  update = (data: any) => instance.put("/api/Salary", data, {});
}

export const staffSalaryApi = new StaffSalary();
