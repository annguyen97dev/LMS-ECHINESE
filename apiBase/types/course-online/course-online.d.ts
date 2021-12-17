// CREATE COURSE ONLINE: ICO => ICourseOnline
type ICOOptionListForForm = {
	branchList: IOptionCommon[];
	studyTimeList: IOptionCommon[];
	gradeList: IOptionCommon[];
	programList: IOptionCommon[];
	teacherList: IOptionCommon[];
	dayOfWeek: IOptionCommon[];
	curriculumList: IOptionCommon[];
	userInformationList: IOptionCommon[];
};
type ICOOptionListForADay = {
	optionStudyTimeList: IOptionCommon[];
	optionTeacherList: { id: number; list: IOptionCommon[] }[];
};
type ICOCreateScheduleList = {
	available: ISchedule[];
	unavailable: ISchedule[];
};
type ICOCreateScheduleShowList = {
	[k: string]: ISchedule[];
};
interface ICODataModal {
	dateString: string;
	limit: number;
	scheduleInDay: number;
	scheduleList: ISchedule[];
}
type ICOScheduleListToSave = {
	CurriculumsDetailID?: number | string;
	Date: string;
	StudyTimeID: number;
	TeacherID: number;
	SubjectID: number;
};
type ICOSaveCourseInfo = {
	CourseName: string;
	AcademicUID: number;
	BranchID: number;
	BranchName: string;
	GradeID: number;
	StudyTimeID: string;
	StudyTimeName: string;
	ProgramID: number;
	ProgramName: string;
	TeacherID: number;
	TeacherName: string;
	CurriculumID: number;
	CurriculumName: string;
	StartDay: string;
	EndDay: string;
	DaySelected: string;
	DaySelectedName: string;
	TypeCourse: number;
	SalaryOfLesson: number;
	Price: number;
	Schedule: IScheduleListToSave[];
};
type ICOCreateForm = {
	BranchID: number;
	UserInformationID: number;
	StudyTimeID: number[];
	GradeID: number;
	ProgramID: number;
	TeacherID: number;
	CurriculumID: number;
	StartDay: string;
	DaySelected: number[];
	Price: string;
	SalaryOfLesson: string;
	CourseName: string;
};

// EDIT COURSE ONLINE
type ICOEditScheduleList = {
	available: ICourseDetailSchedule[];
	unavailable: ICourseDetailSchedule[];
};
type ICOEditScheduleShowList = {
	[k: string]: ICourseDetailSchedule[];
};
interface ICODataModalEdit extends Omit<ICODataModal, 'scheduleList'> {
	scheduleList: ICourseDetailSchedule[];
}
type ICOEditScheduleListToSave = {
	ID: number;
	CourseID: number;
	BranchID: number;
	CurriculumsDetailID: number;
	SubjectID: number;
	Date: string;
	StudyTimeID: number;
	TeacherID: number;
};
