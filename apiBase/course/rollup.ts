import {instance} from '../instance';

const url = '/api/RollUp/';
export const rollUpApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IRollUp[]>>(url, {
			params,
		});
	},
};
