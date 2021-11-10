interface IPostSelfCourse {
	CourseName: string;
	BranchID: number;
	GradeID: number;
	ProgramID: number;
	CurriculumID: number;
	StartDay: string;
	EndDay: string;
	Price: number;
	AcademicUID: number;
	SalaryOfLesson: number;
}
interface ISelfCourseSchedule extends Omit<IScheduleZoomDetail, 'isExam' | 'ExamTopicID'> {
	SubjectName: string;
	TeacherName: string;
}
