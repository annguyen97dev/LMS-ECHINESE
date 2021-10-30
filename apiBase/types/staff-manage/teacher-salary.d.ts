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

type ITeacherSalaryDetail = IBaseApi<{
	TeacherID: number;
	TeacherName: string;
	CourseID: number;
	CourseName: string;
	SalaryOfLesson: number;
	CurriculumsDetailID: number;
	LessonNumber: number;
	Date: string;
	StudyTimeID: number;
	StudyTimeName: string;
}>[];

type ITeacherSalaryFixExam = IBaseApi<{
	ID: number;
	TeacherID: number;
	TeacherName: string;
	SetPackageDetailID: number;
	SetPackageID: number;
	SetPackageName: string;
	ExamTopicID: number;
	ExamTopicName: string;
	SetPackageResultID: number;
	StudentID: number;
	StudentName: string;
	isPayroll: boolean;
	PayrollFixID: number;
	Enable: boolean;
	CreatedOn: string;
	CreatedBy: string;
	ModifiedOn: string;
	ModifiedBy: string;
}>[];
