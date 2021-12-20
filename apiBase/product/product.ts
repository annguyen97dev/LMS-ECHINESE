import { instance } from '~/apiBase/instance';

const url = '/api/Product';
class ProductApi {
	// Lấy tất cả data
	getAll = (params) => instance.get<IApiResultData<IProduct[]>>(url, { params });
	getByID = (id) => instance.get<IApiResultData<IProduct>>(`${url}/${id}`);
	insert = (data) => instance.post(url, data);
	update = (data) => instance.put(url, data);
    uploadImage = (data) => instance.post(`${url}UploadImage`)
}

export const productApi = new ProductApi();
