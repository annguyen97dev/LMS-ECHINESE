import { instance } from '~/apiBase/instance';

const url = '/api/CourseExamresult';

class CourseExamApi {
	getAll = (Params: any) =>
		instance.get<IApiResultData<ICourseExam[]>>(url, {
			params: Params
		});

	getAllStudent = (Params: any) =>
		instance.get<IApiResultData<ICourseExam[]>>('/api/CourseExamresultGetStudentExistResult', {
			params: Params
		});

	getDetail = (id: number) => instance.get<IApiResultData<ICourseExam>>(`${url}/${id}`);

	add = (data: any) => instance.post(url, data);

	update = (data: any) => instance.put(url, data, {});

	// tự động chia đều giáo viên chấm bài

	updateTeacher = () => instance.put('/api/UpdateTeacherOfSetPackageResult');
}

export const courseExamApi = new CourseExamApi();
