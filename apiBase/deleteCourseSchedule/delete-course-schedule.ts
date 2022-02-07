import { instance } from '../instance';

const url = '/api/deleteCourseSchedule/';
export const deleteCourseScheduleApi = {
	// Xóa data
	delete(data) {
		return instance.put(url + data);
	}
};
