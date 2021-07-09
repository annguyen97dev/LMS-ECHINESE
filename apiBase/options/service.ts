import { instance } from "~/apiBase/instance";

class ServiceApi {
    getAll = () =>
        instance.get<IApiResult<IService[]>>("/api/Services/GetAll");
    getWitdhID = (ServiceId: number) =>
        instance.get<IApiResult<IService[]>>("/api/Services/GetServices", {
            params: {
                id: ServiceId
            }
        });
    post = (data: IService) => instance.post("/api/Services/InsertServices", data, {}); 
    put = (data: IService) => instance.put("/api/Services/UpdateServices", data, {}); 
    patch = (data: any) => instance.patch("/api/Services/UpdateHiddenService", data);
}

export const serviceApi = new ServiceApi();