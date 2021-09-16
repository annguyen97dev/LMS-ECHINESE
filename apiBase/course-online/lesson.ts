import {instance} from '../instance';

const url = '/api/LessonOnline';
export const lessonOnlineApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<ILesson>(url, {
			params,
		});
	},
};
