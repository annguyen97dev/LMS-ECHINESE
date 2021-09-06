type IContractCustomerList = IBaseApi<{
	ID: number;
	UserInformationID: number;
	FullNameUnicode: string;
	CourseID: number;
	CourseName: string;
	CourseOfStudentID: number;
	ContractContent: string;
	Accept: boolean;
}>;
