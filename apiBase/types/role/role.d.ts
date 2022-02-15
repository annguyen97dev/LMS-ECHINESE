type IRole = IBaseApi<{
	ID: number;
	name: string;
}>;

type IMenuByRole = IBaseApi<{
	Enable: boolean;
	ID: number;
	Icon: string;
	Level: number;
	MenuName: string;
	ParentID: number;
	RoleID: number;
	Route: string;
	SingleMenu?: boolean;
}>;

type IMenuAddData = {
	Level: number;
	RoleID: number;
	Icon: string;
	MenuName: string;
	SingleMenu?: boolean;
};
type IMenuEditData = {
	ID: number;
	Level?: number;
	RoleID?: number;
	ParentID?: number;
	Icon?: string;
	MenuName?: string;
	Enable: boolean;
	SingleMenu?: boolean;
};
