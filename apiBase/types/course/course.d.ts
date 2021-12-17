type ICourse = IBaseApi<{
	CourseName: string;
	AcademicUID: number;
	AcademicName: string;
	BranchID: number;
	EndDay: string;
	GradeID: number;
	Price: string;
	ProgramID: number;
	MaximumStudent: number;
	TypeCourse: string;
	TypeCourseName: string;
	CurriculumID: number;
	StartDay: string;
	ID: number;
	TeacherLeaderUID: number;
	TeacherLeaderName: string;
	TeacherName: string;
	Status: number;
	StatusName: string;
	TotalDays: number;
	TotalStudents: number;
	TotalRow: number;
	DonePercent: number;
	SalaryOfLesson: number;
}>;

type ICourseDetail = IBaseApi<{
	ID: number;
	CourseName: string;
	BranchID: number;
	GradeID: number;
	ProgramID: number;
	CurriculumID: number;
	StartDay: string;
	EndDay: string;
	Price: number;
	Status: number;
	StatusName: string;
	AcademicUID: number;
	TeacherLeaderUID: number;
	TypeCourse: number;
}>;

// CREATE COURSE ONLINE
type IOptionListForForm = {
	branchList: IOptionCommon[];
	studyTimeList: IOptionCommon[];
	gradeList: IOptionCommon[];
	programList: IOptionCommon[];
	teacherList: IOptionCommon[];
	dayOfWeek: IOptionCommon[];
	curriculumList: IOptionCommon[];
	userInformationList: IOptionCommon[];
};
type IOptionListForADay = {
	optionStudyTimeList: IOptionCommon[];
	optionTeacherList: { id: number; list: IOptionCommon[] }[];
};
type ICreateCourseScheduleList = {
	available: ISchedule[];
	unavailable: ISchedule[];
	endDate: string;
};
type ICreateCourseScheduleShowList = {
	[k: string]: ISchedule[];
};
interface IDataModal {
	dateString: string;
	limit: number;
	scheduleInDay: number;
	scheduleList: ISchedule[];
}
type IScheduleListToSave = {
	CurriculumsDetailID?: number | string;
	Date: string;
	StudyTimeID: number;
	TeacherID: number;
	SubjectID: number;
};
type ISaveCourseInfo = {
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
type ICreateCourseOnlineForm = {
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
type IOptionListForADay = {
	optionStudyTimeList: IOptionCommon[];
	optionTeacherList: { id: number; list: IOptionCommon[] }[];
};
type IEditCourseScheduleList = {
	available: ICourseDetailSchedule[];
	unavailable: ICourseDetailSchedule[];
};
type IEditCourseScheduleShowList = {
	[k: string]: ICourseDetailSchedule[];
};
interface IDataModalEditCourse extends Omit<IDataModal, 'scheduleList'> {
	scheduleList: ICourseDetailSchedule[];
}
type IEditCourseScheduleListToSave = {
	ID: number;
	CourseID: number;
	BranchID: number;
	CurriculumsDetailID: number;
	SubjectID: number;
	Date: string;
	StudyTimeID: number;
	TeacherID: number;
};
