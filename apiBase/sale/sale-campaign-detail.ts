import {instance} from '../instance';

const url = '/api/SaleCampaignDetail/';
export const saleCampaignDetailApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ISaleCampaignDetail[]>>(url, {
			params,
		});
	},
	// Lấy theo ID
	getByID(ID) {
		return instance.get<IApiResultData<ISaleCampaignDetail>>(`${url}${ID}`);
	},
};
