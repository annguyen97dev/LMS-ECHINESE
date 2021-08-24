type ICheckTeacherScheduleStudy = IBaseApi<{
	TeacherID: number;
	TeacherName: string;
	StudyTimeName: number;
	StudyTimeID: number;
	Date: string;
	StartTime: string;
	EndTime: string;
}>;
