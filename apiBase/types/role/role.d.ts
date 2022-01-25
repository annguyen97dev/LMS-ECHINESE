type IRole = IBaseApi<{
	ID: number;
	name: string;
}>;

type IMenuByRole = IBaseApi<{
	ID: number;
	MenuName: string;
	Icon: string;
	ParentID: number;
	Route: string;
	RoleID: number;
}>;
