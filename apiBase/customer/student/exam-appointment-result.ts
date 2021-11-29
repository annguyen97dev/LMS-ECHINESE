import { instance } from '~/apiBase/instance';

const url = '/api/ExamAppointmentResult/';
export const examAppointmentResultApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiResultData<IExamAppointmentResult[]>>(url, {
			params
		});
	},
	// Lấy theo id
	getById(id: number) {
		return instance.get<IApiResultData<IExamAppointmentResult>>(`${url}${id}`);
	},
	// Thêm mới data
	add(data) {
		return instance.post(url, data);
	},
	// Cập nhật data
	update(data) {
		return instance.put(url, data);
	},
	// Xóa data
	delete(data) {
		return instance.put(url, data);
	},

	getResultExam(params) {
		return instance.get<any>('/api/ExamAppointmentResultDetail', {
			params
		});
	},

	updatePoint(data) {
		return instance.put('/api/ExamAppointmentExerciseStudent', data);
	},

	// Kiểm tra đề hẹn test này đã được làm hay chưa
	checkIsTested(id) {
		return instance.get<IApiResultData<IExamAppointmentResult[]>>(`/api/ExamAppointmentResultcheckResult/${id}`);
	}
};
