import {instance} from '../instance';

const url = '/api/DayOff/';
export const dayOffApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IDayOff[]>>(url, {
			params,
		});
	},
	// Thêm mới data
	add(data: IDayOff) {
		return instance.post(url, data);
	},
	// Cập nhật data
	update(data: IDayOff) {
		return instance.put(url, data);
	},
	// Xóa data
	delete(data: IDayOff) {
		return instance.put(url, data);
	},
};
