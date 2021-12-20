import { instance } from '~/apiBase/instance';

const url = '/api/ProductType';
class ProductTypeApi {
	// Lấy tất cả data
	getAll = (params) => instance.get<IApiResultData<IProductType[]>>(url, { params });
	getByID = (id) => instance.get<IApiResultData<IProductType>>(`/api/ProductType/${id}`);
	insert = (data) => instance.post(url, data);
	update = (data) => instance.put(url, data);
}

export const productTypeApi = new ProductTypeApi();
