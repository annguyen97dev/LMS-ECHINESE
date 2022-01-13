import { instance } from '~/apiBase/instance';

const url = '/api/Product';
class ProductApi {
	// Lấy tất cả data
	getAll = (params) => instance.get<IApiResultData<IProduct[]>>(url, { params });
	getByID = (id) => instance.get<IApiResultData<IProduct>>(`${url}/${id}`);
	insert = (data) => instance.post(url, data);
	update = (data) => instance.put(url, data);
	uploadImage = (data) => {
		let formData = new FormData();
		formData.append('File', data);
		return instance.post(`/api/ProductUploadImage`, formData);
	};
}

export const productApi = new ProductApi();
