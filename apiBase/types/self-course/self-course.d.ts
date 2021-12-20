// ISC => ISelfCourse
interface ISCPost {
	CourseName: string;
	BranchID: number;
	GradeID: number;
	ProgramID: number;
	CurriculumID: number;
	StartDay: string;
	EndDay: string;
	Price: number;
	SalaryOfLesson: number;
}
interface ISCSchedule extends Omit<IScheduleZoomDetail, 'isExam' | 'ExamTopicID'> {
	SubjectName: string;
	TeacherName: string;
	CaID: number;
	StudyTimeName: string;
	StudyTimeID: number;
	TimeEnd: string;
	TimeStart: string;
	isValid?: boolean;
}
type ISCCheckTeacher = { studyTimeID: number; curriculumsDetailID: number; date: string };

// CREATE SELF COURSE:
type ISCOptionListForForm = {
	branchList: IOptionCommon[];
	gradeList: IOptionCommon[];
	programList: IOptionCommon[];
	curriculumList: IOptionCommon[];
};
type ISCOptionListForADay = {
	optionStudyTimeList: { id: number; list: IOptionCommon[] }[];
	optionTeacherList: { id: number; list: IOptionCommon[] }[];
};
type ISCCreateScheduleList = {
	available: ISCSchedule[];
	unavailable: ISCSchedule[];
};
type ISCCreateScheduleShowList = {
	[k: string]: ISCSchedule[];
};
type ISCDataModal = {
	dateString: string;
	scheduleList: ISCSchedule[];
};
type ICSScheduleToSave = {
	ID: number;
	Date: string;
	StudyTimeID: number;
	TeacherID: number;
};
type ISCSaveInfo = {
	CourseName: string;
	BranchID: number;
	BranchName: string;
	GradeID: number;
	ProgramID: number;
	ProgramName: string;
	CurriculumID: number;
	CurriculumName: string;
	StartDay: string;
	EndDay: string;
	TypeCourse: number;
	Schedule: ICSScheduleToSave[];
};
type ISCCheckSchedule = {
	id: number;
	studyTimeID: number;
	curriculumsDetailID: number;
	date: string;
	teacherID: number;
};
type ISCTime = { TimeStart: string; TimeEnd: string };
