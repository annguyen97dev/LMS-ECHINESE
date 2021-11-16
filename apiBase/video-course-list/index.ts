import { instance } from '../instance';
import { IVideoCourseList } from '../types/video-course-list/video-course-list';

const url = '/api/VideoCourseOfStudent/';

export const VideoCourseListApi = {
	// Lấy tất cả data
	getAll(ID) {
		return instance.get<IApiResultData<IVideoCourseList[]>>(`${url + 'GetAll?pageIndex=1&pageSize=5'}${''}`);
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
