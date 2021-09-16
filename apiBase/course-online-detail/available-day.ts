import {instance} from '../instance';

const url = '/api/AvailableDateOnline/';
export const courseOnlineDetailAvailableDayApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ICourseDetailAvailableDay[]>>(url, {
			params,
		});
	},
};
