type INewsFeedComment = IBaseApi<{
	Avatar: string;
	ID: number;
	UserInformationID: number;
	FullNameUnicode: string;
	NewsFeedID: number;
	CommentContent: string;
	isReply: boolean;
}>;
