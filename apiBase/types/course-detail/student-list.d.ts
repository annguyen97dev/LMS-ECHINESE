type IStudentListInCourse = IBaseApi<{
	ID: number;
	CourseID: number;
	StudentID: number;
	StudentName: string;
	Mobile: string;
	Email: string;
	AcademicName: string;
	DayOff: number;
	Warning: boolean;
}>;
