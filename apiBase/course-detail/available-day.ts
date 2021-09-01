import {instance} from '../instance';

const url = '/api/LoadAvailableDate/';
export const courseDetailAvailableDayApi = {
	// Lấy tất cả data
	getAll(ID) {
		return instance.get<IApiResultData<ICourseDetailAvailableDay[]>>(
			`${url}${ID}`
		);
	},
};
