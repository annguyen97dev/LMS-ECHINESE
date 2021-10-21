type ICourseOfStudentPrice = IBaseApi<{
	ID: number;
	Course: {
		ID: number;
		CourseName: string;
		TypeCourse: number;
		TypeCourseName: string;
	}[];
	UserInformationID: number;
	FullNameUnicode: string;
	PayBranchID: number;
	PayBranchName: string;
	Price: number;
	DiscountCode: string;
	Reduced: number;
	Paid: number;
	MoneyInDebt: number;
	PaymentMethodsID: number;
	PaymentMethodsName: string;
	DonePaid: boolean;
	PayDate: string;
	isRefunds: boolean;
	RefundsID: number;
}>;
