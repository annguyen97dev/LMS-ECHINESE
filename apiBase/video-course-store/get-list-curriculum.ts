import { instance } from '../instance';
import { IVideoCategoryLevel } from '../types/video-category-level/video-category-level';

const url = '/api/VideoCourses';
export const VideoCourseCurriculumApi = {
	// Lấy tất cả data
	getCurriculum() {
		return instance.get<IApiResultData<IVideoCategoryLevel[]>>(url + '/GetCurriculum');
	}
};
