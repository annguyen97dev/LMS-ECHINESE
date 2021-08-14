type ITranscriptBySubject = IBaseApi<{
	UserInformationID: number;
	FullNameUnicode: string;
	SubjectID: number;
	SubjectName: string;
	CourseID: number;
	CourseName: string;
	PointColumn: {
		ID: number;
		PointColumnID: number;
		PointColumnName: string;
		Coefficient: number;
		Point: number;
		Note: string;
	}[];
}>;
type ITranscriptByCourse = IBaseApi<{
	UserInformationID: number;
	FullNameUnicode: string;
	CourseID: number;
	CourseName: string;
	PointColumn: {
		SubjectID: number;
		SubjectName: string;
		Point: string;
	}[];
}>;
