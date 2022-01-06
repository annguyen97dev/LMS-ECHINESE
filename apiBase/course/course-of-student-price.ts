import { instance } from '../instance';

const url = '/api/CourseOfStudentPrice';

export const courseOfStudentPriceApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<any>>(url, {
			params
		});
	},
	// Thêm mới data
	add(data) {
		return instance.post(url, data);
	}
};
