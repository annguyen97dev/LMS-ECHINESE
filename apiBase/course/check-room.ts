import {instance} from '../instance';

const url = '/api/CheckRoom/';
export const checkRoomApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ICheckSchedule[]>>(url, {params});
	},
};
