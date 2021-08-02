import {instance} from '~/apiBase/instance';

const url = '/api/Teacher/';
export const teacherApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<ITeacher[]>>(url, {
			params,
		});
	},
	// Lấy theo id
	getById(id:number) {
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
	// Thông tin lớp học
	getAllTeacherForSubject(id:number) {
		return instance.get<IApiResultData>(`/api/AssignTeacherForSubject/${id}`);
	},
	updateTeacherForSubject(data: any) {
		return instance.put('/api/AssignTeacherForSubject', data)
	}
};
