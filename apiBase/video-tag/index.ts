import { instance } from '../instance';

const url = '/api/VideoCoursesTagArray';
export const videoTagApi = {
	// Lấy tất cả data
	getAll() {
		return instance.get<IApiResultData<IVideoTag[]>>(url);
	},
	// Lấy theo ID
	getByID(ID) {
		return instance.get<IApiResultData<IExamTopic>>(`${url}${ID}`);
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
	}
};
