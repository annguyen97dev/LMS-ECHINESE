type IHomeWork = IBaseApi<{
	ID: number;
	ExamTopicID: number;
	ExamTopicName: string;
	TeacherID: number;
	TeacherName: string;
	CourseID: number;
	CourseName: string;
	CurriculumID: number;
	CurriculumDetailID: number;
	DateStart: string;
	DateEnd: string;
	Note: string;
	Status: number;
	StatusName: string;
}>;
