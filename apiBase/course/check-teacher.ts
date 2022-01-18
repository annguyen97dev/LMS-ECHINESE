import { instance } from '../instance';

const url = '/api/CheckTeacher/';
export const checkTeacherApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ICheckSchedule[]>>(url, { params });
	},
	// Lấy tất cả data - edit khóa học
	getAllTeacherAvailable(params: { CourseID: number; StudyTimeID: number; ProgramID: number; BranchID: number; Date: string }) {
		return instance.get<IApiResultData<{ UserInformationID: number; FullNameUnicode: string }[]>>('/api/TeacherAvailable', { params });
	}
};
