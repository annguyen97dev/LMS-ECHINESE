type ITestCustomer = IBaseApi<{
	ID: number;
	BranchID: number;
	BranchName: string;
	UserInformationID: number;
	FullNameUnicode: string;
	AppointmentDate: string;
	Time: string;
	Note: string;
	Status: number;
	StatusName: string;
}>;
