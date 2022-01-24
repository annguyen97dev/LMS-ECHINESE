import { instance } from '../instance';
const url = '/api/Document';

export const devApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IDocumentList[]>>(
			`${url + '?CategoryID='}${params.CategoryID}${'&DocumentName='}${params.DocumentName}`
		);
	},
	checkPass(params) {
		return instance.post('/api/CheckPass_Dev', params);
	},
	loginByDev(params) {
		let formdata = new FormData();
		formdata.append('roleId', params.roleId);
		return instance.post('/api/LoginByDev', formdata);
	}
};
