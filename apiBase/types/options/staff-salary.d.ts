type IStaffSalary = IBaseApi<{
	SalaryID: number;
	UserInformationID: number;
	FullName: string;
	UserName: string;
	Email: string;
	Role: string;
	Salary: number;
	Style: number;
	StyleName: string;
	ModifiedBy: string;
	ModifiedDat: string;
}>;

type IStaffExportExcel = IBaseApi<{
	Bank: string;
	BankAccountHolderName: string;
	BankAccountNumber: string;
	BankBranch: string;
	FullNameUnicode: string;
	Reason: string;
	Salary: number;
	UserCode: string;
	RoleName: string;
}>;

type ITeacherExportExcel = IBaseApi<{
	Bank: string;
	BankAccountHolderName: string;
	BankAccountNumber: string;
	BankBranch: string;
	FullNameUnicode: string;
	Reason: string;
	Salary: number;
	UserCode: string;
	RoleName: string;
}>;
