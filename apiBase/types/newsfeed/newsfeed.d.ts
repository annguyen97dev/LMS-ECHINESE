type INewsFeed = IBaseApi<{
	ID: number;
	UserInformationID: number;
	FullNameUnicode: string;
	Avatar: string;
	RoleID: number;
	RoleName: string;
	GroupNewsFeedID: number;
	GroupNewsFeedName: string;
	Content: string;
	TypeFile: number;
	isComment: boolean;
	CommentCount: number;
	isLike: boolean;
	LikeCount: number;
	NewsFeedFile: {
		ID: number;
		NameFile: string;
		Type: number;
		TypeName: string;
		UID: string;
		Thumnail: string;
		//
		name?: string;
		type?: string;
		preview?: string;
		uid?: string;
		url?: string;
		Enable?: boolean;
	}[];
	NewsFeedBranch: {
		ID: number;
		BranchID: number;
		BranchName: string;
	}[];
}>;
