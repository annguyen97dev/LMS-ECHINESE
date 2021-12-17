import { instance } from '../instance';
import _ from '~/appConfig';

const url = '/api/Lesson/';
export const lessonApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<ILesson>(url, {
			params
		});
	},

	callAuto(data) {
		return instance.put(`${_.API_URL}/api/Push`, null);
	},

	callAutoMinute(data) {
		return instance.put(`${_.API_URL}/api/PushOneMinute`, null);
	}
};
