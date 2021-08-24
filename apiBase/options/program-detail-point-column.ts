import {instance} from '../instance';

const url = '/api/PointColumn/';
export const programDetailPointColumnApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IProgramDetailPointColumn[]>>(url, {
			params,
		});
	},
	// Thêm mới data
	add(data: IProgramDetailPointColumn) {
		return instance.post(url, data);
	},
	// Cập nhật data
	update(data: IProgramDetailPointColumn) {
		return instance.put(url, data);
	},
	// Cập nhật data
	delete(data: IProgramDetailPointColumn) {
		return instance.put(url, data);
	},
};
