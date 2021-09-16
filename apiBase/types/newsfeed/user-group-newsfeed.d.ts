type IUserGroupNewsFeed = IBaseApi<{
	ID: number;
	GroupNewsFeedID: number;
	GroupNewsFeedName: string;
	UserInformationID: number;
	FullNameUnicode: string;
	RoleID: number;
	RoleName: string;
	Avatar: string;
}>;
