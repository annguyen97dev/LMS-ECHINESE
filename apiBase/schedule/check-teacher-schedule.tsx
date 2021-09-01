import {instance} from '../instance';

const url = 'api/ScheduleByMultipleTeacher/';
export const checkTeacherScheduleStudy = {
	getAll(params) {
		return instance.get<IApiResultData<ICheckTeacherScheduleStudy[]>>(url, {
			params,
		});
	},
};
