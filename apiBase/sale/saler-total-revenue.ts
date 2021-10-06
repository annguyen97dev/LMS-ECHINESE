import {instance} from '../instance';

const url = '/api/CounselorsRevenue/';
export const salerTotalRevenueApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ISalerTotalRevenue[]>>(url, {
			params,
		});
	},
	// Lấy theo ID
	getByID(ID) {
		return instance.get<IApiResultData<ISalerTotalRevenue>>(`${url}${ID}`);
	},
};
