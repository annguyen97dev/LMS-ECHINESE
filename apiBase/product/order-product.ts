import { instance } from '~/apiBase/instance';

const url = '/api/OrderProduct';
class OrderProductApi {
	// Lấy tất cả data
	getAll = (params) => instance.get<IApiResultData<IOrderProduct[]>>(url, { params });
	getByID = (id) => instance.get<IApiResultData<IOrderProduct>>(`${url}/${id}`);
	insert = (data) => instance.post(url, data);
	update = (data) => instance.put(url, data);
}

export const orderProductApi = new OrderProductApi();
