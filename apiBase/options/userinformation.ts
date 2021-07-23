import {instance} from '~/apiBase/instance';

class UserInformation {
	// Lấy tất cả data
	getAllParams = (params) =>
		instance.get<IApiResultData<IUserinformation[]>>('/api/UserInformation', {
			params,
		});
	getAll = () =>
		instance.get<IApiResultData<IUserinformation[]>>('/api/UserInformation');

	// Lấy chi tiết data theo ID
	getByID = (id: number) =>
		instance.get<IApiResultData<IStaffSalary[]>>(`/api/UserInformation/${id}`);

	// Lấy theo role
	getAllRole = (role) =>
		instance.get<IApiResultData<IUserinformation[]>>('/api/UserInformation', {
			params: {
				RoleID: role,
			},
		});
}

export const userInformationApi = new UserInformation();
