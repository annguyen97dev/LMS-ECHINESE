import { instance } from '../instance';

const url = '/api/CourseSchedules/';

type ITypeForOptionFetchAvailableSchedule = {
	id: number;
	name: string;
	select: boolean;
};
export type IApiCourseSchedule<T = any> = {
	data: T;
	message: string;
	totalRow: number;
	studyTimes: ITypeForOptionFetchAvailableSchedule[];
	rooms: ITypeForOptionFetchAvailableSchedule[];
};
export const courseDetailApi = {
	// Lấy tất cả data
	getAll(params) {
		return instance.get<IApiCourseSchedule<ICourseDetailSchedule[]>>(url, {
			params
		});
	},
	// Cập nhật
	update(data) {
		return instance.put(url, data);
	},
	aheadSchedule(params: { courseScheduleId: number; teacherId: number }) {
		return instance.get<IApiCourseSchedule<ICourseDetailSchedule[]>>('/api/luiLichHoc', { params });
	}
};
