import { instance } from '../instance';

const url = '/api/CourseSchedules';
export const courseSchedulesApi = {
	// Lấy tất cả data
	getByID(params) {
		return instance.get<IApiResultData<any[]>>(url + `?CourseID=${params}`);
	}
};
