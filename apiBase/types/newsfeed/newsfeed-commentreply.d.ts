type INewsFeedCommentReply = IBaseApi<{
	ID: number;
	NewsFeedCommentID: number;
	UserInformationID: number;
	FullNameUnicode: string;
	ReplyContent: string;
	Avatar: string;
}>;
