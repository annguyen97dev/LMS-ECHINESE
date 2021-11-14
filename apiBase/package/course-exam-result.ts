import { instance } from '~/apiBase/instance';

const url = '/api/CourseExamresultDetail';

class CourseExamResultApi {
	getAll = (Params: any) =>
		instance.get<IApiResultData<ICourseExamResult[]>>(url, {
			params: Params
		});

	getDetail = (id: number) => instance.get<IApiResultData<ICourseExamResult>>(`${url}/${id}`);

	updatePoint = (data: any) => instance.put('/api/CourseExamExerciseStudent', data, {});
}

export const courseExamResultApi = new CourseExamResultApi();
