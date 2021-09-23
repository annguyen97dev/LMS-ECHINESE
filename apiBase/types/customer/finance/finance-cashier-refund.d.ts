type IRefunds = IBaseApi<{
	ID: number;
	BranchID: number;
	BranchName: string;
	UserInformationID: number;
	FullNameUnicode: string;
	Mobile: number;
	Price: number;
	StatusID: number;
	StatusName: string;
	PaymentMethodsID: number;
	PaymentMethodsName: string;
	isExpulsion: boolean;
	Reason: string;
	RefundsDetail: {
		CourseID: number;
		CourseName: string;
		CourseOfStudentID: number;
		TypeCourse: number;
		TypeCourseName: string;
	}[];
}>;
