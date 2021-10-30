import { instance } from '~/apiBase/instance';

const url = '/api/CourseOfStudent';

class CourseOfStudentApi {
	getAll = (Params: any) =>
		instance.get<IApiResultData<ICourseOfStudent[]>>(url, {
			params: Params
		});

	getDetail = (id: number) => instance.get<IApiResultData<ICourseOfStudent>>(`${url}/${id}`);

	add = (data: ICourseOfStudent) => instance.post(url, data);

	update = (data: ICourseOfStudent) => instance.put(url, data, {});
}

export const courseOfStudentApi = new CourseOfStudentApi();
