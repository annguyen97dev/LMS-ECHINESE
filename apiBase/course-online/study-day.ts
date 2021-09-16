import {instance} from '../instance';

const url = '/api/StudyDayOnline';
export const studyDayOnlineApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IStudyDay[]>>(url, {
			params,
		});
	},
};
