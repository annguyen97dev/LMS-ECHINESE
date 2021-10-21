import {instance} from '~/apiBase/instance';

const url = '/api/ZoomTeacherAPI/';
export const configZoomApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IConfigZoom[]>>(url, {
			params,
		});
	},
	// Lấy theo id
	getById(id: number) {
		return instance.get<IApiResultData<IConfigZoom>>(`${url}${id}`);
	},
	// Thêm mới data
	add(data) {
		return instance.post(url, data);
	},
	// Cập nhật data
	update(data) {
		return instance.put(url, data);
	},
	// Xóa data
	delete(data) {
		return instance.put(url, data);
	},
	getInactiveConfigZoom() {
		return instance.get<IApiResultData<IConfigZoom>>(
			'/api/GetZoomTeacherAPIinActive'
		);
	},
};
