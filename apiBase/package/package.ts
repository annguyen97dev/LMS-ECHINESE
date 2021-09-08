import {instance} from '../instance';

const url = '/api/SetPackage/';
export const packageApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IPackage[]>>(url, {
			params,
		});
	},
	// Lấy theo ID
	getByID(ID) {
		return instance.get<IApiResultData<IPackage>>(`${url}${ID}`);
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
