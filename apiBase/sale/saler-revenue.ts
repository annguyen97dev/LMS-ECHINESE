import {instance} from '../instance';

const url = '/api/SaleCampaignRevenue/';
export const salerRevenueApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ISalerRevenue[]>>(url, {
			params,
		});
	},
	// Lấy theo ID
	getByID(ID) {
		return instance.get<IApiResultData<ISalerRevenue>>(`${url}${ID}`);
	},
};
