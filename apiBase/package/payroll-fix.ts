import { instance } from '../instance';

const url = '/api/PayrollFix/';
export const payrollFixApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IPayrollFix[]>>(url, {
			params
		});
	},
	// Lấy theo ID
	getByID(ID) {
		return instance.get<IApiResultData<IPayrollFix>>(`${url}${ID}`);
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
	}
};
