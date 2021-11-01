import { instance } from '~/apiBase/instance';

const url = '/api/CourseOfStudentPrice';

class CourseOfStudentPriceApi {
	getAll = (Params: any) =>
		instance.get<IApiResultData<ICourseOfStudentPrice[]>>(url, {
			params: Params
		});
}

export const courseOfStudentPriceApi = new CourseOfStudentPriceApi();
