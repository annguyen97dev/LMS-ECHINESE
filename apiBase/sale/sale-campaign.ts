import {instance} from '../instance';

const url = '/api/SaleCampaign/';
export const saleCampaignApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ISaleCampaign[]>>(url, {
			params,
		});
	},
	// Lấy theo ID
	getByID(ID) {
		return instance.get<IApiResultData<ISaleCampaign>>(`${url}${ID}`);
	},
	// Thêm mới data
	add(data) {
		return instance.post(url, data);
	},
	// Cập nhật data
	update(data) {
		return instance.put(url, data);
	},
	// Xóa data
	delete(data) {
		return instance.put(url, data);
	},
};
