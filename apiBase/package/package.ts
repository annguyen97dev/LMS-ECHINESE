import {instance} from '../instance';

const url = '/api/SetPackage/';
export const packageApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IPackage[]>>(url, {
			params,
		});
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
	// Xóa data
	uploadImg(data) {
		return instance.post('api/SetPackageUpLoad', data);
	},
};
