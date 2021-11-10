import { instance } from '../instance';
import { IVideoCourseList } from '../types/video-course-list/video-course-list';

const url = '/api/VideoCourses/ListVideoCourse';
export const VideoCourseStoreApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IVideoCourseList[]>>(url, {
			params
		});
	},
	// Lấy data theo user
	getByUser(ID) {
		return instance.get<IApiResultData<IVideoCourseList[]>>(`${url + 'GetByUser'}${''}`);
	},

	// Cập nhật data
	update(data) {
		return instance.put(url + 'StudentEvaluation', data);
	}
};
