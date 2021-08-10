import {instance} from '../instance';

const url = '/api/CourseSchedules/';
export const courseDetailApi = {
	// Lấy tất cả data
	getByID(ID) {
		return instance.get<IApiResultData<ICourseDetail[]>>(url, {
			params: {CourseID: ID},
		});
	},
	// Cập nhật
	update(data) {
		return instance.put(url, data);
	},
};
