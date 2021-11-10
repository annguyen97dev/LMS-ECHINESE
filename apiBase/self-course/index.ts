import { instance } from '../instance';

type ScheduleSelfCourseResult<T = any> = {
	courseSchedulesArranged: T;
	courseSchedulesInarranged: T;
	message: string;
};
export const createSelfCourse = (data: IPostSelfCourse) =>
	instance.post<IApiResultData<IScheduleZoomDetail>>('/api/CreateCourse1vs1/', data);

export const getScheduleSelfCourse = (id: number) =>
	instance.get<ScheduleSelfCourseResult<ISelfCourseSchedule[]>>(`/api/courseNotScheduleYet/${id}`);

export const checkStudyTimeSelfCourse = (data: { date: string }) =>
	instance.get<IApiResultData<IStudyTime[]>>(`/api/GetStudyTimeByDateAndStudentID?date=${data.date}`);

export type ICheckTeacherSelfCourse = { studyTimeID: number; curriculumsDetailID: number; date: string };
export const checkTeacherSelfCourse = (data: ICheckTeacherSelfCourse) =>
	instance.get<IApiResultData<IUser[]>>(
		`/api/GetTeacherByDateAndStudyTimeAndCurriculumDetail?date=${data.date}&curriculumsDetailID=${data.curriculumsDetailID}&studyTimeID=${data.studyTimeID}`
	);
