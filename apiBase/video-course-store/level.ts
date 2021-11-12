import { instance } from '../instance';
import { IVideoCategoryLevel } from '../types/video-category-level/video-category-level';

const url = '/api/VideoCourseCategoryLevel/GetAllLevel';
export const VideoCourseLevelApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IVideoCategoryLevel[]>>(url, {
			params
		});
	}
};
