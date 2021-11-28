import { instance } from '../instance';
import { IVideoCourseList } from '../types/video-course-list/video-course-list';

const url = '/api/VideoCourseOfStudent/';

export const VideoCourseListApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IVideoCourseList[]>>(
			`${url}GetAll?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}&search=${params.search}'`
		);
	},
	// Lấy data theo user
	getByUser(ID) {
		return instance.get<IApiResultData<IVideoCourseList[]>>(`${url + 'GetByUser'}${''}`);
	},
	// Cập nhật data
	update(data) {
		return instance.put(url + 'StudentEvaluation', data);
	},
	// Cập nhật data
	updateActiveCode(data) {
		return instance.put(url + 'UpdateActiveCode', data);
	}
};
