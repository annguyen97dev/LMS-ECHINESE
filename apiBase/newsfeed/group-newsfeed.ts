import {instance} from '~/apiBase/instance';

class GroupNewsFeed {
	// Lấy tất cả data
	getAll = (todoApi: object) =>
		instance.get<IApiResultData<IGroupNewsFeed[]>>('/api/GroupNewsFeed', {
			params: todoApi,
		});

	// Lấy theo id
	getByID = (id: number) =>
		instance.get<IApiResultData<IGroupNewsFeed>>(`/api/GroupNewsFeed/${id}`);

	// Thêm mới data
	add = (data) => instance.post('/api/GroupNewsFeed', data);

	// Cập nhật data
	update = (data: any) => instance.put('/api/GroupNewsFeed', data, {});

	// Upload background
	uploadImage = (file: any) => {
		let fData = new FormData();
		fData.append('File', file);
		console.log('FDATA: ', fData);
		return instance.post('/api/uploadfileGroup', fData, {});
	};
}

export const groupNewsFeedApi = new GroupNewsFeed();
