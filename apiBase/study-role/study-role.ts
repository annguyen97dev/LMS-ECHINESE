import { instance } from '~/apiBase/instance';

const url = '/api/StudyRoute';

class StudyRoleApi {
	getAll = (Params: any) =>
		instance.get<IApiResultData<IStudyRole[]>>(url, {
			params: Params
		});

	getDetail = (id: number) => instance.get<IApiResultData<IStudyRole>>(`${url}/${id}`);

	add = (data: IStudyRole) => instance.post(url, data);

	update = (data: any) => instance.put(url, data, {});

	changePosition = (data: any) => instance.put(`/api/StudyRouteChangePlaces`, data, {});
}

export const studyRoleApi = new StudyRoleApi();
