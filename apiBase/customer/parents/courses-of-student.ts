import { instance } from '~/apiBase/instance';

const url = '/api/CourseOfStudent';

class CourseOfStudentApi {
	getAll = (Params: any) =>
		instance.get<IApiResultData<ICourseOfStudent[]>>(url, {
			params: Params
		});

	getDetail = (id: number) => instance.get<IApiResultData<ICourseOfStudent>>(`${url}/${id}`);

	add = (data: ICourseOfStudent) => instance.post(url, data);
	createTrial = (data: ICourseTrial) => instance.post('/api/CreateTrial', data);

	update = (data: ICourseOfStudent) => instance.put(url, data, {});
	updatePrice = (data) => instance.put('/api/UpdatePrice', data, {});
}

export const courseOfStudentApi = new CourseOfStudentApi();
