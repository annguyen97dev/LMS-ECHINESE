import {instance} from '../instance';

const url = '/api/SetPackageStudent/';
export const packageStudentApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IPackageStudent[]>>(url, {
			params,
		});
	},
	// Lấy theo ID
	getByID(ID) {
		return instance.get<IApiResultData<IPackageStudent>>(`${url}${ID}`);
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
