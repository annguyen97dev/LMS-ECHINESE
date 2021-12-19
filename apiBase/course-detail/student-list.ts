import { instance } from '../instance';

const url = '/api/StudentInCourse/';
type IApiResultStudentInCourse<T = any> = {
	studentList: T;
	message: string;
	TotalRow: number;
};
export const studentListInCourseApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultStudentInCourse<IStudentListInCourse[]>>(url, {
			params
		});
	}
};
