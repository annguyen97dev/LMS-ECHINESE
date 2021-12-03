import { instance } from '../instance';

const url = '/api/VideoCourseInteraction/';
export const VideoNoteApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IExamTopic[]>>(url, {
			params
		});
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
		return instance.put(url + 'Update', data);
	},
	// Xóa data
	delete(data) {
		return instance.delete(url + 'Delete', {
			data
		});
	}
};
