import { instance } from '~/apiBase/instance';

class StaffSalaryApi {
	getAll = (Params: any) => instance.get<IApiResultData<IStaffSalary[]>>('/api/SalaryOfStaff', { params: Params });
	postSalaryClosing = (workDays) =>
		isNaN(workDays) ? instance.post(`/api/SalaryOfStaffClosing/${0}`) : instance.post(`/api/SalaryOfStaffClosing/${workDays}`);
	update = (data) => instance.put('/api/SalaryOfStaff', data);
}
export const staffSalaryApi = new StaffSalaryApi();
