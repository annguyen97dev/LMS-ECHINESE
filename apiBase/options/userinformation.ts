import { instance } from "~/apiBase/instance";

class UserInformation {
    // Lấy tất cả data
    getAll = () =>
    instance.get<IApiResultData<IUserinformation[]>>("/api/UserInformation");

    // Lấy chi tiết data theo ID
    getByID = (id: number) =>
    instance.get<IApiResultData<IStaffSalary[]>>(`/api/UserInformation/${id}`);
}

export const userInformationApi = new UserInformation();