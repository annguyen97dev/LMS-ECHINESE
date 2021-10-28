type ITeacherSalary = IBaseApi<{
	ID: number;
	TeacherID: number;
	TeacherName: string;
	Year: number;
	Month: number;
	Salary: number;
	AdvanceSalary: number;
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

type ITeacherUpdate = IBaseApi<{
	AdvanceSalary: number;
	Bonus: number;
	ID: number;
	NoteBonus: string;
	StatusID: number;
	isClosing: boolean;
	isDonePaid: boolean;
}>[];
