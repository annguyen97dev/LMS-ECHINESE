import {instance} from '../instance';

const url = '/api/AvailableDate/';
export const courseDetailAvailableDayApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ICourseDetailAvailableDay[]>>(url, {
			params,
		});
	},
};
