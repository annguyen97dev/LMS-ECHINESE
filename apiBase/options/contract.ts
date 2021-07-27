import {instance} from '../instance';

const url = '/api/Contract/';
export const contractApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IContract[]>>(url, {
			params,
		});
	},
	// Thêm mới data
	add(data: IContract) {
		return instance.post(url, data);
	},
	// Cập nhật data
	update(data: IContract) {
		return instance.put(url, data);
	},
	// Xóa data
	delete(data: IContract) {
		return instance.put(url, data);
	},
};
