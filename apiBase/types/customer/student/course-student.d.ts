type ICourseOfStudent = IBaseApi<{
	ID: number;
	BranchID: number;
	BranchName: string;
	CourseID: number;
	CourseName: number;
	StartDay: string;
	EndDay: string;
	Price: number;
	UserInformationID: number;
	FullNameUnicode: number;
	Warning: true;
	Examresult: number;
	CourseOfStudentPriceID: number;
	Commitment: string;
	Note: number;
	Combo: boolean;
	isContract: boolean;
}>;

type ICourseOfStudentChange = IBaseApi<{
	CourseOfStudentID: number; //int ID
	CourseIDAfter: number; //int ID khóa học mới
	Paid: number; //số tiền thanh toán thêm
	Note: string;
	Commitment: string;
}>;
