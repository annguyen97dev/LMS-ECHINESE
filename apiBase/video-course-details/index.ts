import { instance } from '../instance';
import { IVideoCourseDetailsContent } from '../types/video-course-details/content';
import { IVideoCourseDetails } from '../types/video-course-details/video-course-details';
import { IDetailsContentItem } from '../types/video-course-details/content';
import { IVideoCourseDetailsFeedback, IDetailsFeedbackItem } from '../types/video-course-details/feedback';

const url = '/api/VideoCourseDetail/';
export const VideoCourseDetailApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IVideoCourseDetails>>(url, {
			params
		});
	},
	// Lấy theo ID
	getDetails(ID) {
		return instance.get<IApiResultData<IVideoCourseDetails>>(`${url}GetVideoCourseDetail/${ID}`);
	},
	// Lấy theo ID
	getContent(ID) {
		return instance.get<IApiResultData<IVideoCourseDetailsContent<IDetailsContentItem>>>(`${url}GetCourseContent/${ID}`);
	},
	// Lấy theo ID
	getFeedback(params) {
		return instance.get<IApiResultData<IVideoCourseDetailsFeedback<IDetailsFeedbackItem>>>(`${url}feedback/`, {
			params
		});
	},
	// Lấy theo ID
	getLesson(ID) {
		return instance.get<IApiResultData<IVideoCourseDetails[]>>(`${url}GetLesson/${ID}`);
	},
	// Lấy theo ID
	getLessonPreview(ID) {
		return instance.get<IApiResultData<IVideoCourseDetails[]>>(`${url}GetLessonPreview/${ID}`);
	},
	// Lấy theo ID
	getByID(ID) {
		return instance.get<IApiResultData<IVideoCourseDetails>>(`${url}GetByID/${ID}`);
	},
	// Cập nhật data
	update(data) {
		return instance.post(url + 'Update', data);
	}
};
