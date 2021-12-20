import { instance } from '~/apiBase/instance';

const url = '/api/UserSchedule/';
export const scheduleZoomApi = {
	// Lấy tất cả data
	getAll(params: { StartTime: string; EndTime: string }) {
		return instance.get<IApiResultData<IScheduleZoom[]>>(url, {
			params
		});
	},
	// Lấy theo id
	getById(id: number) {
		return instance.get<IApiResultData<IScheduleZoomDetail>>(`${url}${id}`);
	}
};
