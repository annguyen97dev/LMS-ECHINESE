type ITaskGroup = IBaseApi<{
	ID: number;
	TaskGroupName: string;
	Note: string;
	Deadline: string;
	DonePercent: number;
	DoneTaskGroup: boolean;
}>;
type ITask = IBaseApi<{
	ID: number;
	WorkContent: string;
	TaskGroupID: number;
	TaskGroupName: string;
	StaffID: number;
	StaffName: string;
	DoneTask: boolean;
	RoleID: number;
	RoleName: string;
}>;
type IStaffOfTaskGroup = IBaseApi<{
	ID: number;
	TaskGroupID: number;
	TaskGroupName: string;
	StaffID: number;
	StaffName: string;
	RoleID: number;
	RoleName: string;
}>;
