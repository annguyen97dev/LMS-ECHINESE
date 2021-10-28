type IStaffSalary = IBaseApi<{
	ID: number;
	StaffID: number;
	StaffName: string;
	DayOfMonthNumber: number;
	Year: number;
	Month: number;
	BasicSalary: number;
	AdvanceSalary: number;
	CountOff: number;
	SalaryOff: number;
	isClosing: boolean;
	Bonus: number;
	NoteBonus: string;
	TotalSalary: number;
	StatusID: number;
	StatusName: string;
	isDonePaid: boolean;
	Enable: boolean;
	CreatedOn: string;
	CreatedBy: string;
	ModifiedOn: string;
	ModifiedBy: string;
}>[];

type IStaffUpdate = IBaseApi<{
	AdvanceSalary: number;
	Bonus: number;
	ID: number;
	NoteBonus: string;
	StatusID: number;
	isClosing: boolean;
	isDonePaid: boolean;
}>[];
