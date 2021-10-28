import { instance } from '~/apiBase/instance';

class StaffSalaryApi {
	getAll = (Params: any) => instance.get<IApiResultData<IStaffSalary[]>>('/api/SalaryOfStaff', { params: Params });
	postSalaryClosing = () => instance.post('/api/SalaryOfStaffClosing/28');
	update = (data) => instance.put('/api/SalaryOfStaff', data);
}
export const staffSalaryApi = new StaffSalaryApi();
