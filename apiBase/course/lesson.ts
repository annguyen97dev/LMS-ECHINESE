import { instance } from '../instance';

const url = '/api/Lesson/';
export const lessonApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<ILesson>(url, {
			params
		});
	},

	callAuto(data) {
		return instance.put('http://lmsv2.monamedia.net/api/Push', null);
	},

	callAutoMinute(data) {
		return instance.put('http://lmsv2.monamedia.net/api/PushOneMinute', null);
	}
};
