import { instance } from '~/apiBase/instance';

const url = '/api/DocumentCategory';

class DocumentCategoryApi {
	getAll = (Params: any) =>
		instance.get<IApiResultData<ICategoryDoc[]>>(url, {
			params: Params
		});
	add(data) {
		return instance.post(url, data);
	}
	// Edit and Delete
	update(data) {
		return instance.put(url, data);
	}
}

export const documentCategoryApi = new DocumentCategoryApi();
