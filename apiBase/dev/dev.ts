import { instance } from '../instance';

export const devApi = {
	// Lấy tất cả data
	getAllMenuByRole(params) {
		return instance.get<IApiResultData<IMenuByRole[]>>(`/api/Menu`, { params });
	},
	checkPass(params) {
		return instance.post('/api/CheckPass_Dev', params);
	},
	loginByDev(params) {
		let formdata = new FormData();
		formdata.append('roleId', params.roleId);
		return instance.post('/api/LoginByDev', formdata);
	},
	insertMenu(data: IMenuAddData) {
		return instance.post('/api/Menu', data, {});
	},
	updateMenu(data: IMenuEditData) {
		return instance.put('/api/Menu', data, {});
	}
};
