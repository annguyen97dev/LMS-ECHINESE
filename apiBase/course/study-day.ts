import {instance} from '../instance';

const url = '/api/StudyDay/';
export const studyDayApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IStudyDay[]>>(url, {
			params,
		});
	},
};
