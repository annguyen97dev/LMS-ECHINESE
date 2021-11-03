import { instance } from '~/apiBase/instance';

const url = '/api/Staff';
class StaffApi {
	// Lấy tất cả data
	getAll = (params) => instance.get<IApiResultData<IStaff[]>>(url, { params });

	// Thêm mới data
	add(data: IStaff) {
		return instance.post(url, data);
	}
	// Cập nhật data
	update(data: any) {
		return instance.put(url, data);
	}
	// Xóa data
	delete(data: IStaff) {
		return instance.put(url, data);
	}
}

export const staffApi = new StaffApi();
