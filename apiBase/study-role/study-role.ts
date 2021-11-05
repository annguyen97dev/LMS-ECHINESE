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

	changePosition = (indexFirst, indexAfter) => instance.put(`/api/StudyRouteChangePlaces`, null, {});
}

export const studyRoleApi = new StudyRoleApi();
