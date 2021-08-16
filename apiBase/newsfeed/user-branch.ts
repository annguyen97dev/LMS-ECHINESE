import { instance } from "~/apiBase/instance";

class UserBranch {
    // Lấy tất cả data
    getAll = (todoApi: object) =>
    instance.get<IApiResultData<IUserBranch[]>>("/api/UserBranch", {
        params: todoApi,
    });

    // Thêm mới data
    add = ( data: IUserBranch ) => instance.post("/api/UserBranch", data);

    // Cập nhật data
    update = ( data: any ) => instance.put("/api/UserBranch", data, {});
}

export const userBranchApi = new UserBranch();