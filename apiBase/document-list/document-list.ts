import { instance } from '../instance';
const url = '/api/Document';

export const documentListApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IDocumentList[]>>(
			`${url + '?CategoryID='}${params.CategoryID}${'&DocumentName='}${params.DocumentName}`
		);
	},
	// Thêm mới data
	add(data) {
		const formdata = new FormData();
		formdata.append('DocumentName', data.DocumentName);
		formdata.append('CategoryID', data.CategoryID);
		formdata.append('File', data.File);
		return instance.post(url, formdata);
	},
	// Edit and Delete
	update(data) {
		return instance.put(url, data);
	}
};
