import {instance} from '~/apiBase/instance';

class UserGroupNewsFeed {
	// Lấy tất cả data
	getAll = (todoApi: object) =>
		instance.get<IApiResultData<IUserGroupNewsFeed[]>>(
			'/api/GroupUserNewsFeed',
			{
				params: todoApi,
			}
		);

	// Lấy theo id
	getByID = (id: number) =>
		instance.get<IApiResultData<IUserGroupNewsFeed[]>>(
			`/api/GroupUserNewsFeed/${id}`
		);

	// Thêm mới data
	add = (data) => instance.post('/api/GroupUserNewsFeed', data);

	// Cập nhật data
	update = (data: any) => instance.put('/api/GroupUserNewsFeed', data, {});
}

export const userGroupNewsFeedApi = new UserGroupNewsFeed();
