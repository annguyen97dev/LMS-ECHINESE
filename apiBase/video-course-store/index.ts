import { instance } from '../instance';
import { IVideoCourseList } from '../types/video-course-list/video-course-list';

const url = '/api/VideoCourses';
export const VideoCourseStoreApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IVideoCourseList[]>>(url + '/ListVideoCourse', {
			params
		});
	},
	getAllForStudent(params) {
		return instance.get<IApiResultData<IVideoCourseList[]>>(url + '/ListVideoCourseForStudent', {
			params
		});
	},
	// Lấy data theo user
	getByUser(ID) {
		return instance.get<IApiResultData<IVideoCourseList[]>>(`${url + 'GetByUser'}${''}`);
	},
	// Thêm mới data
	add(data) {
		console.log('data: ', data);

		return instance.post(url + '/Create', data);
	},
	// Cập nhật data
	update(params) {
		return instance.put(url + '/Update', params);
	}
};

const urlCard = '/api/Cart';
export const VideoCourseCardApi = {
	// Lấy tất cả data
	getAll() {
		return instance.get<IApiResultData<IVideoCourseList[]>>(urlCard + '/GetCartDetailOfUser');
	},
	// Thêm mới data
	add(data) {
		return instance.post(urlCard + '/Insert', data);
	},
	// Cập nhật data
	update(data) {
		return instance.put(urlCard, data);
	}
};
