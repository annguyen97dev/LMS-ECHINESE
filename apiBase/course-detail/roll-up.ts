import { instance } from '~/apiBase/instance';

const url = '/api/RollUp';

type IApiResultRollUp = {
	message: string;
	TotalRow: number;
	RollUp: IRollUp[];
	ScheduleList: ICourseDetailSchedule[];
	StudentList: IStudentListInCourse[];
};

export const rollUpApi = {
	getAll: (Params: any) =>
		instance.get<IApiResultRollUp>(url, {
			params: Params
		}),

	add: (data) => instance.post(url, data),
	update: (data) => instance.post(url, data)
};

export const rollUpTeacher = {
	getAllTeacher: (Params: any) => instance.get('/api/course-getall-rollup-teacher', { params: Params }),
	updateRollUp: (Data) => instance.put('/api/course-update-rollup-teacher', Data)
};
