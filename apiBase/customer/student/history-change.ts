import {instance} from '~/apiBase/instance';

const url = '/api/InformationHistory/';
export const timelineStudentApi = {
	getAll(params) {
		return instance.get<IApiResultData<ITimelineStudent[]>>(url, {
			params,
		});
	},
};
