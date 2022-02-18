import { instance } from '../instance';
import { IVideoCategoryLevel } from '../types/video-category-level/video-category-level';

const url = '/api/VideoCourseCategoryLevel/';
export const VideoCourseLevelApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IVideoCategoryLevel[]>>(url + 'GetAllLevel', {
			params
		});
	},
	// Thêm mới data
	add(data) {
		return instance.post(url + 'CreateOrUpdateLevel', data);
	}
};

const urlTag = '/api/VideoCoursesTagArray';
export const VideoCuorseTag = {
	getAll() {
		return instance.get<IApiResultData<IVideoTags[]>>(urlTag);
	},
	// Thêm mới data
	add(data) {
		return instance.post('/api/VideoCoursesTagArray/CreateOrUpdateTag', data);
	}
};
