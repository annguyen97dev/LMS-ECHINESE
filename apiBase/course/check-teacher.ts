import {instance} from '../instance';

const url = '/api/CheckTeacher/';
export const checkTeacherApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ICheckSchedule[]>>(url, {params});
	},
};
