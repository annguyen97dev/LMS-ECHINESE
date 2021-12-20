type ICourseOfStudent = IBaseApi<{
	ID: number;
	BranchID: number;
	BranchName: string;
	CourseID: number;
	CourseName: string;
	StartDay: string;
	EndDay: string;
	Price: number;
	UserInformationID: number;
	FullNameUnicode: string;
	Warning: boolean;
	Examresult: string;
	CourseOfStudentPriceID: number;
	Commitment: string;
	Note: string;
	Combo: boolean;
	isContract: boolean;
	Enable: boolean;
	CreatedBy: string;
	CreatedOn: string;
	ModifiedBy: string;
	ModifiedOn: string;
}>[];
type ICourseTrial = IBaseApi<{
	CourseID: number;
	UserInformationID: number;
	Note: string;
	TrialStart: number; //lấy CourseScheduleID
	TrialEnd: number; //lấy CourseScheduleID
}>[];
type ICourseOfStudentPrice = IBaseApi<{
	ID: number;
	Course: [
		{
			ID: number;
			CourseName: string;
			TypeCourse: number;
			TypeCourseName: string;
		}
	];
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
	Note: string;
	Enable: boolean;
	CreatedBy: string;
	CreatedOn: string;
	ModifiedBy: string;
	ModifiedOn: string;
}>[];
