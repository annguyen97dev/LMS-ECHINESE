import { instance } from '~/apiBase/instance';

const url = '/api/UserInformation/';
class UserApi {
	// Lấy tất cả data
	getAll = (params) => instance.get<IApiResultData<IUser[]>>(url, { params });

	// Lấy data mới nhất
	getNew = () => instance.get<IApiResultData<IUser>>(url + '0');

	// Lấy data mới nhất
	getByID = (params) => instance.get<IApiResultData<IUser>>(url + params);

	// Thêm mới data
	add(data: IUser) {
		return instance.post(url, data);
	}
	// Cập nhật data
	update(data: IUser) {
		return instance.put(url, data);
	}
	// Xóa data
	delete(data: IUser) {
		return instance.put(url, data);
	}

	// Đổi mật khẩu
	changePassword(data: any) {
		return instance.put('/api/Account', data);
	}

	// Tạo mới tài khoản
	createAccount(data: any) {
		return instance.post('/api/CreateAccount', data);
	}
}

export const userApi = new UserApi();
