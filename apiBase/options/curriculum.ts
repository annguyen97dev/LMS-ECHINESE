import { instance } from '~/apiBase/instance';

class CurriculumApi {
	getAll = (todoApi: object) =>
		instance.get<IApiResultData<ICurriculum[]>>('/api/Curriculum/', {
			params: todoApi
		});

	getWithID = (ID: number) => instance.get<IApiResult<ICurriculum[]>>(`/api/Curriculum/${ID}`);

	add = (data: ICurriculum) => instance.post('/api/Curriculum', data, {});

	addSubject = (data: any) => instance.post('/api/UpdateAllSubjectOfCurriculum', data, {});

	update = (data: any) => instance.put('/api/Curriculum/', data, {});
}

export const curriculumApi = new CurriculumApi();
