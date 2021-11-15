import { instance } from '~/apiBase/instance';

const url = '/api/ScheduleOfUserID';

class ScheduleOfStudentApi {
	getID = (Params: any) =>
		instance.get<IApiResultData<IScheduleOfStudent[]>>(url, {
			params: Params
		});
}

export const scheduleOfStudentApi = new ScheduleOfStudentApi();
