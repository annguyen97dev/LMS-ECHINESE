import { instance } from '~/apiBase/instance';

class DiscountApi {
	// Lấy tất cả data
	getAll = (todoApi: object) =>
		instance.get<IApiResultData<IDiscount[]>>('/api/Discount', {
			params: todoApi
		});

	// Thêm mới data
	add = (data: IDiscount) => instance.post('/api/Discount', data, {});

	// Cập nhật data
	update = (data: any) => instance.put('/api/Discount', data, {});

	// Get of student
	getOfStudent = (todoApi: object) =>
		instance.get<IApiResultData<any>>('/api/DiscountOfStudent', {
			params: todoApi
		});
}

export const discountApi = new DiscountApi();
