import { instance } from '~/apiBase/instance';

class BranchApi {
	// Lấy tất cả data có phân trang
	getAll = (todoApi: object) =>
		instance.get<IApiResultData<IBranch[]>>('/api/Branch', {
			// params: getParams(todoApi),
			params: todoApi
		});

	// Lấy chi tiết data theo ID
	getByID = (id: number) => instance.get<IApiResultData<IBranch>>(`/api/Branch/${id}`);

	// Cập nhật trạng thái ẩn/hiện
	changeStatus = (id: number) => instance.put<IApiResultData<IBranch[]>>(`/api/Branch/Hide/${id}`);

	// Thêm mới data
	add = (data: IBranch) => instance.post('/api/Branch', data);

	// Cập nhật data
	update = (data: any) => instance.put('/api/Branch', data, {});
}

export const branchApi = new BranchApi();
