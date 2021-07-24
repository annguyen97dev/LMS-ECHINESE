import {instance} from '../instance';

const url = '/api/CheckStudyTime/';
export const checkStudyTimeApi = {
	// Lấy tất cả data
	check(data) {
		return instance.post<IApiResultData<ICheckStudyTime[]>>(url, data);
	},
};
