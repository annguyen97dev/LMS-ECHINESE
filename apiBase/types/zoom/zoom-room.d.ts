type IZoomRoom = IBaseApi<{
	ID: number;
	TeacherID: number;
	TeacherName: string;
	CourseScheduleID: number;
	CourseID: number;
	CourseName: string;
	Date: string;
	StudyTimeID: number;
	StudyTimeName: string;
	TimeStart: string;
	TimeEnd: string;
	ZoomRoomID: string;
	ZoomRoomPass: string;
	IsRoomStart: boolean;
	ZoomTeacherAPIID: number;
	Signature: string;
	ApiKey: string;
}>;

type IZoomRecord = {
	id: string;
	meeting_id: string;
	download_url: string;
	file_type: string;
	play_url: string;
	recording_start: string;
	recording_end: string;
	file_size: string;
	file_extension: string;
	recording_type: string;
};
