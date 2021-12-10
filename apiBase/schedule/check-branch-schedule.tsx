import { instance } from '../instance';

const url = 'api/CourseScheduleOfBranch';
export const checkBranchScheduleStudy = {
	getAll(params) {
		return instance.get<IApiResultData<ICheckBranchScheduleStudyData[]>>(url, {
			params
		});
	}
};
