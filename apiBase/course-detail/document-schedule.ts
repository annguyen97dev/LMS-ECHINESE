import {instance} from '../instance';

const url = '/api/DocumentOfCourse/';
export const documentScheduleApi = {
	// Cập nhật
	add(data) {
		return instance.post(url, data);
	},
};
