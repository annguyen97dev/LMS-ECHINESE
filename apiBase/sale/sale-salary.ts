import {instance} from '../instance';

const url = '/api/SaleSalary/';
export const saleSalaryApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ISaleSalary[]>>(url, {
			params,
		});
	},
	// Lấy theo ID
	getByID(ID) {
		return instance.get<IApiResultData<ISaleSalary>>(`${url}${ID}`);
	},
	// Thêm mới data
	add(data) {
		return instance.post(url, data);
	},
	// Cập nhật data
	update(data) {
		return instance.put(url, data);
	},
};
