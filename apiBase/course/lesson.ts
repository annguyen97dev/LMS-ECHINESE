import {instance} from '../instance';

const url = '/api/Lesson/';
export const lessonApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<ILesson>(url, {
			params,
		});
	},
};
