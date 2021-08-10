import {instance} from '~/apiBase/instance';

class Config {
	// Lấy tất cả data có phân trang
	getAll = () =>
		instance.get<IApiResultData<IConfig[]>>('/api/Config');

	// Lấy chi tiết data theo ID
	getByID = (id: number) =>
		instance.get<IApiResultData<IConfig>>(`/api/Config/${id}`);

	// Thêm mới data
	add = (data: IConfig) => instance.post('/api/Config', data);

	// Cập nhật data
	update = (data: any) => instance.put('/api/Config', data, {});
}

export const configApi = new Config();
