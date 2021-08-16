type INewsFeedCommentReply = IBaseApi<{
    ID: number,
    NewsFeedCommentID: number,
    UserInformationID: number,
    FullNameUnicode: string,
    ReplyContent:  string,
    Enable: boolean,
    CreatedOn: string,
    CreatedBy: string,
    ModifiedOn: string,
    ModifiedBy: string
    Avatar: string
}>;