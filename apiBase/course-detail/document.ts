import { instance } from '~/apiBase/instance';

const url = '/api/Document';

class DocumentApi {
	getAll = (Params: any) =>
		instance.get<IApiResultData<IDocument[]>>(url, {
			params: Params
		});
}

export const documentApi = new DocumentApi();
