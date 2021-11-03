import { instance } from '~/apiBase/instance';

const url = '/api/Parents';

class ParentsApi {
	getAll = (Params: any) =>
		instance.get<IApiResultData<IParents[]>>(url, {
			params: Params
		});

	getDetail = (id: number) => instance.get<IApiResultData<IParents>>(`${url}/${id}`);

	add = (data: IParents) => instance.post(url, data);

	update = (data: any) => instance.put(url, data, {});
}

export const parentsApi = new ParentsApi();
