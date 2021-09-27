type IStudentChangeCourse = IBaseApi<{
	ID: number;
	UserInformationID: number;
	FullNameUnicode: string;
	CourseIDBefore: number;
	CourseNameBefore: string;
	CourseIDAfter: number;
	CourseNameAfter: string;
	Note: string;
	BranchID: number;
	BranchName: string;
	Commitment: string;
}>;
