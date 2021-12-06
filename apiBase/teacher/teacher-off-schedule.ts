import { instance } from '~/apiBase/instance';

export const teacherOffScheduleApi = {
	getAll(params) {
		return instance.get<IApiResultData<ITeacherOff[]>>('/api/DayOffTeacher', {
			params
		});
	}
};
