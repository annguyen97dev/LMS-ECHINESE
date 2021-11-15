import { instance } from '~/apiBase/instance';

class TeacherSalaryApi {
	getAll = (Params: any) => instance.get<IApiResultData<ITeacherSalary[]>>('/api/SalaryOfTeacher', { params: Params });
	getDetail = (Params: any) => instance.get<IApiResultData<ITeacherSalaryDetail[]>>('/api/SalaryOfTeacherDetail', { params: Params });
	getFixExam = (Params: any) => instance.get<IApiResultData<ITeacherSalaryFixExam[]>>('/api/TeacherFixExam', { params: Params });
	postSalaryClosing = () => instance.post('/api/SalaryOfTeacherClosing');
	update = (data) => instance.put('/api/SalaryOfTeacher', data);
}
export const teacherSalaryApi = new TeacherSalaryApi();
