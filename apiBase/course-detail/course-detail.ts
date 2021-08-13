import {instance} from '../instance';

const url = '/api/CourseSchedules/';
export const courseDetailApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ICourseDetail[]>>(url, {
			params,
		});
	},
	// Cập nhật
	update(data) {
		return instance.put(url, data);
	},
};
