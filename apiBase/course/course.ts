import {instance} from '../instance';

const url = '/api/Course/';
export const courseApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ICourse[]>>(url, {
			params,
		});
	},
	// Thêm mới data
	add(data) {
		return instance.post(url, data);
	},
};
