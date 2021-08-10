type ICourse = {
	CourseName: string;
	AcademicUID: number;
	BranchID: number;
	EndDay: string;
	GradeID: number;
	Price: string;
	ProgramID: number;
	TypeCourse: string;
	CurriculumID: number;
	StartDay: string;
	Schedule: Array<{
		CurriculumsDetailID: number;
		SubjectID: number;
		Date: string;
		StudyTimeID: number;
		RoomID: number;
		TeacherID: number;
	}>;
};
