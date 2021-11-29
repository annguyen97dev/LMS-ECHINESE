import { instance } from '../instance';
import { IVideoCategoryLevel } from '../types/video-category-level/video-category-level';

const url = '/api/VideoCourseCategoryLevel/';
export const VideoCourseCategoryApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IVideoCategoryLevel[]>>(url + 'GetAllCategory', {
			params
		});
	},
	// Thêm mới data
	add(data) {
		return instance.post(url + 'CreateOrUpdateCategory', data);
	}
};
