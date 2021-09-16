import {instance} from '~/apiBase/instance';

class NewsFeed {
	// Lấy tất cả data
	getAll = (todoApi: object) =>
		instance.get<IApiResultData<INewsFeed[]>>('/api/NewsFeed', {
			params: todoApi,
		});

	// Thêm mới data
	add = (data) => instance.post('/api/NewsFeed', data);

	// Cập nhật data
	update = (data: any) => instance.put('/api/NewsFeed', data, {});
	// Cập nhật data
	delete = (data: any) => instance.put('/api/NewsFeed', data, {});

	// Upload file
	uploadFile = (file: any) => {
		let fData = new FormData();
		fData.append('File', file);
		console.log('FDATA: ', fData);
		return instance.post('/api/uploadfile', fData, {});
	};
}

export const newsFeedApi = new NewsFeed();
