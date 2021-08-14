import {instance} from '../instance';

const urlSubject = '/api/TranscriptSubject/';
const urlCourse = '/api/TranscriptCourse/';
export const transcriptApi = {
	// Lấy tất cả data
	getAllByCourse(params) {
		return instance.get<IApiResultData<ITranscriptByCourse[]>>(urlCourse, {
			params,
		});
	},
	// Lấy tất cả data
	getAllBySubject(params) {
		return instance.get<IApiResultData<ITranscriptBySubject[]>>(urlSubject, {
			params,
		});
	},
	// Thêm mới data
	add(data) {
		return instance.post(urlSubject, data);
	},
	// Cập nhật data
	update(data) {
		return instance.put(urlSubject, data);
	},
};
