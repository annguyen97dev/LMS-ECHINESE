type IStatAverageAgeOfStudent = IBaseApi<{
	ID: number;
	Age: string;
	Amount: number;
}>;
type IStatPercentStudentByArea = IBaseApi<{
	AreaID: number;
	AreaName: string;
	Amount: number;
}>;

type IStatPercentStudentBySource = IBaseApi<{
	SourceInformationID: number;
	SourceInformationName: string;
	Amount: number;
}>;

type IStatCoursePurchased = IBaseApi<{
	ID: number;
	CourseName: string;
	TotalPurchases: number;
}>;

type IStatJobOfStudent = IBaseApi<{
	JobID: number;
	JobName: string;
	Amount: number;
}>;

type IStatSalaryOfStaff = IBaseApi<{
	RoleID: number;
	RoleName: string;
	SalaryTotal: number;
}>;

type IStatDataBarChart = IBaseApi<{
	ID: number;
	dataKey: string;
	sortName: sting;
	value: number;
	title: string;
}>;

type IStatRankTeacherByLessons = IBaseApi<{
	UserInformationID: number;
	RoleID: number;
	FullNameUnicode: string;
	Avatar: string;
	TotalLesson: number;
	TotalRow: number;
}>;

type IStatTotalLessonOfTeacher = IBaseApi<{
	UserInformationID: number;
	RoleID: number;
	FullNameUnicode: string;
	Avatar: string;
	Email: string;
	Mobile: string;
	TotalLesson: number;
	TotalRow: number;
}>;
