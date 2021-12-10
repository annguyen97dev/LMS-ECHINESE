import { instance } from '~/apiBase/instance';

const url = '/api/CourseOfStudentPrice';

class CourseStudentPriceApi {
	getAll = (Params: any) =>
		instance.get<IApiResultData<ICourseOfStudentPrice[]>>(url, {
			params: Params
		});

	getDetail = (id: number) => instance.get<IApiResultData<ICourseOfStudentPrice>>(`${url}/${id}`);

	add = (data: ICourseOfStudentPrice) => instance.post(url, data);

	update = (data) => instance.put(url, data, {});
}

export const courseStudentPriceApi = new CourseStudentPriceApi();
