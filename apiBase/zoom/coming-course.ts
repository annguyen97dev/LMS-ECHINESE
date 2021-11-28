import { instance } from '../instance';

const url = '/api/ComingSoonCourseSchedule/';
export const comingCourseApi = {
	// Lấy tất cả data
	getAll() {
		return instance.get<IApiResultData<IComingCourse>>(url);
	}
};
