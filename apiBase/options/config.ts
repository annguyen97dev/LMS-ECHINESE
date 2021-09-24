import {instance} from '~/apiBase/instance';

class Config {
	// Lấy tất cả data có phân trang
	getAll = (params) =>
		instance.get<IApiResultData<IConfig[]>>('/api/Config', {params});

	// Lấy chi tiết data theo ID
	getByID = (id: number) =>
		instance.get<IApiResultData<IConfig>>(`/api/Config/${id}`);

	// Thêm mới data
	add = (data) => instance.post('/api/Config', data);

	// Cập nhật data
	update = (data) => instance.put('/api/Config', data);
	// Xóa data
	delete = (data) => instance.put('/api/Config', data);
}

export const configApi = new Config();
