import {instance} from '../instance';

const url = '/api/TaskGroup/';
export const taskGroupApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ITaskGroup[]>>(url, {
			params,
		});
	},
	// Thêm
	add(data) {
		return instance.post(url, data);
	},
	// Cập nhật
	update(data) {
		return instance.put(url, data);
	},
	// Xóa
	delete(data) {
		return instance.put(url, data);
	},
};

const url2 = '/api/Task/';
export const taskApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData>(url2, {
			params,
		});
	},
	// Thêm
	add(data) {
		return instance.post(url2, data);
	},
	// Cập nhật
	update(data) {
		return instance.put(url2, data);
	},
	// Xóa
	delete(data) {
		return instance.put(url2, data);
	},
};

const url3 = '/api/StaffOfTaskGroup/';
export const staffOfTaskGroupApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData>(url3, {
			params,
		});
	},
	// Thêm
	add(data) {
		return instance.post(url3, data);
	},
	// Cập nhật
	update(data) {
		return instance.put(url3, data);
	},
	// Xóa
	delete(data) {
		return instance.put(url3, data);
	},
};
