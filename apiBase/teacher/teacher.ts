import {instance} from '~/apiBase/instance';

const url = '/api/Teacher/';
const teacherApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ITeacher[]>>(url, {
			params,
		});
	},
	// Lấy theo id
	getById(id: number) {
		return instance.get<IApiResultData<ITeacher[]>>(`${url}${id}`);
	},
	// Thêm mới data
	add(data: ITeacher) {
		return instance.post(url, data);
	},
	// Cập nhật data
	update(data: ITeacher) {
		return instance.put(url, data);
	},
	// Cập nhật data
	updateBranch(data: {
		UserInfomationID: number;
		BranchID: string;
		Enable: boolean;
	}) {
		return instance.put('/api/UserBranch/', data);
	},
	// Xóa data
	delete(data: ITeacher) {
		return instance.put(url, data);
	},
};
export default teacherApi;
