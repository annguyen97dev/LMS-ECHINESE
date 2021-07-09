import { instance } from "~/apiBase/instance";

class ServiceApi {
    getAll = () =>
        instance.get<IApiResultData<IService[]>>("/api/Services/GetAll");
    getWitdhID = (ServiceId: number) =>
        instance.get<IApiResultData<IService[]>>("/api/Services/GetByID", {
            params: {
                id: ServiceId
            }
        });
    post = (data: IService) => instance.post("/api/Services/Insert", data, {}); 
    put = (data: IService) => instance.put("/api/Services/Update", data, {}); 
    changeStatus = (id: number) => instance.delete(`/api/Services/Hide/${id}`);
}

export const serviceApi = new ServiceApi();