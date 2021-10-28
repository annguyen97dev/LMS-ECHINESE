type IPayrollFix = IBaseApi<{
	ID: number;
	TeacherID: number;
	TeacherName: string;
	Amount: number;
	Salary: number;
	StatusID: number;
	StatusName: string;
	Month: number;
	Year: number;
	PaymentDate: Date;
}>;
